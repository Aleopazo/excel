import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { mapCaseRow } from "@/lib/cases";
import { formatDate } from "@/lib/format";
import { statusColor, statusCopy } from "@/lib/status";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function PatientDashboardPage() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "patient") {
    redirect("/doctor");
  }

  const rows = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       WHERE cases.user_id = ?
       ORDER BY cases.created_at DESC`,
    )
    .all(user.id);

  const cases = rows.map(mapCaseRow);
  const pending = cases.filter((item) => item.status !== "closed").length;
  const closed = cases.filter((item) => item.status === "closed").length;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Resumen
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Hola {user.name?.split(" ")[0] ?? ""}, tu portal asincrónico está activo.
            </h1>
            <p className="text-sm text-slate-500">
              Crea nuevas atenciones, revisa estados y descarga evoluciones médicas.
            </p>
          </div>
          <Link
            href="/patient/nueva"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600"
          >
            Completar cuestionario
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardStat label="Casos activos" value={pending} helper="Por revisar o en revisión" />
          <DashboardStat label="Casos cerrados" value={closed} helper="Evoluciones emitidas" />
          <DashboardStat
            label="Tiempo promedio"
            value="12h"
            helper="Compromiso de respuesta clínica"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-900/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Seguimiento de atenciones</h2>
            <p className="text-sm text-slate-500">
              Cada caso incluye el cuestionario completo y la evolución médica cuando esté lista.
            </p>
          </div>
          <span className="text-sm text-slate-500">{cases.length} casos registrados</span>
        </div>

        <div className="mt-6 space-y-4">
          {cases.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              Aún no tienes atenciones. Inicia una nueva para recibir orientación médica.
            </div>
          )}

          {cases.map((item) => (
            <Link
              key={item.id}
              href={`/patient/casos/${item.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 transition hover:border-emerald-200 hover:bg-emerald-50/30 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Ticket #{item.paymentReference}
                </p>
                <h3 className="text-xl font-semibold text-slate-900">
                  Atención asincrónica · {formatDate(item.createdAt)}
                </h3>
                <p className="text-sm text-slate-500">{statusCopy[item.status].description}</p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold ring-1 ${statusColor(item.status)}`}
                >
                  {statusCopy[item.status].label}
                </span>
                <p className="text-xs text-slate-400">
                  Última actualización · {formatDate(item.updatedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 p-6 shadow-inner shadow-slate-900/5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="text-sm text-slate-400">{helper}</p>
    </div>
  );
}
