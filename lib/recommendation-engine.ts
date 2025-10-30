import { questionnaire } from "@/data/questions";
import { bioMarkers, researchLibrary, supplementFormulas } from "@/data/research";

export type AnswerValue = number | string | string[] | boolean | null;

export type QuizAnswer = {
  questionId: string;
  value: AnswerValue;
};

export type Tier = "Tier 1" | "Tier 2" | "Tier 3";

export type TierSummary = {
  tier: Tier;
  headline: string;
  rationale: string;
  nextSteps: string[];
  recommendedFormulas: string[];
  supportingEvidence: string[];
};

export type PersonaArchetype = "Navigator" | "Performer" | "Radiant" | "Strategist";

export type QuizRecommendation = {
  persona: PersonaArchetype;
  personaNarrative: string;
  personaFocus: string;
  tierSummary: TierSummary;
  biomarkerPriority: string[];
  researchSnippets: {
    title: string;
    summary: string;
    url: string;
  }[];
};

const personaMap: Record<PersonaArchetype, { narrative: string; focus: string }> = {
  Navigator: {
    narrative:
      "Eres disciplinado con tus hábitos y buscas una base sólida que te permita navegar cambios de estilo de vida con estabilidad.",
    focus: "Consolidar métricas fundamentales y crear adherencia sin fricción."
  },
  Performer: {
    narrative:
      "Tu agenda es exigente y necesitas potenciar energía, recuperación y claridad mental para rendir en cada frente.",
    focus: "Optimización de resiliencia al estrés, performance muscular y soporte mitocondrial."
  },
  Radiant: {
    narrative:
      "Buscas una piel y vitalidad que reflejen tu ritmo interior, abordando inflamación, colágeno y balance hormonal.",
    focus: "Sincronizar glow cutáneo, estabilidad glucémica y detox suave."
  },
  Strategist: {
    narrative:
      "Quieres que tus decisiones estén respaldadas por datos, paneles clínicos y un equipo médico que traduzca insights accionables.",
    focus: "Profundizar en biomarcadores, personalización iterativa y formulaciones magistrales."
  }
};

const researchById = Object.fromEntries(researchLibrary.map((item) => [item.id, item]));

const determinePersona = (scores: Record<string, number>): PersonaArchetype => {
  const target = Object.entries(scores).reduce((acc, [dimension, value]) => {
    if (value > acc.value) {
      return { dimension, value };
    }
    return acc;
  },
  { dimension: "sueño", value: -Infinity });

  switch (target.dimension) {
    case "deporte":
    case "energía":
      return "Performer";
    case "piel":
    case "hormonas":
      return "Radiant";
    case "hábitos":
      return "Strategist";
    default:
      return "Navigator";
  }
};

const computeDimensionScores = (answers: QuizAnswer[]): Record<string, number> => {
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questionnaire.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const base = question.dimension;
    const existing = scores[base] ?? 0;

    if (question.type === "scale" && typeof answer.value === "number") {
      const inverted = question.scale ? question.scale.max + 1 - answer.value : answer.value;
      scores[base] = existing + inverted;
    } else if (question.type === "single" && typeof answer.value === "string") {
      const choice = question.choices?.find((c) => c.value === answer.value);
      if (choice) {
        scores[base] = existing + choice.weight;
      }
    } else if (question.type === "multi" && Array.isArray(answer.value)) {
      const weight = answer.value.reduce((acc, val) => {
        const option = question.choices?.find((c) => c.value === val);
        return acc + (option?.weight ?? 0);
      }, 0);
      scores[base] = existing + weight;
    } else if (question.type === "boolean" && typeof answer.value === "boolean") {
      scores[base] = existing + (answer.value ? 1 : 3);
    } else if (question.type === "boolean" && typeof answer.value === "string") {
      const choice = question.choices?.find((c) => c.value === answer.value);
      scores[base] = existing + (choice?.weight ?? 0);
    }
  }

  return scores;
};

