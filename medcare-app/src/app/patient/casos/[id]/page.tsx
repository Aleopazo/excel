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

export default function PatientCaseDetail({ params }: Params) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "patient") redirect("/doctor");

  const record = db
    .prepare(
      `SELECT cases.*, users.name as patient_name, users.email as patient_email
       FROM cases
       INNER JOIN users ON users.id = cases.user_id
       WHERE cases.id = ? AND cases.user_id = ?`,
    )
    .get(Number(params.id), user.id);

  if (!record) {
    notFound();
  }

  const caseData = mapCaseRow(record);

  return (
    <div className="space-y-8">
      <Link href="/patient" className="text-sm font-semibold text-emerald-600">
        ← Volver al resumen
      </Link>

      <header className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Ticket {caseData.paymentReference}</p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Atención asincrónica · {formatDate(caseData.createdAt)}
            </h1>
            <p className="text-sm text-slate-500">
              Creado y pagado correctamente. Estado actual del expediente:
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold ring-2 ${statusColor(caseData.status)}`}
          >
            {statusCopy[caseData.status].label}
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Detail label="Pago" value={`$${caseData.paymentAmount.toFixed(2)} USD`} />
          <Detail label="Creado" value={formatDate(caseData.createdAt)} />
          <Detail label="Último movimiento" value={formatDate(caseData.updatedAt)} />
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Cuestionario enviado</h2>
              <p className="text-sm text-slate-500">
                Respuestas que recibió el equipo clínico para analizar tu caso.
              </p>
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              20 respuestas registradas
            </p>
          </div>
          <dl className="mt-6 grid gap-4">
            {Object.entries(caseData.questionnaire).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-slate-100 p-4 shadow-inner shadow-slate-900/5"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {formatLabel(key)}
                </dt>
                <dd className="mt-2 text-sm text-slate-900">{value || "No informado"}</dd>
              </div>
            ))}
          </dl>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-900/5">
            <p className="text-sm font-semibold text-slate-500">Comprobante de pago</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {caseData.paymentStatus === "paid" ? "Confirmado" : "Pendiente"}
            </p>
            <p className="text-sm text-slate-500">Referencia {caseData.paymentReference}</p>
            <p className="mt-4 text-xs text-slate-400">
              El cargo se refleja con la misma referencia dentro de tu extracto.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-900/5">
            <p className="text-sm font-semibold text-slate-500">Evolución médica</p>
            {caseData.medicalSummary ? (
              <>
                <p className="mt-2 text-sm text-slate-900 whitespace-pre-line">
                  {caseData.medicalSummary}
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  Emitido el {formatDate(caseData.updatedAt)} por el staff médico.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Aún no se ha liberado la evolución. Te notificaremos por correo cuando esté lista.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4 shadow-inner shadow-slate-900/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
