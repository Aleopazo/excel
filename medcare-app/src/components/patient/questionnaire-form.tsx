"use client";

import { questionnaire, type Question } from "@/lib/questionnaire";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const plans = [
  { id: "urgente", label: "Resolutivo 24h", description: "Ideal para cuadros agudos", price: 85 },
  { id: "integral", label: "Integral 12h", description: "Prioridad clínica y seguimiento", price: 120 },
  { id: "control", label: "Control 48h", description: "Casos de seguimiento", price: 65 },
];

export function QuestionnaireForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>(
    questionnaire.reduce(
      (acc, question) => ({ ...acc, [question.id]: "" }),
      {} as Record<string, string>,
    ),
  );
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const plan = useMemo(
    () => plans.find((item) => item.id === selectedPlan) ?? plans[0],
    [selectedPlan],
  );

  function handleChange(question: Question, value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function detectBrand(card: string) {
    const trimmed = card.replace(/\s+/g, "");
    if (/^4[0-9]{6,}$/.test(trimmed)) return "VISA";
    if (/^5[1-5][0-9]{5,}$/.test(trimmed)) return "Mastercard";
    if (/^3[47][0-9]{5,}$/.test(trimmed)) return "AMEX";
    return "CARD";
  }

  function pendingFields() {
    const unanswered = Object.entries(answers).filter(([, value]) => !value.trim());
    return unanswered.length <= 5 ? unanswered.map(([key]) => key) : [];
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!cardName || !cardNumber || !expiry || !cvv) {
      setError("Completa los datos de pago para continuar.");
      return;
    }

    const cleanCard = cardNumber.replace(/\s+/g, "");
    if (cleanCard.length < 12) {
      setError("El número de tarjeta no es válido.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          payment: {
            amount: plan.price,
            cardBrand: detectBrand(cleanCard),
            cardLast4: cleanCard.slice(-4),
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No fue posible crear la atención");
      }

      const data = await response.json();
      setSuccess("Atención creada correctamente. Redirigiendo...");
      setTimeout(() => {
        router.replace(`/patient/casos/${data.case.id}`);
        router.refresh();
      }, 1200);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-900/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
              Paso 1 · Cuestionario clínico
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Ayúdanos a entender el contexto de tu consulta.
            </h2>
            <p className="text-sm text-slate-500">
              Responde con el mayor detalle posible. Podrás adjuntar estudios mediante enlaces.
            </p>
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {pendingFields().length} respuestas pendientes
          </p>
        </div>
        <div className="mt-8 grid gap-5">
          {questionnaire.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleChange(question, value)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-900/5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
            Paso 2 · Selecciona el plan
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Confirmaremos tu pago para activar la revisión.
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((planOption) => (
              <button
                key={planOption.id}
                type="button"
                onClick={() => setSelectedPlan(planOption.id)}
                className={`rounded-2xl border px-4 py-4 text-left shadow-inner transition ${
                  selectedPlan === planOption.id
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{planOption.label}</p>
                <p className="text-xs text-slate-500">{planOption.description}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  ${planOption.price}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600">Titular</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-200 focus:ring-2"
                placeholder="Nombre del titular"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Número de tarjeta</label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-200 focus:ring-2"
                placeholder="•••• •••• •••• ••••"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Vigencia</label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-200 focus:ring-2"
                placeholder="MM/AA"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">CVV</label>
              <input
                type="password"
                required
                value={cvv}
                onChange={(event) => setCvv(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-200 focus:ring-2"
                placeholder="***"
              />
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-900/5">
            <p className="text-sm font-semibold text-slate-500">Resumen de la atención</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• El equipo médico revisará tu cuestionario y responderá con una evolución.</li>
              <li>• Recibirás notificaciones por correo ante cualquier actualización.</li>
              <li>• Puedes adjuntar estudios mediante enlaces públicos.</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
              <p className="text-sm text-slate-300">Importe a pagar</p>
              <p className="text-3xl font-semibold">
                ${plan.price} <span className="text-base font-normal">USD</span>
              </p>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {submitting ? "Procesando pago..." : "Confirmar y pagar"}
          </button>
          <p className="text-center text-xs text-slate-400">
            La transacción se procesa dentro de la infraestructura segura de la clínica.
          </p>
        </aside>
      </section>
    </form>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}) {
  const common =
    "mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-emerald-200 focus:ring-2";

  return (
    <label className="block rounded-2xl border border-slate-100 p-4 shadow-inner shadow-slate-900/5">
      <span className="text-sm font-semibold text-slate-700">{question.label}</span>
      {question.helper && (
        <p className="text-xs text-slate-400">{question.helper}</p>
      )}
      {question.type === "textarea" && (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${common} resize-none`}
          placeholder={question.placeholder}
        />
      )}
      {question.type === "text" && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={common}
          placeholder={question.placeholder}
        />
      )}
      {question.type === "select" && (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={common}
        >
          <option value="">Selecciona una opción</option>
          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {question.type === "radio" && (
        <div className="mt-2 flex flex-wrap gap-3">
          {question.options?.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-4 py-2 text-sm ${
                value === option.value
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </label>
  );
}
