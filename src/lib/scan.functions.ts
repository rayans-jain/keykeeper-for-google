import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Step1Result, Step2Result, YoutubeVideo } from "@/types/scan";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const STEP1_PROMPT =
  "You are a recycling assistant. Identify the main object, its likely materials and condition. Decide if it is VALUABLE (phones, chargers, keys, wallets, cards, jewelry, documents, working electronics, anything a person would regret throwing away), WASTE, or UNCLEAR. Return ONLY JSON: {item_name, category, materials:[string], condition, verdict:'VALUABLE'|'WASTE'|'UNCLEAR', confidence:0-100, reason}";

const STEP2_PROMPT =
  "You are an environmental scientist. Return ONLY JSON: {material_type, composition_notes, recyclability_score:0-100, reusability_score:0-100, eco_safety_score:0-100 (higher = safer), recyclability_level:'Easily recyclable'|'Conditionally recyclable'|'Not recyclable', bin_recommendation, prep_steps:[short strings], contamination_warnings:[string], environmental_impact (2 short sentences), diy_ideas:[{title, difficulty:'Easy'|'Medium'|'Hard', time_minutes, youtube_search_query}] (exactly 3), pro_tip}. Simple language.";

function parseJsonDefensively<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

async function callGeminiJson<T>(
  apiKey: string,
  prompt: string,
  base64Image: string,
): Promise<T> {
  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: base64Image } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 900));
    }
    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body,
    });

    if (res.status === 429 || res.status === 503) {
      lastError = new Error(`Service busy (${res.status}). Please try again in a moment.`);
      continue;
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(
        res.status === 401 || res.status === 403
          ? "The scanner key is not authorized for Gemini API."
          : `Scanner request failed (${res.status}). ${errText.slice(0, 120)}`,
      );
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      lastError = new Error("Empty response from vision model.");
      continue;
    }
    try {
      return parseJsonDefensively<T>(text);
    } catch {
      lastError = new Error("Could not read structured analysis from model.");
    }
  }

  throw lastError ?? new Error("Analysis failed. Please try again.");
}

export const identifyItemFn = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ imageBase64: z.string().min(20) }).parse(input))
  .handler(async ({ data }): Promise<Step1Result> => {
    const apiKey = process.env["GOOGLE_API_KEY"];
    if (!apiKey) {
      throw new Error("NOT_CONFIGURED");
    }
    const raw = await callGeminiJson<Partial<Step1Result>>(apiKey, STEP1_PROMPT, data.imageBase64);
    const verdict =
      raw.verdict === "VALUABLE" || raw.verdict === "WASTE" || raw.verdict === "UNCLEAR"
        ? raw.verdict
        : "UNCLEAR";
    return {
      item_name: String(raw.item_name ?? "Unknown item"),
      category: String(raw.category ?? "General"),
      materials: Array.isArray(raw.materials) ? raw.materials.map(String) : [],
      condition: String(raw.condition ?? "Not specified"),
      verdict,
      confidence: Math.max(0, Math.min(100, Math.round(Number(raw.confidence ?? 0)))),
      reason: String(raw.reason ?? ""),
    };
  });

export const analyzeWasteFn = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ imageBase64: z.string().min(20), step1Summary: z.string() }).parse(input),
  )
  .handler(async ({ data }): Promise<Step2Result> => {
    const apiKey = process.env["GOOGLE_API_KEY"];
    if (!apiKey) {
      throw new Error("NOT_CONFIGURED");
    }
    const prompt = `${STEP2_PROMPT}\n\nItem identification from Step 1: ${data.step1Summary}`;
    const raw = await callGeminiJson<Partial<Step2Result>>(apiKey, prompt, data.imageBase64);
    const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n ?? 0))));
    const level =
      raw.recyclability_level === "Easily recyclable" ||
      raw.recyclability_level === "Conditionally recyclable" ||
      raw.recyclability_level === "Not recyclable"
        ? raw.recyclability_level
        : "Conditionally recyclable";

    const ideas = Array.isArray(raw.diy_ideas)
      ? raw.diy_ideas.slice(0, 3).map((idea) => ({
          title: String(idea.title ?? "Creative reuse idea"),
          difficulty: (idea.difficulty === "Easy" ||
          idea.difficulty === "Medium" ||
          idea.difficulty === "Hard"
            ? idea.difficulty
            : "Easy") as "Easy" | "Medium" | "Hard",
          time_minutes: Math.max(5, Math.round(Number(idea.time_minutes ?? 15))),
          youtube_search_query: String(idea.youtube_search_query ?? idea.title ?? "DIY upcycle"),
        }))
      : [];

    return {
      material_type: String(raw.material_type ?? "Mixed material"),
      composition_notes: String(raw.composition_notes ?? ""),
      recyclability_score: clamp(raw.recyclability_score),
      reusability_score: clamp(raw.reusability_score),
      eco_safety_score: clamp(raw.eco_safety_score),
      recyclability_level: level,
      bin_recommendation: String(raw.bin_recommendation ?? "Check local municipal guidelines"),
      prep_steps: Array.isArray(raw.prep_steps) ? raw.prep_steps.map(String) : [],
      contamination_warnings: Array.isArray(raw.contamination_warnings)
        ? raw.contamination_warnings.map(String)
        : [],
      environmental_impact: String(raw.environmental_impact ?? ""),
      diy_ideas: ideas,
      pro_tip: String(raw.pro_tip ?? ""),
    };
  });

export const searchYoutubeDiyFn = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ query: z.string().min(1).max(160) }).parse(input))
  .handler(async ({ data }): Promise<YoutubeVideo | null> => {
    const apiKey = process.env["GOOGLE_API_KEY"];
    if (!apiKey) return null;
    try {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        maxResults: "1",
        videoEmbeddable: "true",
        safeSearch: "strict",
        q: `${data.query} DIY`,
        key: apiKey,
      });
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
      if (!res.ok) return null;
      const json = (await res.json()) as {
        items?: Array<{
          id?: { videoId?: string };
          snippet?: {
            title?: string;
            channelTitle?: string;
            thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
          };
        }>;
      };
      const item = json.items?.[0];
      const videoId = item?.id?.videoId;
      if (!videoId) return null;
      return {
        videoId,
        videoTitle: item.snippet?.title ?? data.query,
        channelTitle: item.snippet?.channelTitle ?? "YouTube",
        thumbnail:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    } catch {
      return null;
    }
  });