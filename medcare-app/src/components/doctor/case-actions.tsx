"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statusOptions = [
  { value: "pending_review", label: "Por revisar" },
  { value: "in_review", label: "En revisión" },
  { value: "closed", label: "Cerrado" },
];

export function DoctorCaseActions({
  caseId,
  defaultStatus,
  defaultSummary,
}: {
  caseId: number;
  defaultStatus: "pending_review" | "in_review" | "closed";
  defaultSummary?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(defaultStatus);
  const [summary, setSummary] = useState(defaultSummary ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (status === "closed" && !summary.trim()) {
      setError("Agrega la evolución médica antes de cerrar.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          medicalSummary: summary.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No fue posible actualizar el caso");
      }

      setSuccess("Caso actualizado correctamente.");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Estado clínico
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setStatus(option.value as typeof defaultStatus)}
              className={`rounded-full px-4 py-2 text-sm ${
                status === option.value
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Evolución médica para el paciente
        </label>
        <textarea
          rows={7}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none ring-emerald-200 focus:ring-2"
          placeholder="Sintomatología analizada, diagnóstico probable, plan terapéutico sugerido, signos de alarma…"
        />
      </div>

      {error && <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      {success && (
        <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
