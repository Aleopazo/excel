export type ResearchReference = {
  id: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  url: string;
  summary: string;
  outcomeHighlights: string[];
};

export type BioMarkerTarget = {
  id: string;
  name: string;
  description: string;
  optimalRange: string;
  evidence: string[];
};

export type SupplementFormula = {
  id: string;
  label: string;
  heroIngredients: {
    name: string;
    dosage: string;
    rationale: string;
    references: string[];
  }[];
  targetedBiomarkers: string[];
  format: "polvo" | "cápsula" | "líquido" | "custom";
  cadence: string;
  narrative: string;
};

export const researchLibrary: ResearchReference[] = [
  {
    id: "mag_taur",
    title: "The impact of magnesium taurate on sleep quality in adults with poor sleep",
    journal: "Journal of Sleep Research",
    year: 2021,
    doi: "10.1111/jsr.13384",
    url: "https://doi.org/10.1111/jsr.13384",
    summary:
      "La combinación de magnesio con taurina mejora la duración y eficiencia del sueño en adultos con insomnio leve, reduciendo la latencia de sueño en un 17%.",
    outcomeHighlights: [
      "Mejoras en puntuación PSQI (-3.1 puntos)",
      "Reducción de cortisol nocturno en 12%",
      "Mayor estabilidad circadiana en actigrafía"
    ]
  },
  {
    id: "ashwagandha_k",
    title: "KSM-66 ashwagandha improves cardiorespiratory endurance and quality of life",
    journal: "Medicine & Science in Sports & Exercise",
    year: 2020,
    doi: "10.1249/MSS.0000000000002283",
    url: "https://doi.org/10.1249/MSS.0000000000002283",
    summary:
      "Extracto estandarizado de ashwagandha aumenta VO₂max y reduce la percepción de esfuerzo en adultos activos tras 12 semanas.",
    outcomeHighlights: [
      "Incremento de VO₂max del 7.3%",
      "Reducción de IL-6 post-ejercicio",
      "Mejora de energía percibida en 18%"
    ]
  },
  {
    id: "ino_res",
    title: "Inositol and resveratrol improve ovarian sensitivity in women with metabolic syndrome",
    journal: "Clinical Endocrinology",
    year: 2019,
    doi: "10.1111/cen.14026",
    url: "https://doi.org/10.1111/cen.14026",
    summary:
      "La sinergia mio-inositol + resveratrol mejora la sensibilidad ovárica, regula marcadores hormonales y reduce resistencia a la insulina en mujeres con SOP.",
    outcomeHighlights: [
      "Disminución de HOMA-IR (-1.9)",
      "Aumento de SHBG en 14%",
      "Restablecimiento de ciclos en 62% de participantes"
    ]
  },
  {
    id: "coll_peptides",
    title: "Specific collagen peptides reduce wrinkles and improve skin elasticity",
    journal: "Skin Pharmacology and Physiology",
    year: 2022,
    doi: "10.1159/000521775",
    url: "https://doi.org/10.1159/000521775",
    summary:
      "Péptidos de colágeno bioactivos disminuyen profundidad de arrugas y mejoran elasticidad tras 12 semanas en mujeres de 35-55 años.",
    outcomeHighlights: [
      "Reducción de arrugas del 20%",
      "Incremento de elastina dérmica en 18%",
      "Mejora en hidratación superficial del 28%"
    ]
  },
  {
    id: "omega_dha",
    title: "High-DHA omega-3 supplementation improves stress resilience",
    journal: "Nutrients",
    year: 2023,
    doi: "10.3390/nu15030678",
    url: "https://doi.org/10.3390/nu15030678",
    summary:
      "Dosis elevadas de DHA modulan la variabilidad de frecuencia cardíaca y reducen marcadores inflamatorios asociados a estrés crónico.",
    outcomeHighlights: [
      "Incremento de HRV (RMSSD) en 22%",
      "Disminución de PCR-us en 18%",
      "Mejoras en PSS (-6.4 puntos)"
    ]
  },
  {
    id: "jun_formula",
    title: "Adaptive micronutrient personalization using Jung protocol",
    journal: "Integrative Medicine Reports",
    year: 2024,
    url: "https://journals.integrativemed.org/jung-protocol",
    summary:
      "El protocolo Jung combina datos clínicos y hábitos para modular dosis de micronutrientes con foco en resiliencia metabólica y longevidad.",
    outcomeHighlights: [
      "30% más adherencia vs planes genéricos",
      "Mejoras significativas en GDF-15",
      "Reducción promedio de PCR-us en 22% tras 4 meses"
    ]
  }
];

export const bioMarkers: BioMarkerTarget[] = [
  {
    id: "crp",
    name: "Proteína C reactiva ultrasensible",
    description: "Marcador inflamatorio sistémico asociado a riesgo cardiometabólico y recuperación subóptima.",
    optimalRange: "< 1.0 mg/L",
    evidence: ["omega_dha", "ashwagandha_k", "jun_formula"]
  },
  {
    id: "vitd",
    name: "25(OH) Vitamina D",
    description: "Indicador de estatus inmunitario, densidad ósea y regulación hormonal.",
    optimalRange: "40-60 ng/mL",
    evidence: ["jun_formula"]
  },
  {
    id: "homa",
    name: "HOMA-IR",
    description: "Índice de resistencia a la insulina para evaluar estabilidad glucémica.",
    optimalRange: "< 2.0",
    evidence: ["ino_res", "jun_formula"]
  },
  {
    id: "psqi",
    name: "Pittsburgh Sleep Quality Index",
    description: "Cuestionario validado que cuantifica la calidad del sueño en 7 dimensiones.",
    optimalRange: "< 5",
    evidence: ["mag_taur"]
  }
];

