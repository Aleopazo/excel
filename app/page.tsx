import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock3, FlaskConical, Headphones, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supplementFormulas, researchLibrary, bioMarkers } from "@/data/research";

const tierShowcase = supplementFormulas.filter((item) => ["tier1-core", "tier2-sleep", "tier2-performance", "tier2-woman", "tier2-skin", "tier3-pro"].includes(item.id));

const differentiators = [
  {
    title: "Protocolos clínicos custom",
    description: "Inspirados en Jung y Serena Love, mezclamos ciencia funcional y biotecnología para formular cada stack.",
    icon: FlaskConical
  },
  {
    title: "Equipo médico asincrónico",
    description: "Teleconsultas, chat seguro y feedback quincenal basado en tus métricas y biomarcadores.",
    icon: Headphones
  },
  {
    title: "Laboratorio boutique",
    description: "Kits de sangre a domicilio, cadena en frío certificada y formulaciones magistrales en lotes pequeños.",
    icon: ShieldCheck
  },
  {
    title: "Resultados medibles",
    description: "Panel vivo con HRV, sueño, glucemia y PCR-us; celebramos el progreso con tus propios datos.",
    icon: Clock3
  }
];

const rituals = [
  {
    step: "01",
    label: "Descubrimiento profundo",
    description:
      "Completa nuestro cuestionario clínico respaldado por validaciones PSQI, HOMA-IR y protocolos de deporte de élite."
  },
  {
    step: "02",
    label: "Diseño de fórmula",
    description: "El motor Serum AI cruza tus hábitos, biomarcadores y objetivos para priorizar tiers y stacks."
  },
  {
    step: "03",
    label: "Entrega y onboarding",
    description: "Recibe tu kit en casa con ritual de bienvenida, guía de adherencia y acceso al panel."
  },
  {
    step: "04",
    label: "Iteración continua",
    description: "Cada 4-6 semanas re-evaluamos datos, reformulamos y ajustamos coaching y telemedicina."
  }
];

