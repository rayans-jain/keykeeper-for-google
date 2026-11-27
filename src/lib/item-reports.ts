import { z } from "zod";

const componentSchema = z.object({
  name: z.string(),
  material: z.string(),
  recycling_steps: z.array(z.string()),
  youtube_search_query: z.string().default(""),
});

export const photoReportSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      location: z.string(),
      disposition: z.enum(["USEFUL", "RECYCLABLE", "RESIDUAL", "MEDICAL", "UNCLEAR"]),
      condition: z.string(),
      confidence: z.number().min(0).max(100),
      usefulness: z.string(),
      action: z.string(),
      warnings: z.array(z.string()),
      components: z.array(componentSchema),
    }),
  ),
});

export const MEDICAL_ACTION =
  "Keep separate from household waste and recycling. Contact a healthcare facility, pharmacy take-back service or authorized biomedical-waste collector for local disposal instructions.";
export const MEDICAL_WARNING =
  "Do not reuse, dismantle, burn or put medical waste in household recycling. Do not touch or recap exposed needles; keep children and pets away.";

export function normalizePhotoReport(raw: unknown) {
  const report = photoReportSchema.parse(raw);
  return report.items.map((item) =>
    item.disposition !== "MEDICAL"
      ? {
          ...item,
          components: item.components.map((component) => ({
            ...component,
            recycling_steps: component.recycling_steps.length ? component.recycling_steps : [
              "Keep this component in use while it is serviceable. At end of life, ask your local collection service whether this material is accepted; do not dismantle unsafe parts.",
            ],
          })),
        }
      : {
          ...item,
          usefulness: "Not suitable for household reuse; potentially infectious or hazardous.",
          action: MEDICAL_ACTION,
          warnings: [MEDICAL_WARNING, ...item.warnings],
          components: item.components.map((component) => ({
            ...component,
            recycling_steps: [
              "Do not separate components. Use an authorized medical-waste disposal service.",
            ],
            youtube_search_query: "",
          })),
        },
  );
}
