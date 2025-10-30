"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { questionnaire } from "@/data/questions";
import { buildRecommendation, type QuizRecommendation } from "@/lib/recommendation-engine";
import type { AnswerValue } from "@/lib/recommendation-engine";

type FormValues = Record<string, AnswerValue>;

const totalSteps = questionnaire.length;

const scaleOptions = (min: number, max: number) => {
  const arr: number[] = [];
  for (let i = min; i <= max; i += 1) {
    arr.push(i);
  }
  return arr;
};

const MultiSelectBadge = ({ selected, label }: { selected: boolean; label: string }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition ${
      selected ? "border-brand-forest bg-brand-forest text-white" : "border-brand-forest/30 text-brand-forest"
    }`}
  >
    {label}
  </span>
);

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<QuizRecommendation | null>(null);
  const currentQuestion = questionnaire[step];
  const {
    control,
    handleSubmit
  } = useForm<FormValues>({
    defaultValues: questionnaire.reduce((acc, item) => {
      acc[item.id] = item.type === "multi" ? [] : item.type === "scale" ? Math.ceil(((item.scale?.max ?? 5) + (item.scale?.min ?? 1)) / 2) : null;
      return acc;
    }, {} as FormValues)
  });

  const progress = useMemo(() => Math.round(((step + 1) / totalSteps) * 100), [step]);

  const onSubmit = (values: FormValues) => {
    const answers = Object.entries(values).map(([questionId, value]) => ({ questionId, value }));
    const recommendation = buildRecommendation(answers);
    setResult(recommendation);
  };

  const goNext = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const restart = () => {
    setStep(0);
    setResult(null);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="rounded-3xl border border-brand-forest/10 bg-white p-8 shadow-spotlight/40">
        <header className="flex flex-col gap-4 border-b border-brand-forest/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Intake clínico Serum</p>
            <h1 className="mt-2 font-display text-3xl text-brand-forest">Cuestionario de personalización</h1>
            <p className="mt-2 text-sm text-brand-forest/70">
              Responde con honestidad. Utilizamos escalas validadas (PSQI, PSS, HOMA-IR proxy) para recomendar tu tier ideal y priorizar biomarcadores.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="text-sm font-semibold text-brand-forest">Progreso {progress}%</span>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-brand-forest/10">
              <div className="h-full bg-brand-forest transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        {!result && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full bg-brand-forest/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-forest/70">
                    {currentQuestion.dimension}
                  </span>
                  <h2 className="font-display text-2xl text-brand-forest">{currentQuestion.title}</h2>
                  {currentQuestion.rationale && (
                    <p className="text-sm text-brand-forest/60">{currentQuestion.rationale}</p>
                  )}
                </div>

                <Controller
                  name={currentQuestion.id}
                  control={control}
                  render={({ field }) => {
                    if (currentQuestion.type === "scale" && currentQuestion.scale) {
                      const { min, max, labels } = currentQuestion.scale;
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-brand-forest/60">
                            <span>{labels.min}</span>
                            <span>{labels.max}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            {scaleOptions(min, max).map((value) => (
                              <button
                                type="button"
                                key={value}
                                onClick={() => field.onChange(value)}
                                className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                                  field.value === value
                                    ? "border-brand-forest bg-brand-forest text-white"
                                    : "border-brand-forest/20 text-brand-forest/70 hover:border-brand-forest/50"
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (currentQuestion.type === "single" && currentQuestion.choices) {
                      return (
                        <div className="grid gap-3">
                          {currentQuestion.choices.map((choice) => {
                            const selected = field.value === choice.value;
                            return (
                              <button
                                type="button"
                                key={choice.value}
                                onClick={() => field.onChange(choice.value)}
                                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                                  selected
                                    ? "border-brand-forest bg-brand-forest text-white"
                                    : "border-brand-forest/20 bg-brand-forest/5 text-brand-forest hover:border-brand-forest/40"
                                }`}
                              >
                                <span className={`mt-1 h-3 w-3 rounded-full border ${selected ? "border-white bg-white" : "border-brand-forest"}`} />
                                <div>
                                  <p className="font-semibold">{choice.label}</p>
                                  <p className="text-xs uppercase tracking-[0.2em] opacity-70">Carga clínica: {choice.weight}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    }

                    if (currentQuestion.type === "multi" && currentQuestion.choices) {
                      const selectedValues = (field.value as string[]) || [];
                      const toggle = (value: string) => {
                        if (selectedValues.includes(value)) {
                          field.onChange(selectedValues.filter((item) => item !== value));
                        } else {
                          field.onChange([...selectedValues, value]);
                        }
                      };

                      return (
                        <div className="flex flex-wrap gap-3">
                          {currentQuestion.choices.map((choice) => (
                            <button
                              type="button"
                              key={choice.value}
                              onClick={() => toggle(choice.value)}
                              className="focus-visible:outline-none"
                            >
                              <MultiSelectBadge selected={selectedValues.includes(choice.value)} label={choice.label} />
                            </button>
                          ))}
                        </div>
                      );
                    }

                    if (currentQuestion.type === "boolean" && currentQuestion.choices) {
                      return (
                        <div className="flex gap-4">
                          {currentQuestion.choices.map((choice) => (
                            <button
                              type="button"
                              key={choice.value}
                              onClick={() => field.onChange(choice.value)}
                              className={`flex-1 rounded-2xl border p-4 text-center text-sm transition ${
                                field.value === choice.value
                                  ? "border-brand-forest bg-brand-forest text-white"
                                  : "border-brand-forest/20 bg-brand-forest/5 text-brand-forest hover:border-brand-forest/40"
                              }`}
                            >
                              {choice.label}
                            </button>
                          ))}
                        </div>
                      );
                    }

                    return null;
                  }}
                />

                <div className="flex items-center justify-between pt-6">
                  <Button type="button" variant="ghost" onClick={goPrev} disabled={step === 0} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  {step === totalSteps - 1 ? (
                    <Button type="submit" variant="copper" className="gap-2">
                      Generar plan personalizado
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="button" onClick={goNext} variant="primary" className="gap-2">
                      Siguiente
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        )}

        {result && (
          <AnimatePresence>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-10 grid gap-8 lg:grid-cols-[1.4fr,1fr]"
            >
              <div className="space-y-6">
                <div className="rounded-3xl bg-brand-forest p-6 text-brand-ivory">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-ivory/60">Arquetipo</p>
                  <h2 className="mt-2 font-display text-3xl">
                    {result.persona} · {result.tierSummary.tier}
                  </h2>
                  <p className="mt-3 text-brand-ivory/80">{result.personaNarrative}</p>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-brand-copper">Foco</p>
                  <p className="text-brand-ivory/90">{result.personaFocus}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Headline</p>
                    <h3 className="mt-2 font-display text-2xl text-brand-forest">{result.tierSummary.headline}</h3>
                    <p className="mt-3 text-brand-forest/70">{result.tierSummary.rationale}</p>
                  </div>

                  <div className="rounded-3xl border border-brand-forest/10 bg-brand-forest/5 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Próximos pasos</p>
                    <ul className="mt-4 space-y-3 text-brand-forest/80">
                      {result.tierSummary.nextSteps.map((stepItem) => (
                        <li key={stepItem} className="flex items-start gap-3">
                          <CheckCircle className="mt-1 h-4 w-4 text-brand-copper" />
                          <span>{stepItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-brand-forest/10 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Formulaciones sugeridas</p>
                  <ul className="mt-4 space-y-4 text-brand-forest">
                    {result.tierSummary.recommendedFormulas.map((formulaId) => (
                      <li key={formulaId} className="rounded-2xl bg-brand-forest/5 p-4">
                        <p className="font-semibold">
                          {result.tierSummary.tier === "Tier 3" && formulaId === "tier3-pro"
                            ? "Pro Bespoke"
                            : result.tierSummary.tier === "Tier 2" && formulaId.startsWith("tier2")
                              ? supplementFormulas.find((item) => item.id === formulaId)?.label ?? formulaId
                              : supplementFormulas.find((item) => item.id === formulaId)?.label ?? formulaId}
                        </p>
                        <p className="text-sm text-brand-forest/70">
                          {supplementFormulas.find((item) => item.id === formulaId)?.narrative}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-brand-forest/10 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Biomarcadores prioritarios</p>
                  <ul className="mt-3 space-y-2 text-sm text-brand-forest/80">
                    {result.biomarkerPriority.map((marker) => (
                      <li key={marker}>• {marker}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-brand-forest/10 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-forest/60">Investigación aplicada</p>
                  <ul className="mt-3 space-y-3 text-sm text-brand-forest/80">
                    {result.researchSnippets.map((snippet) => (
                      <li key={snippet.title}>
                        <p className="font-semibold text-brand-forest">{snippet.title}</p>
                        <p className="text-brand-forest/70">{snippet.summary}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="copper" className="w-full" onClick={restart}>
                  Reiniciar cuestionario
                </Button>
              </aside>
            </motion.section>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
