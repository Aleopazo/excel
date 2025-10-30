"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/quiz", label: "Cuestionario" },
  { href: "#tiers", label: "Tiers" },
  { href: "#investigacion", label: "Investigación" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-forest/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="font-display text-xl text-brand-forest">
          Serum Atelier
        </Link>
        <nav className="hidden gap-6 text-sm text-brand-forest/70 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition hover:text-brand-forest",
                pathname === item.href ? "text-brand-forest" : undefined
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/quiz"
          className="rounded-full border border-brand-forest px-4 py-2 text-xs uppercase tracking-[0.3em] text-brand-forest transition hover:bg-brand-forest hover:text-white"
        >
          Diagnóstico
        </Link>
      </div>
    </header>
  );
}
