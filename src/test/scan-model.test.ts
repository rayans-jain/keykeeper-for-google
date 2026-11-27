import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: () => ({
      handler: (handler: unknown) => handler,
    }),
  }),
}));

import { analyzeWasteFn, identifyItemFn } from "@/lib/scan.functions";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Scanner Gemini model", () => {
  it.each([
    ["identification", identifyItemFn],
    ["material analysis", analyzeWasteFn],
  ] as const)("uses the available replacement for %s", async (_name, scan) => {
    vi.stubEnv("rayansh", "test-key");
    vi.stubEnv("GOOGLE_API_KEY", "");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "{}" }] } }] })),
    );
    vi.stubGlobal("fetch", fetchMock);

    await scan({ data: { imageBase64: "test-image-base64-content", step1Summary: "Plastic bottle" } });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    );
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(new Headers(request?.headers).get("x-goog-api-key")).toBe("test-key");
    const body = JSON.parse(String(request?.body)) as { generationConfig: Record<string, unknown> };
    expect(body.generationConfig["responseMimeType"]).toBe("application/json");
    expect(body.generationConfig).not.toHaveProperty("temperature");
  });
});