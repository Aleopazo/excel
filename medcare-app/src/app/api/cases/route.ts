import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mapCaseRow } from "@/lib/cases";
import { NextResponse } from "next/server";
import { z } from "zod";

const answersSchema = z.record(z.string().max(2000));

const createCaseSchema = z.object({
  answers: answersSchema.refine(
    (value) => Object.keys(value).length >= 10,
    "Completa el cuestionario",
  ),
  payment: z.object({
    amount: z.number().min(1),
    cardBrand: z.string().min(2),
    cardLast4: z.string().length(4),
  }),
});

export async function GET(request: Request) {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const statusFilter =
    status && ["pending_review", "in_review", "closed"].includes(status)
      ? status
      : null;

  let rows;

  if (user.role === "doctor") {
    if (statusFilter) {
      rows = db
        .prepare(
          `SELECT cases.*, users.name as patient_name, users.email as patient_email
           FROM cases
           INNER JOIN users ON users.id = cases.user_id
           WHERE cases.status = ?
           ORDER BY cases.created_at DESC`,
        )
        .all(statusFilter);
    } else {
      rows = db
        .prepare(
          `SELECT cases.*, users.name as patient_name, users.email as patient_email
           FROM cases
           INNER JOIN users ON users.id = cases.user_id
           ORDER BY cases.created_at DESC`,
        )
        .all();
    }
  } else {
    if (statusFilter) {
      rows = db
        .prepare(
          `SELECT cases.*, users.name as patient_name, users.email as patient_email
           FROM cases
           INNER JOIN users ON users.id = cases.user_id
           WHERE cases.user_id = ? AND cases.status = ?
           ORDER BY cases.created_at DESC`,
        )
        .all(user.id, statusFilter);
    } else {
      rows = db
        .prepare(
          `SELECT cases.*, users.name as patient_name, users.email as patient_email
           FROM cases
           INNER JOIN users ON users.id = cases.user_id
           WHERE cases.user_id = ?
           ORDER BY cases.created_at DESC`,
        )
        .all(user.id);
    }
  }

  return NextResponse.json({ cases: rows.map(mapCaseRow) });
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== "patient") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = createCaseSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { answers, payment } = parsed.data;
  const paymentReference = `MC-${Date.now()}`;

  const insert = db.prepare(
    `INSERT INTO cases (
      user_id,
      status,
      payment_status,
      questionnaire,
      payment_reference,
      payment_amount
    ) VALUES (?, 'pending_review', 'paid', ?, ?, ?)`,
  );

  const result = insert.run(
    user.id,
    JSON.stringify(answers),
    paymentReference,
    payment.amount,
  );

  const caseId = Number(result.lastInsertRowid);

  db.prepare(
    `INSERT INTO payments (case_id, reference, provider, brand, last4, amount, status)
     VALUES (?, ?, 'manual', ?, ?, ?, 'succeeded')`,
  ).run(caseId, paymentReference, payment.cardBrand, payment.cardLast4, payment.amount);

  const stored = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       WHERE cases.id = ?`,
    )
    .get(caseId);

  return NextResponse.json(
    { case: mapCaseRow(stored) },
    { status: 201 },
  );
}
