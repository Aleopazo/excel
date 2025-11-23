import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "patient") {
    redirect("/doctor");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/patient"
              className="text-lg font-semibold text-slate-900"
            >
              Portal paciente · Auracare
            </Link>
            <p className="text-xs text-slate-500">Atención asincrónica segura</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Link
              href="/patient"
              className="rounded-full px-4 py-2 hover:bg-slate-100"
            >
              Casos
            </Link>
            <Link
              href="/patient/nueva"
              className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Nueva atención
            </Link>
            <span className="hidden text-xs text-slate-400 sm:inline-flex">
              {user.name}
            </span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