const determineTier = (scores: Record<string, number>): TierSummary => {
  const sleepLoad = scores["sueño"] ?? 0;
  const stressLoad = scores["estrés"] ?? 0;
  const sportLoad = scores["deporte"] ?? 0;
  const hormoneLoad = scores["hormonas"] ?? 0;
  const habitsLoad = scores["hábitos"] ?? 0;

  const tierScores: Record<Tier, number> = {
    "Tier 1": 6,
    "Tier 2": 0,
    "Tier 3": 0
  };

  tierScores["Tier 2"] += Math.max(sleepLoad + stressLoad - 6, 0);
  tierScores["Tier 2"] += sportLoad > 6 ? 2 : 0;
  tierScores["Tier 2"] += hormoneLoad > 4 ? 2 : 0;

  tierScores["Tier 3"] += habitsLoad > 5 ? 3 : 0;
  tierScores["Tier 3"] += hormoneLoad > 6 ? 3 : 0;
  tierScores["Tier 3"] += stressLoad > 6 ? 2 : 0;

  const selected = Object.entries(tierScores).reduce((acc, [tier, value]) => {
    if (value > acc.value) {
      return { tier: tier as Tier, value };
    }
    return acc;
  },
  { tier: "Tier 1" as Tier, value: -Infinity });

  if (selected.tier === "Tier 1") {
    return {
      tier: "Tier 1",
      headline: "Establece una base impecable con Core Balance",
      rationale:
        "Tus respuestas muestran que, aunque hay áreas a optimizar, la prioridad es consolidar micronutrientes esenciales, descansar mejor y crear adherencia.",
      nextSteps: [
        "Completa 4 semanas con Core Balance y seguimiento semanal",
        "Registra métricas de sueño y energía en el panel",
        "Agenda una micro-consulta con nuestra health coach para ajustar hábitos nocturnos"
      ],
      recommendedFormulas: ["tier1-core"],
      supportingEvidence: ["mag_taur", "omega_dha", "jun_formula"]
    };
  }

  if (selected.tier === "Tier 2") {
    const focusFormula = sleepLoad > sportLoad && sleepLoad >= hormoneLoad ? "tier2-sleep" : sportLoad >= hormoneLoad ? "tier2-performance" : "tier2-woman";
    return {
      tier: "Tier 2",
      headline: "Potencia y personaliza con nuestros Boost Stacks",
      rationale:
        "Identificamos necesidades específicas que requieren protocolos dirigidos, combinando Core Balance con un stack clínico de alto impacto.",
      nextSteps: [
        "Integra el stack recomendado por 6-8 semanas",
        "Sincroniza tus dispositivos (HRV, entrenamiento, sueño) al dashboard",
        "Recibe feedback de nuestro comité científico cada 14 días"
      ],
      recommendedFormulas: ["tier1-core", focusFormula],
      supportingEvidence: focusFormula === "tier2-woman" ? ["ino_res", "jun_formula"] : focusFormula === "tier2-performance" ? ["ashwagandha_k", "omega_dha"] : ["mag_taur", "omega_dha"]
    };
  }

  const biomarkerNeeds = ["crp", "vitd", "homa", "psqi"];
  return {
    tier: "Tier 3",
    headline: "Tu bioquímica, elevada: Pro Bespoke en 360°",
    rationale:
      "Tus respuestas señalan la necesidad de formulaciones magistrales, análisis de biomarcadores y acompañamiento médico asincrónico continuo.",
    nextSteps: [
      "Recibe el kit de sangre a domicilio y completa la toma guiada",
      "Agrega tus métricas históricas (labs, wearables) en el vault seguro",
      "Agenda la teleconsulta inicial con nuestro equipo médico funcional"
    ],
    recommendedFormulas: ["tier1-core", "tier2-sleep", "tier3-pro"],
    supportingEvidence: ["jun_formula", "omega_dha", "ino_res"]
  };
};

const deriveBiomarkers = (tierSummary: TierSummary): string[] => {
  const prioritised = new Set<string>();
  for (const formulaId of tierSummary.recommendedFormulas) {
    const formula = supplementFormulas.find((item) => item.id === formulaId);
    formula?.targetedBiomarkers.forEach((marker) => prioritised.add(marker));
  }

  return bioMarkers
    .filter((marker) => prioritised.has(marker.id))
    .map((marker) => `${marker.name} (objetivo ${marker.optimalRange})`);
};

const compileResearchSnippets = (references: string[]) => {
  return references
    .map((ref) => researchById[ref])
    .filter(Boolean)
    .map((item) => ({
      title: `${item.title} · ${item.journal} (${item.year})`,
      summary: item.summary,
      url: item.url
    }));
};

export const buildRecommendation = (answers: QuizAnswer[]): QuizRecommendation => {
  const scores = computeDimensionScores(answers);
  const persona = determinePersona(scores);
  const personaInfo = personaMap[persona];
  const tierSummary = determineTier(scores);

  return {
    persona,
    personaNarrative: personaInfo.narrative,
    personaFocus: personaInfo.focus,
    tierSummary,
    biomarkerPriority: deriveBiomarkers(tierSummary),
    researchSnippets: compileResearchSnippets(tierSummary.supportingEvidence)
  };
};
