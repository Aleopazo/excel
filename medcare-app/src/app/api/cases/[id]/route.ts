import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mapCaseRow } from "@/lib/cases";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  params: {
    id: string;
  };
};

const updateSchema = z.object({
  status: z.enum(["pending_review", "in_review", "closed"]).optional(),
  medicalSummary: z.string().max(4000).optional(),
});

export async function GET(request: Request, { params }: Params) {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const caseId = Number(params.id);
  const record = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       WHERE cases.id = ?`,
    )
    .get(caseId);

  if (!record) {
    return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
  }

  if (user.role === "patient" && record.user_id !== user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json({ case: mapCaseRow(record) });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = getCurrentUser();
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Solo médicos" }, { status: 401 });
  }

  const caseId = Number(params.id);
  const existing = db.prepare("SELECT * FROM cases WHERE id = ?").get(caseId);

  if (!existing) {
    return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
  }

  const payload = await request.json();
  const parsed = updateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { status, medicalSummary } = parsed.data;

  if (status === "closed" && !medicalSummary) {
    return NextResponse.json(
      { error: "La evolución médica es obligatoria para cerrar" },
      { status: 400 },
    );
  }

  const updates: string[] = [];
  const values: Array<string | number> = [];

  if (status) {
    updates.push("status = ?");
    values.push(status);
  }

  if (typeof medicalSummary === "string") {
    updates.push("medical_summary = ?");
    values.push(medicalSummary.trim());
  }

  updates.push("doctor_id = ?");
  values.push(user.id);
  updates.push("updated_at = datetime('now')");

  const setClause = updates.join(", ");

  db.prepare(`UPDATE cases SET ${setClause} WHERE id = ?`).run(...values, caseId);

  const updated = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       WHERE cases.id = ?`,
    )
    .get(caseId);

  return NextResponse.json({ case: mapCaseRow(updated) });
}
