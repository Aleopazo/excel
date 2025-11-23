"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No fue posible iniciar sesión");
      }

      const data = await response.json();
      const destination = data.user.role === "doctor" ? "/doctor" : "/patient";
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-slate-600">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-base outline-none ring-emerald-200 focus:ring-2"
          placeholder="tu.correo@clinica.com"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-600">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-base outline-none ring-emerald-200 focus:ring-2"
          placeholder="********"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:opacity-70"
      >
        {loading ? "Validando..." : "Ingresar"}
      </button>
    </form>
  );
}
