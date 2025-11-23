import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const user = getCurrentUser();
  if (user) {
    redirect(user.role === "doctor" ? "/doctor" : "/patient");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <div className="flex flex-1 flex-col justify-between px-6 py-16 lg:px-16">
        <div className="space-y-4">
          <Link href="/" className="text-sm font-semibold text-emerald-600">
            Auracare Connect
          </Link>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            Activa la atención asincrónica de tu clínica.
          </h1>
          <p className="text-base text-slate-500">
            Regístrate con tu correo para acceder al portal seguro, completar el
            cuestionario y gestionar tus atenciones.
          </p>
        </div>
        <div className="hidden gap-4 text-sm text-slate-500 lg:flex">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
            <p className="font-semibold text-slate-900">12h promedio</p>
            <p>en respuesta médica</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
            <p className="font-semibold text-slate-900">100% trazable</p>
            <p>pagos y evoluciones</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-16 shadow-2xl shadow-slate-900/10 lg:px-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <p className="text-sm font-semibold text-slate-500">Paciente nuevo</p>
            <h2 className="text-3xl font-semibold text-slate-900">Crear perfil</h2>
          </div>
          <div className="rounded-3xl border border-slate-100 p-8 shadow-lg shadow-slate-900/5">
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Ya tienes acceso?{" "}
              <Link href="/login" className="font-semibold text-emerald-600">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
