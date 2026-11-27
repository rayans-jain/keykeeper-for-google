import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { HistoryGrid } from "@/components/HistoryGrid";
import { ResultCards } from "@/components/ResultCards";
import { HISTORY_KEY, useLocalStorage } from "@/hooks/useLocalStorage";
import type { ScanRecord } from "@/types/scan";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — Eco Waste Wise" },
      {
        name: "description",
        content: "Review your past item scans, saved valuables, and recyclability scores.",
      },
      { property: "og:title", content: "Scan History — Eco Waste Wise" },
      {
        property: "og:description",
        content: "Review your browser-saved scans and reopen full material reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [records, setRecords] = useLocalStorage<ScanRecord[]>(HISTORY_KEY, []);
  const [selected, setSelected] = useState<ScanRecord | null>(null);

  if (selected) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="ewa-no-print inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to history
        </button>
        <ResultCards record={selected} onScanAnother={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 ewa-animate-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Scan History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Reopen any previous report or track how many valuables you kept out of the bin.
          </p>
        </div>
        <Link
          to="/scan"
          className="inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          New scan
        </Link>
      </div>

      <HistoryGrid
        records={records}
        onSelect={(rec) => setSelected(rec)}
        onDeleteOne={(id) => setRecords((prev) => prev.filter((item) => item.id !== id))}
        onClearAll={() => setRecords([])}
      />
    </div>
  );
}