import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mapCaseRow } from "@/lib/cases";
import { formatDate } from "@/lib/format";
import { statusColor, statusCopy } from "@/lib/status";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function DoctorDashboardPage() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "doctor") {
    redirect("/patient");
  }

  const rows = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       ORDER BY
         CASE cases.status
           WHEN 'pending_review' THEN 1
           WHEN 'in_review' THEN 2
           ELSE 3
         END,
         cases.created_at ASC`,
    )
    .all();

  const cases = rows.map(mapCaseRow);
  const pending = cases.filter((item) => item.status === "pending_review").length;
  const inReview = cases.filter((item) => item.status === "in_review").length;
  const closed = cases.filter((item) => item.status === "closed").length;

  return (
    <div className="space-y-8 text-white">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
          Centro de operaciones clínicas
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Casos asincrónicos activos</h1>
            <p className="text-sm text-slate-300">
              Prioriza revisiones pendientes, emite evoluciones y asegura tiempos de respuesta.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-500/20 px-6 py-4 text-emerald-100">
            <p className="text-xs uppercase tracking-wide text-emerald-200">
              SLA comprometido
            </p>
            <p className="text-2xl font-semibold">12 horas</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DoctorStat label="Por revisar" value={pending} helper="Pagados y a la espera" />
          <DoctorStat label="En revisión" value={inReview} helper="Con médico asignado" />
          <DoctorStat label="Cerrados este mes" value={closed} helper="Con evolución enviada" />
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Casos recibidos</h2>
            <p className="text-sm text-slate-300">
              Filtro automático por estado y fecha de creación.
            </p>
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {cases.length} casos totales
          </p>
        </div>
        <div className="mt-6 divide-y divide-white/10">
          {cases.length === 0 && (
            <p className="py-10 text-center text-slate-300">
              No hay atenciones registradas todavía.
            </p>
          )}
          {cases.map((item) => (
            <Link
              key={item.id}
              href={`/doctor/casos/${item.id}`}
              className="flex flex-col gap-4 py-5 transition hover:bg-white/5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm text-slate-400">Ticket {item.paymentReference}</p>
                <p className="text-lg font-semibold">{item.patientName}</p>
                <p className="text-xs text-slate-400">{item.patientEmail}</p>
              </div>
              <div className="flex flex-col gap-1 text-sm text-slate-300 md:flex-row md:items-center md:gap-6">
                <p>Recibido · {formatDate(item.createdAt)}</p>
                <p>Actualizado · {formatDate(item.updatedAt)}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold ring-2 ${statusColor(item.status)}`}
                >
                  {statusCopy[item.status].label}
                </span>
                {item.medicalSummary && (
                  <p className="text-xs text-emerald-200">Evolución lista</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DoctorStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-inner shadow-black/40">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="text-sm text-slate-400">{helper}</p>
    </div>
  );
}