export default function HomePage() {
  return (
    <main className="grain-overlay relative overflow-hidden">
      <section className="relative isolate flex min-h-[80vh] flex-col justify-center gap-10 bg-[radial-gradient(circle_at_top,_rgba(35,49,43,0.92),_rgba(17,20,17,0.96))] px-6 py-24 text-brand-ivory sm:px-10 lg:px-24">
        <div className="absolute inset-0 -z-10 opacity-20">
          <Image src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" alt="Laboratorio Serum Atelier" fill className="object-cover object-center mix-blend-overlay" />
        </div>
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em]">Serum Atelier · Ciencia hecha ritual</span>
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Eleva tu bioquímica con un sistema de suplementación en tres tiers, pensado para resultados visibles.
          </h1>
          <p className="text-lg text-brand-ivory/80 sm:text-xl">
            Del Core Balance esencial, a los Boost Stacks para objetivos intensivos, hasta el programa Pro Bespoke con fórmulas magistrales y acompañamiento médico asincrónico.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="shadow-spotlight">
              <Link href="/quiz">Iniciar diagnóstico</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-brand-ivory/50 text-brand-ivory hover:bg-brand-ivory/10">
              <Link href="#tiers" className="flex items-center gap-2">
                Explorar tiers
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/30">
              <Icon className="mb-4 h-8 w-8 text-brand-copper" />
              <h3 className="font-display text-lg">{title}</h3>
              <p className="text-sm text-brand-ivory/80">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tiers" className="relative mx-auto max-w-6xl space-y-16 px-6 py-24 sm:px-10">
        <header className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Tres niveles, un solo lenguaje: ciencia</span>
          <h2 className="font-display text-4xl text-brand-forest">Elige tu tier y evoluciona a tu ritmo</h2>
          <p className="mx-auto max-w-2xl text-brand-forest/80">
            Creamos Tiers que escalan en intensidad. Inicia con Core Balance, añade Boost Stacks según objetivo y aterriza en Pro Bespoke cuando busques iteración clínica continua.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {tierShowcase.map((tier) => (
            <article
              key={tier.id}
              className="flex flex-col rounded-3xl border border-brand-forest/10 bg-white p-8 shadow-spotlight/40 transition hover:-translate-y-1 hover:shadow-spotlight"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl text-brand-forest">{tier.label}</h3>
                <span className="rounded-full bg-brand-forest/10 px-3 py-1 text-xs uppercase tracking-wide text-brand-forest/80">
                  {tier.format}
                </span>
              </div>
              <p className="mt-3 text-sm text-brand-forest/70">{tier.narrative}</p>
              <div className="mt-6 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-forest/60">Activos héroe</h4>
                <ul className="space-y-4">
                  {tier.heroIngredients.map((ingredient) => (
                    <li key={ingredient.name} className="rounded-2xl bg-brand-forest/5 p-4 text-sm">
                      <p className="font-medium text-brand-forest">{ingredient.name}</p>
                      <p className="text-xs uppercase tracking-wide text-brand-forest/60">{ingredient.dosage}</p>
                      <p className="mt-2 text-sm text-brand-forest/70">{ingredient.rationale}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-brand-forest/10 pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-forest/60">Cadencia</h4>
                <p className="mt-2 text-sm text-brand-forest/70">{tier.cadence}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="investigacion" className="bg-brand-midnight/95 px-6 py-24 text-brand-ivory sm:px-10">
        <div className="mx-auto max-w-5xl space-y-12">
          <header className="space-y-4 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-ivory/60">Metodología Serum Research Lab</span>
            <h2 className="font-display text-4xl">Investigación aplicada a cada decisión</h2>
            <p className="mx-auto max-w-2xl text-brand-ivory/80">
              Nuestro equipo revisa literatura clínica trimestralmente. Los stacks se actualizan con meta-análisis recientes y protocolos propios, asegurando coherencia médica real.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {researchLibrary.slice(0, 6).map((paper) => (
              <article key={paper.id} className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="text-xs uppercase tracking-[0.3em] text-brand-ivory/50">{paper.journal}</span>
                <h3 className="mt-4 font-display text-lg leading-snug text-brand-ivory">{paper.title}</h3>
                <p className="mt-4 text-sm text-brand-ivory/80">{paper.summary}</p>
                <ul className="mt-4 space-y-2 text-xs text-brand-ivory/60">
                  {paper.outcomeHighlights.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
                <Link
                  href={paper.url}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-xs uppercase tracking-[0.25em] text-brand-copper transition hover:text-brand-ivory"
                >
                  Ver estudio
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.25fr,1fr]">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Cómo trabajamos</span>
            <h2 className="font-display text-4xl text-brand-forest">Ritual de personalización Serum</h2>
            <p className="text-brand-forest/80">
              La experiencia boutique se sostiene en procesos rigurosos: datos, diseño sensorial y seguimiento médico. Cada paso está pensado para que te sientas acompañado y en control de tu biología.
            </p>
            <div className="space-y-6">
              {rituals.map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-forest/20 font-mono text-brand-forest">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-forest">{item.label}</p>
                    <p className="text-sm text-brand-forest/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-3xl border border-brand-forest/10 bg-brand-forest/5 p-8">
            <h3 className="font-display text-2xl text-brand-forest">Biomarcadores que seguimos</h3>
            <p className="mt-2 text-sm text-brand-forest/70">
              Seleccionados por nuestra junta médica funcional para medir impacto real y ajustar formulaciones.
            </p>
            <ul className="mt-6 space-y-4">
              {bioMarkers.map((marker) => (
                <li key={marker.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="font-semibold text-brand-forest">{marker.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-forest/50">Objetivo {marker.optimalRange}</p>
                  <p className="mt-2 text-sm text-brand-forest/70">{marker.description}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-brand-forest/95 px-6 py-24 text-brand-ivory sm:px-10">
        <div className="mx-auto max-w-4xl space-y-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-ivory/60">Preparado para comenzar</span>
          <h2 className="font-display text-4xl">Haz tu intake clínico en menos de 7 minutos</h2>
          <p className="text-brand-ivory/80">
            Responde nuestro cuestionario, recibe un plan tierizado con coherencia médica y descubre cómo Serum Atelier traduce la ciencia en rituales diarios.
          </p>
          <Button asChild size="lg" variant="copper" className="shadow-spotlight">
            <Link href="/quiz">Comenzar cuestionario</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
