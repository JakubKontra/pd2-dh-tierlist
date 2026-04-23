import { useCallback, useEffect, useState } from "react";
import { parseFarmingGuide } from "./parse";
import type { FarmingGuideData } from "./types";

const SHEET_ID = "137uC_CHqDKdwvTDDhHCaMRpmPeResTjf6L2U4SCDdDE";
const GID = "0";
export const FARMING_GUIDE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${GID}`;
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
const CACHE_KEY = "pd2-farmingguide-v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  csv: string;
  fetchedAt: number;
}

function readCache(): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
}

function writeCache(csv: string) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ csv, fetchedAt: Date.now() } satisfies CacheEntry)
    );
  } catch {
    /* quota, private mode */
  }
}

export async function fetchFarmingGuide(force = false): Promise<FarmingGuideData> {
  if (!force) {
    const cached = readCache();
    if (cached) return parseFarmingGuide(cached.csv);
  }
  const res = await fetch(CSV_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const csv = await res.text();
  writeCache(csv);
  return parseFarmingGuide(csv);
}

export interface FarmingGuideState {
  data: FarmingGuideData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFarmingGuide(): FarmingGuideState {
  const [data, setData] = useState<FarmingGuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reqId, setReqId] = useState(0);

  const refetch = useCallback(() => setReqId((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFarmingGuide(reqId > 0)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reqId]);

  return { data, loading, error, refetch };
}
