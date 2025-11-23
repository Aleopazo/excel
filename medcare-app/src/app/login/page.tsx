import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const user = getCurrentUser();
  if (user) {
    redirect(user.role === "doctor" ? "/doctor" : "/patient");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden flex-1 lg:block">
        <div className="gradient-primary h-full w-full" />
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="text-sm font-semibold text-emerald-600">
              Auracare Connect
            </Link>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-slate-500">
              Ingresa con tu correo para continuar con tus casos.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-100">
            <LoginForm />
            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Aún no tienes cuenta?{" "}
              <Link href="/register" className="font-semibold text-emerald-600">
                Regístrate aquí
              </Link>
            </p>
          </div>
          <p className="text-center text-xs text-slate-400">
            Equipo médico: usa el acceso provisto por la clínica.
          </p>
        </div>
      </div>
    </div>
  );
}
