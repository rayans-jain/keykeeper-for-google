import { describe, expect, it } from "vitest";
import { MEDICAL_ACTION, MEDICAL_WARNING, normalizePhotoReport } from "@/lib/item-reports";

const item = {
  name: "Bottle",
  location: "Left",
  disposition: "USEFUL",
  condition: "Intact",
  confidence: 90,
  usefulness: "Reusable",
  action: "Keep",
  warnings: [],
  components: [
    {
      name: "Body",
      material: "Steel",
      recycling_steps: ["Metal collection"],
      youtube_search_query: "steel recycling",
    },
  ],
};

describe("Separate item reports", () => {
  it("preserves separate useful and non-useful products with their components", () => {
    const reports = normalizePhotoReport({
      items: [
        item,
        {
          ...item,
          name: "Wrapper",
          disposition: "RESIDUAL",
          usefulness: "Not reusable",
          components: [{ ...item.components[0], name: "Film", material: "Mixed plastic" }],
        },
      ],
    });
    expect(reports).toHaveLength(2);
    expect(reports[0]?.disposition).toBe("USEFUL");
    expect(reports[1]?.disposition).toBe("RESIDUAL");
    expect(reports[1]?.components[0]?.material).toBe("Mixed plastic");
  });
  it("isolates medical waste and prevents recycling or DIY instructions", () => {
    const reports = normalizePhotoReport({ items: [{ ...item, disposition: "MEDICAL" }] });
    expect(reports[0]?.action).toBe(MEDICAL_ACTION);
    expect(reports[0]?.warnings).toContain(MEDICAL_WARNING);
    expect(reports[0]?.components[0]?.youtube_search_query).toBe("");
    expect(reports[0]?.components[0]?.recycling_steps).toEqual([
      "Do not separate components. Use an authorized medical-waste disposal service.",
    ]);
  });
});
