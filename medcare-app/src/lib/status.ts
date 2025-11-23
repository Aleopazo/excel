import type { CaseStatus } from "./cases";

export const statusCopy: Record<CaseStatus, { label: string; description: string }> =
  {
    pending_review: {
      label: "Por revisar",
      description: "Pago confirmado, esperando revisión médica",
    },
    in_review: {
      label: "En revisión",
      description: "El caso está siendo evaluado por el equipo clínico",
    },
    closed: {
      label: "Cerrado",
      description: "La evolución médica fue emitida y compartida",
    },
  };

export function statusColor(status: CaseStatus) {
  switch (status) {
    case "pending_review":
      return "bg-amber-100 text-amber-800 ring-amber-200";
    case "in_review":
      return "bg-blue-100 text-blue-800 ring-blue-200";
    case "closed":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}
