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
import { analyzeWasteFn, identifyItemFn, searchYoutubeDiyFn } from "@/lib/scan.functions";
import type { DiyIdeaWithVideo, PipelineStage, ScanRecord } from "@/types/scan";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan an Item — Eco Waste Wise" },
      {
        name: "description",
        content:
          "Upload a photo or use your camera to identify valuables vs waste, view recyclability scores, and watch DIY reuse videos.",
      },
      { property: "og:title", content: "Scan an Item — Eco Waste Wise" },
      {
        property: "og:description",
        content: "Instant material analysis and DIY reuse videos from one photo.",
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
      const step1 = await identifyItemFn({ data: { imageBase64: processed.base64 } });

      if (step1.verdict !== "WASTE") {
        const finished: ScanRecord = {
          id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
          thumbnail: processed.thumbnail,
          step1,
        };
        saveScanToHistory(finished);
        setRecord(finished);
        setStage("done");
        return;
      }

      setStage("analyzing");
      const step2 = await analyzeWasteFn({
        data: { imageBase64: processed.base64, step1Summary: JSON.stringify(step1) },
      });

      setStage("videos");
      const ideasWithVideos: DiyIdeaWithVideo[] = await Promise.all(
        step2.diy_ideas.map(async (idea) => {
          const cached = getCachedVideo(idea.youtube_search_query);
          if (cached) return { ...idea, video: cached };
          const found = await searchYoutubeDiyFn({
            data: { query: idea.youtube_search_query },
          }).catch(() => null);
          if (found) {
            setCachedVideo(idea.youtube_search_query, found);
            return { ...idea, video: found };
          }
          return idea;
        }),
      );

      const finished: ScanRecord = {
        id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        thumbnail: processed.thumbnail,
        step1,
        step2: { ...step2, diy_ideas: ideasWithVideos },
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