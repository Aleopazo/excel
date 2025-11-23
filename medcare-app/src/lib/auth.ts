"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db, { type DbUser } from "./db";

export type SessionUser = Omit<DbUser, "password_hash">;

const SESSION_COOKIE = "medcare_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function serializeUser(user: DbUser): SessionUser {
  const { password_hash: _ph, ...rest } = user;
  void _ph;
  return rest;
}

export function getSessionToken() {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export function createSession(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(token, userId, expiresAt);

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return token;
}

export function destroySession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    cookieStore.delete(SESSION_COOKIE);
  }
}

export function getCurrentUser(): SessionUser | null {
  const token = getSessionToken();
  if (!token) return null;

  const row = db
    .prepare(
      `SELECT users.id, users.name, users.email, users.role, users.password_hash, sessions.expires_at
       FROM sessions
       INNER JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ?`,
    )
    .get(token);

  if (!row) {
    return null;
  }

  if (row.expires_at < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    const cookieStore = cookies();
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return serializeUser(row);
}

export function requireUser(role?: "patient" | "doctor"): SessionUser {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (role && user.role !== role) {
    redirect(user.role === "doctor" ? "/doctor" : "/patient");
  }
  return user;
}
