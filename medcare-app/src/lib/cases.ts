export type CaseStatus = "pending_review" | "in_review" | "closed";

export type RawCaseRow = {
  id: number;
  user_id: number;
  patient_name?: string;
  name?: string;
  patient_email?: string;
  email?: string;
  status: CaseStatus;
  payment_status: "pending" | "paid";
  payment_reference?: string | null;
  payment_amount?: number | null;
  created_at: string;
  updated_at: string;
  doctor_id?: number | null;
  medical_summary?: string | null;
  questionnaire?: string;
};

export type CaseRecord = {
  id: number;
  userId: number;
  patientName: string;
  patientEmail: string;
  status: CaseStatus;
  paymentStatus: "pending" | "paid";
  paymentReference?: string;
  paymentAmount: number;
  createdAt: string;
  updatedAt: string;
  doctorId?: number;
  medicalSummary?: string | null;
  questionnaire: Record<string, string>;
};

export function mapCaseRow(row: RawCaseRow): CaseRecord {
  return {
    id: row.id,
    userId: row.user_id,
    patientName: row.patient_name ?? row.name ?? "",
    patientEmail: row.patient_email ?? row.email ?? "",
    status: row.status,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference ?? undefined,
    paymentAmount: row.payment_amount ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    doctorId: row.doctor_id ?? undefined,
    medicalSummary: row.medical_summary,
    questionnaire: JSON.parse(row.questionnaire ?? "{}"),
  };
}
