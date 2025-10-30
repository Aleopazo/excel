import Link from "next/link";

const footerLinks = [
  { label: "Manifesto", href: "#" },
  { label: "Equipo científico", href: "#" },
  { label: "Protocolos Jung", href: "#" },
  { label: "Serena Labs", href: "#" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-forest/10 bg-brand-midnight text-brand-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl">Serum Atelier</p>
          <p className="mt-2 text-sm text-brand-ivory/60">
            Ciencia y diseño sensorial para transformar resultados clínicos en rituales cotidianos.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-brand-ivory/60">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-brand-ivory">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-brand-ivory/50">© {new Date().getFullYear()} Serum Atelier. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
