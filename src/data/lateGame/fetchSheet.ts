import { useCallback, useEffect, useState } from "react";
import { parseLateGame } from "./parse";
import type { LateGameData } from "./types";

const SHEET_ID = "11r09KWriYPhm4eyu1TxTV4IVP6GWHjV7iqkjF3H60eo";
const GID = "0";
export const LATE_GAME_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${GID}`;
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
const CACHE_KEY = "pd2-lategame-v1";
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

export async function fetchLateGame(force = false): Promise<LateGameData> {
  if (!force) {
    const cached = readCache();
    if (cached) return parseLateGame(cached.csv);
  }
  const res = await fetch(CSV_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const csv = await res.text();
  writeCache(csv);
  return parseLateGame(csv);
}

export interface LateGameState {
  data: LateGameData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLateGame(): LateGameState {
  const [data, setData] = useState<LateGameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reqId, setReqId] = useState(0);

  const refetch = useCallback(() => setReqId((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLateGame(reqId > 0)
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
