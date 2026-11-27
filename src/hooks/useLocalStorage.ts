import { useCallback, useEffect, useState } from "react";
import type { ScanRecord, YoutubeVideo } from "@/types/scan";

export const HISTORY_KEY = "ewa_history";
export const VIDEO_CACHE_KEY = "ewa_video_cache";
export const RATE_LIMIT_KEY = "ewa_rate_limit";
export const MAX_HISTORY = 30;
export const MAX_SCANS_PER_HOUR = 10;
const ONE_HOUR_MS = 60 * 60 * 1000;

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // Ignore storage read errors
    } finally {
      setHydrated(true);
    }
  }, [key]);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage quota or private mode
        }
        return next;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}

export function saveScanToHistory(record: ScanRecord): ScanRecord[] {
  let existing: ScanRecord[] = [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (raw) existing = JSON.parse(raw) as ScanRecord[];
  } catch {
    existing = [];
  }

  let next = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, MAX_HISTORY);

  while (next.length > 0) {
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    } catch {
      // QuotaExceededError: drop oldest entry and retry
      next = next.slice(0, -1);
    }
  }
  return [];
}

export function getCachedVideo(query: string): YoutubeVideo | undefined {
  try {
    const raw = window.localStorage.getItem(VIDEO_CACHE_KEY);
    if (!raw) return undefined;
    const cache = JSON.parse(raw) as Record<string, YoutubeVideo>;
    return cache[query.toLowerCase().trim()];
  } catch {
    return undefined;
  }
}

export function setCachedVideo(query: string, video: YoutubeVideo): void {
  try {
    const raw = window.localStorage.getItem(VIDEO_CACHE_KEY);
    const cache: Record<string, YoutubeVideo> = raw ? (JSON.parse(raw) as Record<string, YoutubeVideo>) : {};
    cache[query.toLowerCase().trim()] = video;
    window.localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache write errors
  }
}

export function checkAndRecordRateLimit(): { allowed: boolean; minutesUntilReset: number } {
  const now = Date.now();
  let timestamps: number[] = [];
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
    if (raw) {
      timestamps = (JSON.parse(raw) as number[]).filter((t) => now - t < ONE_HOUR_MS);
    }
  } catch {
    timestamps = [];
  }

  if (timestamps.length >= MAX_SCANS_PER_HOUR) {
    const oldest = timestamps[0] ?? now;
    const minutesUntilReset = Math.max(1, Math.ceil((ONE_HOUR_MS - (now - oldest)) / 60000));
    return { allowed: false, minutesUntilReset };
  }

  timestamps.push(now);
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
  } catch {
    // Ignore
  }
  return { allowed: true, minutesUntilReset: 0 };
}