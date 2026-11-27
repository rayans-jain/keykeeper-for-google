import { ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ScanRecord } from "@/types/scan";

interface HistoryGridProps {
  records: ScanRecord[];
  onSelect: (record: ScanRecord) => void;
  onDeleteOne: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryGrid({ records, onSelect, onDeleteOne, onClearAll }: HistoryGridProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const totalScans = records.length;
  const valuablesSaved = records.filter((r) => r.step1.verdict === "VALUABLE").length;
  const wasteWithScores = records.filter((r) => r.step1.verdict === "WASTE" && r.step2);
  const avgRecyclability =
    wasteWithScores.length > 0
      ? Math.round(
          wasteWithScores.reduce((sum, r) => sum + (r.step2?.recyclability_score ?? 0), 0) /
            wasteWithScores.length,
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="ewa-card p-5">
          <div className="text-xs font-medium text-muted-foreground">Total scans</div>
          <div className="mt-1 font-display text-3xl font-bold text-primary">{totalScans}</div>
        </div>
        <div className="ewa-card p-5">
          <div className="text-xs font-medium text-muted-foreground">Valuables saved</div>
          <div className="mt-1 font-display text-3xl font-bold text-accent">{valuablesSaved}</div>
        </div>
        <div className="ewa-card p-5">
          <div className="text-xs font-medium text-muted-foreground">Average recyclability</div>
          <div className="mt-1 font-display text-3xl font-bold text-primary">
            {wasteWithScores.length > 0 ? `${avgRecyclability}%` : "—"}
          </div>
        </div>
      </div>

      {/* Header + clear all */}
      {records.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Stored privately in this browser (up to 30 recent scans).
          </p>
          {confirmClear ? (
            <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-background px-3 py-1.5">
              <span className="text-xs font-medium text-accent">Clear all history?</span>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="min-h-[36px] rounded-full bg-accent px-3 text-xs font-semibold text-accent-foreground"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="min-h-[36px] rounded-full border border-border px-3 text-xs font-medium text-foreground"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border px-4 text-xs font-medium text-accent transition-colors hover:border-accent"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {records.length === 0 ? (
        <div className="ewa-card p-10 text-center">
          <h2 className="text-lg font-semibold text-foreground">No scans yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Items you scan will appear here so you can revisit disposal steps and DIY videos anytime.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => {
            const isValuable = record.step1.verdict === "VALUABLE";
            const isWaste = record.step1.verdict === "WASTE";
            const dateLabel = new Date(record.timestamp).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            return (
              <article
                key={record.id}
                className="ewa-card group flex flex-col overflow-hidden transition-all duration-200 hover:border-primary/40"
              >
                <button
                  type="button"
                  onClick={() => onSelect(record)}
                  className="flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                    {record.thumbnail && (
                      <img
                        src={record.thumbnail}
                        alt={record.step1.item_name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <span
                      className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isValuable
                          ? "bg-accent text-accent-foreground"
                          : isWaste
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-background text-foreground"
                      }`}
                    >
                      {record.step1.verdict}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{dateLabel}</span>
                      {record.step2 && (
                        <span className="font-medium text-primary">
                          Recyclability {record.step2.recyclability_score}%
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 line-clamp-1 text-base font-semibold text-foreground">
                      {record.step1.item_name}
                    </h3>
                    <div className="mt-auto flex items-center gap-1 pt-3 text-xs font-medium text-primary">
                      View report
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                </button>
                <div className="flex justify-end border-t border-border px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => onDeleteOne(record.id)}
                    aria-label={`Delete ${record.step1.item_name} from history`}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}