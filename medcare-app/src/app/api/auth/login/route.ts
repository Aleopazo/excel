import db from "@/lib/db";
import {
  createSession,
  serializeUser,
  verifyPassword,
} from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase());

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    return NextResponse.json(
      { error: "Correo o contraseña incorrectos" },
      { status: 401 },
    );
  }

  createSession(user.id);

  return NextResponse.json({ user: serializeUser(user) });
}
