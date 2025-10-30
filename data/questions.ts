import { z } from "zod";

export const questionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dimension: z.enum(["sueño", "energía", "metabolismo", "piel", "hormonas", "estrés", "deporte", "hábitos"]),
  type: z.enum(["scale", "single", "multi", "boolean"]),
  choices: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        weight: z.number(),
        tag: z.string().optional()
      })
    )
    .optional(),
  scale: z
    .object({
      min: z.number(),
      max: z.number(),
      step: z.number().default(1),
      labels: z.object({
        min: z.string(),
        max: z.string()
      })
    })
    .optional(),
  rationale: z.string().optional()
});

export type Question = z.infer<typeof questionSchema>;

export const questionnaire: Question[] = [
  {
    id: "sleep_quality",
    title: "¿Cómo describirías la calidad de tu sueño promedio en la última semana?",
    dimension: "sueño",
    type: "scale",
    scale: {
      min: 1,
      max: 5,
      step: 1,
      labels: {
        min: "Muy deficiente",
        max: "Excelente"
      }
    },
    rationale:
      "Basado en el índice PSQI, puntuaciones bajas se correlacionan con necesidad de soporte en Tier 2 Sueño o Tier 3 personalizado."
  },
  {
    id: "sleep_latency",
    title: "¿Cuántos minutos tardas en conciliar el sueño?",
    dimension: "sueño",
    type: "single",
    choices: [
      { value: "menos_15", label: "Menos de 15 minutos", weight: 1 },
      { value: "15_30", label: "15 a 30 minutos", weight: 2 },
      { value: "30_60", label: "30 a 60 minutos", weight: 3 },
      { value: "mas_60", label: "Más de 60 minutos", weight: 4 }
    ],
    rationale:
      "Latencia prolongada indica disrupción GABA o hiperactivación simpática; lo abordamos con magnesio taurinato y protocolos de higiene de sueño."
  },
  {
    id: "energy_crashes",
    title: "¿Experimentas caídas pronunciadas de energía durante el día?",
    dimension: "energía",
    type: "single",
    choices: [
      { value: "no", label: "No, me mantengo estable", weight: 1 },
      { value: "ligero", label: "Ocasionalmente después de comer", weight: 2 },
      { value: "moderado", label: "Diariamente hacia la tarde", weight: 3 },
      { value: "intenso", label: "Varias veces al día", weight: 4 }
    ],
    rationale:
      "Las hipoglucemias reactivas y oscilaciones de energía se relacionan con resistencia a la insulina; Tier 2 Woman+ y Tier 3 incluyen moduladores glucémicos."
  },
  {
    id: "sport_training",
    title: "¿Cuál es tu volumen de entrenamiento actual?",
    dimension: "deporte",
    type: "single",
    choices: [
      { value: "sedentario", label: "<1 sesión/semana", weight: 1 },
      { value: "moderado", label: "2-3 sesiones/semana", weight: 2 },
      { value: "alto", label: "4-5 sesiones/semana", weight: 3 },
      { value: "élite", label: ">5 sesiones de alta intensidad", weight: 4 }
    ],
    rationale:
      "Determina necesidad de protocolos Performance basados en ashwagandha, beta-alanina y soporte adaptógeno."
  },
  {
    id: "skin_concerns",
    title: "Selecciona tus principales objetivos relacionados con la piel",
    dimension: "piel",
    type: "multi",
    choices: [
      { value: "elasticidad", label: "Elasticidad y firmeza", weight: 3, tag: "skin" },
      { value: "luminosidad", label: "Luminosidad", weight: 2, tag: "skin" },
      { value: "acne", label: "Acné o brotes", weight: 4, tag: "detox" },
      { value: "manchas", label: "Hipergmentación", weight: 3, tag: "skin" }
    ],
    rationale:
      "Nos guía hacia colágeno específico, antioxidantes y protocolos de detox hepática según necesidad."
  },
  {
    id: "women_cycle",
    title: "Si menstruas, ¿cómo describirías tu ciclo?",
    dimension: "hormonas",
    type: "single",
    choices: [
      { value: "regular", label: "Regular (26-32 días)", weight: 1 },
      { value: "irregular", label: "Irregular o impredecible", weight: 3 },
      { value: "doloroso", label: "Dolor moderado a severo", weight: 4 },
      { value: "no_aplica", label: "No aplica", weight: 0 }
    ],
    rationale:
      "Informamos formulaciones Woman+ Harmony y sugerimos paneles hormonales específicos."
  },
  {
    id: "stress_resilience",
    title: "¿Cómo calificarías tu capacidad para manejar el estrés sostenido?",
    dimension: "estrés",
    type: "scale",
    scale: {
      min: 1,
      max: 5,
      step: 1,
      labels: {
        min: "Me abruma con frecuencia",
        max: "Me adapto con facilidad"
      }
    },
    rationale:
      "Correlaciona con necesidad de adaptógenos, omega-3 ricos en DHA y soporte del eje HPA."
  },
  {
    id: "lab_access",
    title: "¿Tienes resultados recientes de laboratorio (últimos 6 meses)?",
    dimension: "hábitos",
    type: "boolean",
    choices: [
      { value: "si", label: "Sí", weight: 1 },
      { value: "no", label: "No", weight: 3 }
    ],
    rationale:
      "Define onboarding de Tier 3 Pro con kits de sangre y consultoría médica asincrónica."
  },
  {
    id: "supplement_history",
    title: "¿Qué tan constante eres con suplementos actuales?",
    dimension: "hábitos",
    type: "scale",
    scale: {
      min: 1,
      max: 5,
      step: 1,
      labels: {
        min: "Irregular (<40% adherencia)",
        max: "Muy constante (>90% adherencia)"
      }
    },
    rationale:
      "Nos ayuda a proponer coaching y recordatorios o migración a formatos más simples en Tier 1."
  }
];
