export type QuestionOption = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  label: string;
  helper?: string;
  type: "text" | "textarea" | "select" | "radio";
  options?: QuestionOption[];
  placeholder?: string;
};

export const questionnaire: Question[] = [
  {
    id: "motivo_consulta",
    label: "Motivo principal de la consulta",
    helper: "Describe el síntoma o preocupación principal",
    type: "textarea",
    placeholder: "Ej. Dolor de cabeza intermitente desde hace 3 días",
  },
  {
    id: "inicio_sintomas",
    label: "¿Cuándo comenzaron los síntomas?",
    type: "text",
    placeholder: "Fecha aproximada",
  },
  {
    id: "evolucion",
    label: "Describe la evolución de los síntomas",
    type: "textarea",
    placeholder: "¿Han empeorado, mejorado o se mantienen igual?",
  },
  {
    id: "intensidad",
    label: "Intensidad del síntoma principal",
    type: "select",
    options: [
      { value: "leve", label: "Leve" },
      { value: "moderado", label: "Moderado" },
      { value: "severo", label: "Severo" },
    ],
  },
  {
    id: "factores_desencadenantes",
    label: "Factores que empeoran o alivian",
    type: "textarea",
  },
  {
    id: "antecedentes_personales",
    label: "Antecedentes personales relevantes",
    helper: "Enfermedades diagnosticadas previamente",
    type: "textarea",
  },
  {
    id: "antecedentes_familiares",
    label: "Antecedentes familiares relevantes",
    type: "textarea",
  },
  {
    id: "medicacion_actual",
    label: "Medicación actual",
    type: "textarea",
    helper: "Incluye dosis y frecuencia si es posible",
  },
  {
    id: "alergias",
    label: "Alergias medicamentosas o alimentarias",
    type: "textarea",
  },
  {
    id: "cirugias_previas",
    label: "Cirugías previas",
    type: "textarea",
  },
  {
    id: "habitos",
    label: "Hábitos relevantes (tabaco, alcohol, actividad física)",
    type: "textarea",
  },
  {
    id: "signos_asociados",
    label: "Síntomas acompañantes",
    type: "textarea",
    helper: "Fiebre, náuseas, pérdida de peso, etc.",
  },
  {
    id: "embarazo",
    label: "¿Embarazo o lactancia?",
    type: "radio",
    options: [
      { value: "no", label: "No aplica" },
      { value: "embarazo", label: "Embarazo" },
      { value: "lactancia", label: "Lactancia" },
    ],
  },
  {
    id: "diagnosticos_previos",
    label: "Diagnósticos previos relacionados",
    type: "textarea",
  },
  {
    id: "estudios_previos",
    label: "Estudios o exámenes recientes",
    type: "textarea",
  },
  {
    id: "objetivo_consulta",
    label: "¿Qué esperas obtener de esta atención?",
    type: "textarea",
  },
  {
    id: "riesgo_inmediato",
    label: "¿Presentas signos de alarma?",
    helper: "Dificultad respiratoria, dolor torácico intenso, pérdida de conciencia, etc.",
    type: "radio",
    options: [
      { value: "no", label: "No" },
      { value: "si", label: "Sí" },
    ],
  },
  {
    id: "tratamientos_recientes",
    label: "Tratamientos recientes para este problema",
    type: "textarea",
  },
  {
    id: "restricciones",
    label: "Restricciones o preferencias terapéuticas",
    type: "textarea",
  },
  {
    id: "documentos_adjuntos",
    label: "URL o referencia a estudios adjuntos (opcional)",
    type: "text",
    placeholder: "https://...",
  },
];
