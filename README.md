# Serum Atelier Webapp

Webapp boutique de suplementación personalizada inspirada en la experiencia de marcas como Bioniq, diseñada para lanzar una marca con tres niveles (tiers) de productos y servicios: Core Balance, Boost Stacks y Pro Bespoke. Incluye un cuestionario clínico con investigación médica de respaldo y un motor de recomendación mock que simula procesos de personalización.

## Características clave

- **Frontend Next.js 14 (App Router)** con Tailwind, fuentes editoriales y animaciones Framer Motion.
- **Cuestionario clínico interactivo** basado en escalas validadas (PSQI, PSS, HOMA-IR proxy) con cálculo de arquetipo y tier recomendado.
- **Motor de recomendación mock** (`lib/recommendation-engine.ts`) que asigna una tier, formula stacks y biomarcadores prioritarios según respuestas.
- **Investigación curada** (`data/research.ts`) que resume literatura científica real (magnesio taurinato, ashwagandha KSM-66, inositol + resveratrol, péptidos de colágeno, omega-3 DHA, protocolo Jung) para dotar de coherencia médica al MVP.
- **Landing page boutique** con narrativa de marca, showcase de tiers, metodología, biomarcadores y CTA hacia el cuestionario.

## Stack técnico

- `Next.js 14.2`
- `TypeScript`
- `Tailwind CSS`
- `Framer Motion`
- `react-hook-form`
- `Zod` para tipado de cuestionario
- `Next Themes` para soporte de tematización futura

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

La app quedará disponible en `http://localhost:3000`.

## Estructura relevante

- `app/page.tsx`: landing principal con narrativa de marca y tiers.
- `app/quiz/page.tsx`: cuestionario interactivo + resultados.
- `data/questions.ts`: preguntas y pesos clínicos.
- `data/research.ts`: investigación base, biomarcadores y fórmulas mock.
- `lib/recommendation-engine.ts`: motor que genera la recomendación con arquetipo, tier y evidencia.

## Próximas extensiones sugeridas

- Conectar el motor a una base de datos real para persistir respuestas y progresos.
- Integrar autenticación (Auth0) y dashboards longitudinales.
- Automatizar envíos de laboratorios y seguimiento médico asincrónico.
- Expandir biblioteca de investigaciones y crear un CMS para mantenerla actualizada.
