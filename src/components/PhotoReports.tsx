import { ExternalLink, Printer, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItemDisposition, ScanRecord } from "@/types/scan";

const LABELS: Record<ItemDisposition, string> = {
  USEFUL: "Useful · keep",
  RECYCLABLE: "Recyclable",
  RESIDUAL: "Not useful · waste",
  MEDICAL: "Medical · separate",
  UNCLEAR: "Needs checking",
};

export function PhotoReports({ record, previewUrl, onScanAnother }: {
  record: ScanRecord;
  previewUrl?: string | undefined;
  onScanAnother: () => void;
}) {
  const items = record.items ?? [];
  return (
    <div className="space-y-8 ewa-animate-in">
      <header className="flex flex-wrap items-start gap-5 border-b border-border pb-6">
        <img src={previewUrl || record.thumbnail} alt="Scanned products" className="h-24 w-24 rounded-lg border border-border object-cover sm:h-28 sm:w-28" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-primary">Your sorting report</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{items.length} product{items.length === 1 ? "" : "s"} identified</h1>
          <p className="mt-2 text-sm text-muted-foreground">{items.filter(i => i.disposition === "USEFUL").length} useful · {items.filter(i => i.disposition === "RECYCLABLE").length} recyclable · {items.filter(i => i.disposition === "MEDICAL").length} medical</p>
        </div>
        <div className="ewa-no-print flex gap-2">
          <Button onClick={onScanAnother}><RotateCcw />New scan</Button>
          <Button variant="outline" size="icon" title="Print report" aria-label="Print report" onClick={() => window.print()}><Printer /></Button>
        </div>
      </header>
      <section>
        <h2 className="mb-4 text-xl font-semibold">At a glance</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-background/80">
          <table className="report-table" aria-label="Product summary">
            <colgroup><col className="w-[24%]" /><col className="w-[24%]" /><col className="w-[52%]" /></colgroup>
            <thead><tr><th scope="col">Product</th><th scope="col">Useful or waste?</th><th scope="col">What to do</th></tr></thead>
            <tbody>{items.map((item, index) => (
              <tr key={index} className={item.disposition === "MEDICAL" ? "medical-row" : ""}>
                <td><a href={`#product-${index}`} className="font-semibold text-foreground underline decoration-border underline-offset-4">{index + 1}. {item.name}</a><p className="mt-2 text-xs text-muted-foreground">{item.condition}</p></td>
                <td><span className={`font-semibold ${item.disposition === "MEDICAL" ? "text-destructive" : "text-primary"}`}>{LABELS[item.disposition]}</span></td>
                <td>{item.action}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      {items.map((item, index) => (
        <section id={`product-${index}`} key={`${item.name}-${index}`} className="scroll-mt-6 border-b border-border pb-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">{index + 1}. {item.name}</h2>
            <span className={`text-xs font-semibold ${item.disposition === "MEDICAL" ? "text-destructive" : "text-primary"}`}>{LABELS[item.disposition]}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.usefulness}</p>
          <p className="mt-2 text-xs text-muted-foreground">{item.location} · {item.confidence}% confidence</p>
          {item.warnings.length > 0 && (
            <div role="note" className="mt-4 border-l-4 border-destructive bg-destructive/10 p-4 text-sm">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-destructive"><ShieldAlert className="h-4 w-4" />{item.disposition === "MEDICAL" ? "Medical waste — special handling" : "Safety first"}</h3>
              <ul className="list-disc space-y-1 pl-5">{item.warnings.map((warning, i) => <li key={i}>{warning}</li>)}</ul>
            </div>
          )}
          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background/80">
            <table className="report-table" aria-label={`${item.name} component disposal`}>
              <colgroup><col className="w-[28%]" /><col className="w-[72%]" /></colgroup>
              <thead><tr><th scope="col">Part / material</th><th scope="col">{item.disposition === "MEDICAL" ? "Safe disposal" : "Recycling / reuse steps"}</th></tr></thead>
              <tbody>{item.components.map((part, i) => (
                <tr key={i} className={item.disposition === "MEDICAL" ? "medical-row" : ""}>
                  <td><h3 className="font-semibold">{part.name}</h3><p className="mt-1 text-xs text-muted-foreground">{part.material}</p></td>
                  <td>
                    <ol className="list-decimal space-y-2 pl-4 text-muted-foreground">{part.recycling_steps.map((step, j) => <li key={j}>{step}</li>)}</ol>
                    {item.disposition !== "MEDICAL" && part.youtube_search_query && (
                      <div className="ewa-no-print mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        <a className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-primary underline underline-offset-4" href={part.video ? `https://www.youtube.com/watch?v=${encodeURIComponent(part.video.videoId)}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(part.youtube_search_query)}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5 shrink-0" />{part.video ? "Watch on YouTube" : "Search YouTube tutorials"}</a>
                        {part.video && <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(part.youtube_search_query)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 text-xs text-muted-foreground underline underline-offset-4">Other tutorials <ExternalLink className="h-3 w-3" /></a>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      ))}
      <p className="text-xs leading-relaxed text-muted-foreground">Photo-based guidance cannot confirm hidden materials, contamination or whether electronics work. Local collection rules take priority.</p>
    </div>
  );
}
