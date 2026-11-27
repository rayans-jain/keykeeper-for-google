import { ExternalLink, Printer, RotateCcw, ShieldAlert, PackageCheck, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItemDisposition, ScanRecord } from "@/types/scan";

const LABELS: Record<ItemDisposition, string> = {
  USEFUL: "Useful · keep or reuse",
  RECYCLABLE: "Recyclable waste",
  RESIDUAL: "Residual waste",
  MEDICAL: "Medical waste · separate",
  UNCLEAR: "Needs checking",
};

export function PhotoReports({
  record,
  previewUrl,
  onScanAnother,
}: {
  record: ScanRecord;
  previewUrl?: string | undefined;
  onScanAnother: () => void;
}) {
  const items = record.items ?? [];
  return (
    <div className="space-y-8 ewa-animate-in">
      <header className="grid gap-5 border-b border-border pb-6 sm:grid-cols-[140px_1fr]">
        <img
          src={previewUrl || record.thumbnail}
          alt="Scanned products"
          className="h-36 w-36 rounded-lg border border-border object-cover"
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-primary">Your sorting report</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {items.length} product{items.length === 1 ? "" : "s"} identified
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.filter((i) => i.disposition === "USEFUL").length} useful ·{" "}
            {items.filter((i) => i.disposition === "RECYCLABLE").length} recyclable ·{" "}
            {items.filter((i) => i.disposition === "MEDICAL").length} medical
          </p>
          <div className="ewa-no-print mt-4 flex gap-3">
            <Button onClick={onScanAnother}>
              <RotateCcw />
              Scan another item
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Print report"
              aria-label="Print report"
              onClick={() => window.print()}
            >
              <Printer />
            </Button>
          </div>
        </div>
      </header>
      <p className="text-xs text-muted-foreground">
        Photo-based guidance cannot confirm hidden materials, contamination or whether electronics
        work. Local collection rules take priority.
      </p>
      {items.map((item, index) => (
        <article key={`${item.name}-${index}`} className="border-b border-border pb-8">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              {item.disposition === "MEDICAL" ? (
                <ShieldAlert />
              ) : item.disposition === "USEFUL" ? (
                <PackageCheck />
              ) : (
                <Recycle />
              )}
            </span>
            <div className="min-w-0">
              <p
                className={`text-xs font-semibold ${item.disposition === "MEDICAL" ? "text-destructive" : "text-primary"}`}
              >
                {LABELS[item.disposition]}
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {index + 1}. {item.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.location} · {item.condition} · {item.confidence}% confidence
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Is it useful?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.usefulness}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Recommended action</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.action}</p>
            </div>
          </div>
          {item.warnings.length > 0 && (
            <div
              role="note"
              className="mt-5 border-l-4 border-destructive bg-destructive/10 p-4 text-sm text-foreground"
            >
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
                <ShieldAlert className="h-4 w-4" />
                {item.disposition === "MEDICAL"
                  ? "Medical waste — special handling"
                  : "Safety & contamination"}
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                {item.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          <h3 className="mt-6 text-sm font-semibold">Component-by-component disposal</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {item.components.map((part, i) => (
              <div key={i} className="ewa-card p-5">
                <h4 className="font-semibold">{part.name}</h4>
                <p className="mt-1 text-xs text-primary">{part.material}</p>
                <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                  {part.recycling_steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
                {item.disposition !== "MEDICAL" && part.youtube_search_query && (
                  <a
                    className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4"
                    href={
                      part.video
                        ? `https://www.youtube.com/watch?v=${encodeURIComponent(part.video.videoId)}`
                        : `https://www.youtube.com/results?search_query=${encodeURIComponent(part.youtube_search_query)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {part.video ? "Watch recycling video" : "Find recycling videos"}
                  </a>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
