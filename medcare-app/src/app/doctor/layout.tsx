import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "doctor") {
    redirect("/patient");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/doctor" className="text-lg font-semibold text-white">
              Panel médico · Auracare
            </Link>
            <p className="text-xs text-slate-400">Gestión clínica asincrónica</p>
          </div>
          <nav className="flex items-center gap-3 text-sm font-medium text-slate-300">
            <Link href="/doctor" className="rounded-full px-4 py-2 hover:bg-white/10">
              Casos
            </Link>
            <span className="hidden text-xs text-slate-500 sm:inline-flex">
              {user.email}
            </span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