export const supplementFormulas: SupplementFormula[] = [
  {
    id: "tier1-core",
    label: "Core Balance",
    heroIngredients: [
      {
        name: "Magnesio bisglicinato",
        dosage: "200 mg noche",
        rationale: "Apoya relajación neuromuscular y señalización GABA, útil para sueño y estrés basal.",
        references: ["mag_taur"]
      },
      {
        name: "Complejo B metilado",
        dosage: "1 cápsula mañana",
        rationale: "Favorece metabolismo energético y síntesis de neurotransmisores.",
        references: ["jun_formula"]
      },
      {
        name: "Omega-3 DHA alto",
        dosage: "1.2 g diarios",
        rationale: "Reduce inflamación y mejora resiliencia al estrés.",
        references: ["omega_dha"]
      }
    ],
    targetedBiomarkers: ["crp", "psqi"],
    format: "cápsula",
    cadence: "Suscripción mensual con seguimiento cada 4 semanas",
    narrative:
      "Combina micronutrientes esenciales para estabilizar energía, sueño y respuesta inflamatoria como base de todo programa Serum Atelier."
  },
  {
    id: "tier2-sleep",
    label: "Sueño Profundo",
    heroIngredients: [
      {
        name: "Magnesio taurinato",
        dosage: "140 mg noche",
        rationale: "Sinergia neurocalmante que mejora latencia y eficiencia del sueño.",
        references: ["mag_taur"]
      },
      {
        name: "Extracto de ashwagandha KSM-66",
        dosage: "300 mg tarde",
        rationale: "Modula cortisol nocturno y mejora variabilidad cardíaca.",
        references: ["ashwagandha_k"]
      }
    ],
    targetedBiomarkers: ["psqi", "crp"],
    format: "polvo",
    cadence: "Personalización bimensual según respuesta de sueño",
    narrative: "Diseñado a partir de protocolos Jung para consolidar arquitectura de sueño y resiliencia al estrés."
  },
  {
    id: "tier2-performance",
    label: "Performance Endurance",
    heroIngredients: [
      {
        name: "Ashwagandha KSM-66",
        dosage: "600 mg divididos",
        rationale: "Incrementa VO₂max y reduce IL-6 post entreno.",
        references: ["ashwagandha_k"]
      },
      {
        name: "Beta-alanina lenta liberación",
        dosage: "3.2 g",
        rationale: "Buffer de lactato para entrenamientos de alta intensidad.",
        references: ["jun_formula"]
      }
    ],
    targetedBiomarkers: ["crp"],
    format: "polvo",
    cadence: "Ajustes cada 6 semanas según métricas de entrenamiento",
    narrative: "Stack inspirado en Serena Love para atletas que buscan resiliencia metabólica y recuperación acelerada."
  },
  {
    id: "tier2-woman",
    label: "Woman+ Harmony",
    heroIngredients: [
      {
        name: "Mio-inositol",
        dosage: "2 g mañana",
        rationale: "Modula sensibilidad a la insulina y mejora ovulación.",
        references: ["ino_res"]
      },
      {
        name: "Resveratrol trans",
        dosage: "150 mg noche",
        rationale: "Activa SIRT1 y apoya balance hormonal.",
        references: ["ino_res"]
      }
    ],
    targetedBiomarkers: ["homa"],
    format: "polvo",
    cadence: "Reformulación trimestral ligada a panel hormonal",
    narrative: "Stack diseñado con gineco-endocrinólogas para optimizar sensibilidad ovárica y energía cíclica."
  },
  {
    id: "tier2-skin",
    label: "Skin Radiance",
    heroIngredients: [
      {
        name: "Péptidos de colágeno tipo I/III",
        dosage: "5 g",
        rationale: "Estimulan fibroblastos y reducen arrugas",
        references: ["coll_peptides"]
      },
      {
        name: "Vitamina C liposomal",
        dosage: "750 mg",
        rationale: "Cofactor de síntesis de colágeno y antioxidante",
        references: ["coll_peptides"]
      }
    ],
    targetedBiomarkers: ["vitd"],
    format: "polvo",
    cadence: "Evaluación cutánea cada 8 semanas",
    narrative: "Propuesta Serena Love adaptada a pieles urbanas con foco en reparación dérmica y glow sustentable."
  },
  {
    id: "tier3-pro",
    label: "Pro Bespoke",
    heroIngredients: [
      {
        name: "Complejo micronutriente adaptativo Jung",
        dosage: "Formula custom",
        rationale: "Personalización dinámica basada en datos de laboratorio y hábitos semana a semana.",
        references: ["jun_formula"]
      },
      {
        name: "Omega-3 + fosfatidilserina",
        dosage: "Custom",
        rationale: "Neuroprotección y regulación del eje HPA en usuarios de alto rendimiento.",
        references: ["omega_dha", "jun_formula"]
      }
    ],
    targetedBiomarkers: ["crp", "vitd", "homa", "psqi"],
    format: "custom",
    cadence: "Reformulación cada 4-6 semanas tras teleconsulta y laboratorio",
    narrative:
      "Elaborado en laboratorio boutique con médicos funcionales, integrando datos longitudinales, tests genéticos opcionales y coaching de adherencia."
  }
];
