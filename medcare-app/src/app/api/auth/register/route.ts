import db from "@/lib/db";
import {
  createSession,
  hashPassword,
  serializeUser,
} from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con ese correo" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const result = db
    .prepare(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    )
    .run(name.trim(), email.toLowerCase(), passwordHash, "patient");

  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid as number);

  createSession(user.id);

  return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
}
