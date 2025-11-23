import { DoctorCaseActions } from "@/components/doctor/case-actions";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mapCaseRow } from "@/lib/cases";
import { formatDate } from "@/lib/format";
import { statusColor, statusCopy } from "@/lib/status";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Params = {
  params: {
    id: string;
  };
};

export default function DoctorCaseDetail({ params }: Params) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "doctor") redirect("/patient");

  const record = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       WHERE cases.id = ?`,
    )
    .get(Number(params.id));

  if (!record) {
    notFound();
  }

  const caseData = mapCaseRow(record);

  return (
    <div className="space-y-8 text-white">
      <Link href="/doctor" className="text-sm font-semibold text-emerald-300">
        ← Volver al panel
      </Link>

      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Ticket {caseData.paymentReference}</p>
            <h1 className="text-4xl font-semibold">{caseData.patientName}</h1>
            <p className="text-sm text-slate-400">{caseData.patientEmail}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-6 py-2 text-sm font-semibold ring-2 ${statusColor(caseData.status)}`}
          >
            {statusCopy[caseData.status].label}
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Info label="Recibido" value={formatDate(caseData.createdAt)} />
          <Info label="Última actividad" value={formatDate(caseData.updatedAt)} />
          <Info label="Importe" value={`$${caseData.paymentAmount.toFixed(2)} USD`} />
          <Info label="Estado de pago" value={caseData.paymentStatus === "paid" ? "Confirmado" : "Pendiente"} />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Cuestionario del paciente</h2>
              <p className="text-sm text-slate-300">
                20 respuestas estructuradas para orientación clínica rápida.
              </p>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Adjuntos declarados
            </p>
          </div>
          <dl className="mt-6 grid gap-4">
            {Object.entries(caseData.questionnaire).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {formatLabel(key)}
                </dt>
                <dd className="mt-2 text-sm text-white whitespace-pre-line">
                  {value || "No informado"}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40">
            <p className="text-sm font-semibold text-white">Acciones clínicas</p>
            <p className="text-xs text-slate-400">
              Actualiza el estado y documenta la evolución médica.
            </p>
            <div className="mt-4">
              <DoctorCaseActions
                caseId={caseData.id}
                defaultStatus={caseData.status}
                defaultSummary={caseData.medicalSummary}
              />
            </div>
          </div>

          {caseData.medicalSummary && (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-2xl shadow-black/30">
              <p className="text-sm font-semibold text-emerald-200">Resumen publicado</p>
              <p className="mt-2 text-sm text-white whitespace-pre-line">{caseData.medicalSummary}</p>
              <p className="mt-4 text-xs text-emerald-100">
                Enviado al paciente el {formatDate(caseData.updatedAt)}
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-inner shadow-black/30">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
