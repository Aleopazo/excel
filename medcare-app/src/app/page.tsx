import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Stethoscope } from "lucide-react";

const differentiators = [
  {
    title: "Cuestionario clínico guiado",
    description:
      "20 preguntas inteligentes que capturan el contexto clínico antes del pago.",
  },
  {
    title: "Pagos seguros y trazables",
    description:
      "Cada atención queda asociada a un comprobante con referencia única para auditoría.",
  },
  {
    title: "Revisión médica asincrónica",
    description:
      "El equipo médico accede a tableros claros para priorizar, responder y cerrar cada caso.",
  },
];

const steps = [
  {
    title: "Paciente completa cuestionario premium",
    copy: "Diseñado para clínicas de alta reputación, con foco en seguridad diagnóstica.",
  },
  {
    title: "Pago confirmado y caso por revisar",
    copy: "El expediente digital se crea automáticamente y queda listo para el equipo médico.",
  },
  {
    title: "Médico responde con evolución",
    copy: "El paciente recibe la evolución y recomendaciones dentro del portal seguro.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-white">
          <div className="text-lg font-semibold tracking-wide">Auracare Connect</div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/login" className="hover:text-emerald-200">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20"
            >
              Crear cuenta
            </Link>
          </nav>
        </header>

        <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pb-24">
          <section className="glass-panel mt-4 flex flex-col gap-10 px-12 py-12 text-slate-900 lg:flex-row">
            <div className="flex-1 space-y-8">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
                Atención médica asincrónica premium
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
                Centraliza cuestionarios, pagos y evoluciones médicas en una sola
                plataforma.
              </h1>
              <p className="text-lg text-slate-600 lg:w-3/4">
                Diseñada para clínicas con altos estándares: onboarding clínico guiado,
                validaciones automáticas, tableros médicos y comunicación segura con
                pacientes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600"
                >
                  Crear cuenta para pacientes
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-emerald-400 hover:text-emerald-600"
                >
                  Acceso médicos
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  Cumplimiento interno
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-emerald-500" />
                  Validado por especialistas
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-white/60 bg-white/80 p-8 text-slate-800 shadow-2xl shadow-emerald-900/20">
              <h3 className="text-lg font-semibold text-slate-900">
                ¿Por qué las clínicas la prefieren?
              </h3>
              <div className="space-y-5">
                {differentiators.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl bg-white p-6 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-100"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
                  {index + 1}
                </div>
                <h4 className="text-xl font-semibold text-slate-900">{step.title}</h4>
                <p className="mt-2 text-sm text-slate-500">{step.copy}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
