import { Check, Loader2 } from "lucide-react";
import type { PipelineStage } from "@/types/scan";

const STEPS: Array<{ id: PipelineStage; label: string }> = [
  { id: "preparing", label: "Preparing" },
  { id: "identifying", label: "Identifying" },
  { id: "analyzing", label: "Analyzing" },
  { id: "videos", label: "Finding videos" },
];

const ORDER: Record<PipelineStage, number> = {
  idle: -1,
  preparing: 0,
  identifying: 1,
  analyzing: 2,
  videos: 3,
  done: 4,
};

export function PipelineStepper({ stage }: { stage: PipelineStage }) {
  const currentIdx = ORDER[stage];

  return (
    <div className="space-y-6 ewa-animate-in" aria-live="polite">
      <div className="ewa-card p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STEPS.map((step, idx) => {
            const completed = currentIdx > idx;
            const active = currentIdx === idx;
            return (
              <div key={step.id} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                    completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {completed ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`text-sm font-medium ${
                    completed || active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="ewa-card p-6">
            <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-secondary" />
            <div className="mt-4 h-2.5 w-full animate-pulse rounded-full bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}