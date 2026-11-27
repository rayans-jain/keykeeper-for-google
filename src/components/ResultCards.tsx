import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Printer,
  RotateCcw,
  Share2,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DiyVideoCard } from "@/components/DiyVideoCard";
import { ScoreMeter } from "@/components/ScoreMeter";
import type { ScanRecord } from "@/types/scan";

interface ResultCardsProps {
  record: ScanRecord;
  previewUrl?: string | undefined;
  onScanAnother: () => void;
}

export function ResultCards({ record, previewUrl, onScanAnother }: ResultCardsProps) {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const { step1, step2 } = record;
  const imageSrc = previewUrl || record.thumbnail;

  const handleShare = async () => {
    const summary =
      step1.verdict === "WASTE" && step2
        ? `Eco Waste Wise: ${step1.item_name} — ${step2.bin_recommendation} (Recyclability ${step2.recyclability_score}/100)`
        : `Eco Waste Wise: ${step1.item_name} (${step1.verdict})`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Eco Waste Wise Scan", text: summary });
        return;
      }
      await navigator.clipboard.writeText(summary);
      setShareNote("Summary copied to clipboard.");
      setTimeout(() => setShareNote(null), 2500);
    } catch {
      setShareNote("Could not share automatically.");
      setTimeout(() => setShareNote(null), 2500);
    }
  };

  if (step1.verdict === "VALUABLE") {
    return (
      <div className="ewa-animate-in space-y-6">
        <section className="ewa-card border-accent/40 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {imageSrc && (
              <img
                src={imageSrc}
                alt={step1.item_name}
                className="h-32 w-32 shrink-0 rounded-2xl border border-border object-cover"
              />
            )}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                VALUABLE · DO NOT THROW
              </span>
              <h2 className="mt-3 text-2xl font-bold text-accent sm:text-3xl">
                Wait! This is NOT garbage. Keep it safe.
              </h2>
              <p className="mt-2 text-base font-medium text-foreground">
                Identified as: {step1.item_name} ({step1.confidence}% confidence)
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{step1.reason}</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onScanAnother}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Scan another item
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (step1.verdict === "UNCLEAR") {
    return (
      <div className="ewa-animate-in">
        <section className="ewa-card p-6 sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
            UNCLEAR IMAGE
          </span>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            We could not identify a clear object
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {step1.reason || "Try taking another photo with better framing."}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Use bright, even lighting with minimal glare
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Move closer so the item fills most of the frame
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              Place one object at a time against a plain surface
            </li>
          </ul>
          <div className="mt-6">
            <button
              type="button"
              onClick={onScanAnother}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Retake photo
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ewa-animate-in space-y-6">
      {/* Verdict card */}
      <section className="ewa-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={step1.item_name}
              className="h-32 w-32 shrink-0 rounded-2xl border border-border object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                WASTE
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {step1.confidence}% confidence · {step1.condition}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              {step1.item_name}
            </h2>
            {step2 && (
              <p className="mt-1 text-sm text-muted-foreground">
                {step2.material_type} — {step2.composition_notes}
              </p>
            )}
            {step1.materials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {step1.materials.map((mat) => (
                  <span
                    key={mat}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {step2 && (
        <>
          {/* Animated Score Meters */}
          <section aria-label="Material scores" className="grid gap-4 sm:grid-cols-3">
            <ScoreMeter
              label="Recyclability"
              score={step2.recyclability_score}
              caption={step2.recyclability_level}
            />
            <ScoreMeter label="Reusability" score={step2.reusability_score} />
            <ScoreMeter
              label="Eco-Safety"
              score={step2.eco_safety_score}
              caption="Higher means safer for ecosystems"
            />
          </section>

          {/* What to do card */}
          <section className="ewa-card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-foreground">What to do</h3>
            <div className="mt-4 rounded-xl border border-primary/20 bg-secondary p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Bin recommendation
              </div>
              <div className="mt-1 font-display text-lg font-semibold text-primary">
                {step2.bin_recommendation}
              </div>
            </div>

            {step2.prep_steps.length > 0 && (
              <ol className="mt-5 space-y-2.5">
                {step2.prep_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {step2.contamination_warnings.length > 0 && (
              <div className="mt-5 rounded-xl border border-accent/30 bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Contamination warnings
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-accent">
                  {step2.contamination_warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Environmental impact + Pro tip */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="ewa-card p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Environmental impact
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step2.environmental_impact}
              </p>
            </div>
            <div className="ewa-card p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                Pro tip
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step2.pro_tip}</p>
            </div>
          </section>

          {/* DIY Reuse section */}
          {step2.diy_ideas.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Reuse it</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {step2.diy_ideas.map((idea, idx) => (
                  <DiyVideoCard key={`${idea.title}-${idx}`} idea={idea} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Actions */}
      <div className="ewa-no-print flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onScanAnother}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Scan another item
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print / Save as PDF
        </button>
        {shareNote && <span className="text-xs text-muted-foreground">{shareNote}</span>}
      </div>
    </div>
  );
}