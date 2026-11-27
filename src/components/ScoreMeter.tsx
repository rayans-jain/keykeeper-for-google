import { useEffect, useState } from "react";

interface ScoreMeterProps {
  label: string;
  score: number;
  caption?: string;
}

export function ScoreMeter({ label, score, caption }: ScoreMeterProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 650;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(clamped * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clamped]);

  const isLow = clamped < 40;

  return (
    <div className="ewa-card p-5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span
          className={`font-display text-2xl font-bold tabular-nums ${
            isLow ? "text-accent" : "text-primary"
          }`}
        >
          {display}
          <span className="text-sm font-normal text-muted-foreground">/100</span>
        </span>
      </div>
      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isLow ? "bg-accent" : "bg-primary"
          }`}
          style={{ width: `${display}%` }}
        />
      </div>
      {caption && <p className="mt-2 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}