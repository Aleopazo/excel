import { QuestionnaireForm } from "@/components/patient/questionnaire-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function NewCasePage() {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "patient") {
    redirect("/doctor");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-500">Nuevo caso</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Cuestionario y pago para activar tu atención.
        </h1>
        <p className="text-sm text-slate-500">
          Tus respuestas se guardan automáticamente en tu expediente con estado “por revisar”.
        </p>
      </div>
      <QuestionnaireForm />
    </div>
  );
}
