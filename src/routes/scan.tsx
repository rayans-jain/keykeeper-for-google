import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, WifiOff } from "lucide-react";
import { useState } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { PipelineStepper } from "@/components/PipelineStepper";
import { ResultCards } from "@/components/ResultCards";
import { UploadZone } from "@/components/UploadZone";
import {
  checkAndRecordRateLimit,
  getCachedVideo,
  saveScanToHistory,
  setCachedVideo,
} from "@/hooks/useLocalStorage";
import { processDataUrl, processImageFile, type ProcessedImage } from "@/lib/image";
import { inspectPhotoFn, searchYoutubeDiyFn } from "@/lib/scan.functions";
import type { PipelineStage, ScanRecord } from "@/types/scan";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan an Item — Eco Waste Wise" },
      {
        name: "description",
        content:
          "Identify every product in a photo, check usefulness, review component recycling guidance, and separate medical waste safely.",
      },
      { property: "og:title", content: "Scan an Item — Eco Waste Wise" },
      {
        property: "og:description",
        content: "Separate product reports, component recycling guidance and medical-waste safety from one photo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<ScanRecord | null>(null);

  const isLoading = stage !== "idle" && stage !== "done";

  const runPipeline = async (loader: () => Promise<ProcessedImage>) => {
    setError(null);
    setRecord(null);
    setMode("upload");

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError("You appear to be offline. Reconnect to the internet and try again.");
      return;
    }

    const rate = checkAndRecordRateLimit();
    if (!rate.allowed) {
      setError(
        `You have reached the hourly limit of 10 scans. Please try again in about ${rate.minutesUntilReset} minute${rate.minutesUntilReset === 1 ? "" : "s"}.`,
      );
      return;
    }

    try {
      setStage("preparing");
      const processed = await loader();
      setPreviewUrl(processed.dataUrl);

      setStage("identifying");
      setStage("analyzing");
      const items = await inspectPhotoFn({ data: { imageBase64: processed.base64 } });
      if (items.length === 0)
        throw new Error("No clear products found. Try a closer photo with better lighting.");

      setStage("videos");
      const reportedItems = [];
      for (const item of items) {
        const components = [];
        for (const component of item.components) {
          const query = component.youtube_search_query;
          const video =
            item.disposition !== "MEDICAL" && query
              ? (getCachedVideo(query) ??
                (await searchYoutubeDiyFn({ data: { query: query.slice(0, 160) } }).catch(
                  () => null,
                )))
              : null;
          if (video) setCachedVideo(query, video);
          components.push(video ? { ...component, video } : component);
        }
        reportedItems.push({ ...item, components });
      }
      const first = items[0];
      if (!first) throw new Error("No products found.");

      const finished: ScanRecord = {
        id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        thumbnail: processed.thumbnail,
        step1: {
          item_name: items.map((item) => item.name).join(", "),
          category: items.length > 1 ? "Multiple products" : first.disposition,
          materials: [
            ...new Set(items.flatMap((item) => item.components.map((part) => part.material))),
          ],
          condition: first.condition,
          verdict: items.every((item) => item.disposition === "USEFUL") ? "VALUABLE" : "WASTE",
          confidence: Math.round(
            items.reduce((sum, item) => sum + item.confidence, 0) / items.length,
          ),
          reason: first.usefulness,
        },
        items: reportedItems,
      };
      saveScanToHistory(finished);
      setRecord(finished);
      setStage("done");
    } catch (err) {
      setStage("idle");
      const msg = err instanceof Error ? err.message : "Something went wrong during analysis.";
      if (msg.includes("NOT_CONFIGURED")) {
        setError("The scanner is not configured yet.");
      } else {
        setError(msg);
      }
    }
  };

  const handleReset = () => {
    setRecord(null);
    setPreviewUrl(undefined);
    setError(null);
    setStage("idle");
    setMode("upload");
  };

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="ewa-card ewa-animate-in flex items-start gap-3 border-accent/40 p-4 text-sm text-accent"
        >
          {error.toLowerCase().includes("offline") ? (
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <PipelineStepper stage={stage} />
      ) : record ? (
        <ResultCards record={record} previewUrl={previewUrl} onScanAnother={handleReset} />
      ) : mode === "camera" ? (
        <CameraCapture
          onUsePhoto={(dataUrl) => void runPipeline(() => processDataUrl(dataUrl))}
          onClose={() => setMode("upload")}
          onSwitchToUpload={() => setMode("upload")}
        />
      ) : (
        <UploadZone
          disabled={isLoading}
          onFileSelected={(file) => void runPipeline(() => processImageFile(file))}
          onOpenCamera={() => {
            setError(null);
            setMode("camera");
          }}
          onError={(msg) => setError(msg)}
        />
      )}
    </div>
  );
}
