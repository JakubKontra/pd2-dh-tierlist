import Papa from "papaparse";
import { inferClass } from "./classMap";
import { applyHandicap } from "./tiering";
import {
  TIERS,
  type Build,
  type DensityProfile,
  type MapRun,
  type Season,
  type Tier,
  type TierCutoffs,
  type Tierlist,
} from "./types";

function parseSeason(cell: unknown): Season | null {
  if (cell === null || cell === undefined) return null;
  const s = String(cell).trim();
  if (!s) return null;
  const m = s.match(/\b(?:s(?:eason)?[\s-]*)?(10|11|12|13)\b/i);
  if (!m) return null;
  return `S${m[1]}` as Season;
}

interface ParsedTierTable {
  tierCutoffs: Map<Tier, number>;
  classScores: Map<
    string,
    { mapping: number; starter: number; bossing: number; total: number }
  >;
  mean: number;
  max: number;
  min: number;
  median: number;
}

function stripMapSuffix(raw: string): {
  name: string;
  fortified: boolean;
  doubleFortified: boolean;
} {
  const trimmed = raw.trim();
  const m = trimmed.match(/^(.*?)\s*\((2xf|f)\)\s*$/i);
  if (m) {
    const fortified = true;
    const doubleFortified = m[2].toLowerCase() === "2xf";
    return { name: m[1].trim(), fortified, doubleFortified };
  }
  return { name: trimmed, fortified: false, doubleFortified: false };
}

function parseBuildMeta(raw: string): {
  displayName: string;
  handicap: number;
  retested: boolean | null;
} {
  let displayName = raw.trim();
  let handicap = 0;
  let retested: boolean | null = null;

  const hMatch = displayName.match(/\(H Lvl (-?\d+)\)/i);
  if (hMatch) {
    handicap = parseInt(hMatch[1], 10) / 3;
    displayName = displayName.replace(hMatch[0], "").trim();
  }

  if (/\(RT'd(?: x\d+)?\)/i.test(displayName)) {
    retested = true;
    displayName = displayName.replace(/\(RT'd(?: x\d+)?\)/gi, "").trim();
  } else if (/NOT RT'd/i.test(displayName)) {
    retested = false;
    displayName = displayName.replace(/NOT RT'd/gi, "").trim();
  }

  displayName = displayName.replace(/\s+/g, " ").trim();
  return { displayName, handicap, retested };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numOrNull(cell: unknown): number | null {
  if (cell === null || cell === undefined) return null;
  const s = String(cell).trim();
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function extractTierTable(rows: string[][]): ParsedTierTable {
  const tierCutoffs = new Map<Tier, number>();
  const classScores = new Map<
    string,
    { mapping: number; starter: number; bossing: number; total: number }
  >();
  let mean = 0;
  let max = 0;
  let min = 0;
  let median = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const colP = (row[15] ?? "").toString().trim();
    const colQ = numOrNull(row[16]);
    const colR = (row[17] ?? "").toString().trim();

    if (colQ !== null && TIERS.includes(colR as Tier)) {
      tierCutoffs.set(colR as Tier, colQ);
    }

    if (colP === "Top 3 Map Avg. MPM Mean") mean = colQ ?? mean;
    if (colP === "Top 3 Map Avg. MPM Median") median = colQ ?? median;
    if (colP === "Top 3 Map Avg. MPM Max") max = colQ ?? max;
    if (colP === "Top 3 Map Avg. MPM Min") min = colQ ?? min;

    const colS = (row[18] ?? "").toString().trim();
    if (colS && i + 1 < rows.length) {
      const next = rows[i + 1];
      const scoreMapping = numOrNull(next[18]);
      const scoreStarter = numOrNull(next[19]);
      const scoreBossing = numOrNull(next[20]);
      const scoreTotal = numOrNull(next[21]);
      if (
        scoreMapping !== null &&
        scoreStarter !== null &&
        scoreBossing !== null &&
        scoreTotal !== null &&
        !classScores.has(colS)
      ) {
        classScores.set(colS, {
          mapping: scoreMapping,
          starter: scoreStarter,
          bossing: scoreBossing,
          total: scoreTotal,
        });
      }
    }
  }

  return { tierCutoffs, classScores, mean, max, min, median };
}

function buildCutoffsForDerivation(
  parsed: ParsedTierTable
): { cutoffs: TierCutoffs; tierLowerBounds: [Tier, number][] } {
  const entries = Array.from(parsed.tierCutoffs.entries()).sort(
    (a, b) => TIERS.indexOf(a[0]) - TIERS.indexOf(b[0])
  );
  const cutoffs: TierCutoffs = {
    topHalfInterval: 24.37,
    bottomHalfInterval: 28.33,
    median: parsed.median || parsed.mean,
    max: parsed.max,
    min: parsed.min,
  };
  return { cutoffs, tierLowerBounds: entries };
}

function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
}

function classifyDensity(sd: number, avg: number): DensityProfile {
  if (avg <= 0) return "neutral";
  const cv = sd / avg;
  if (cv < 0.05) return "consistent";
  if (cv > 0.11) return "density-dependent";
  return "neutral";
}

function tierFromCutoffs(
  value: number,
  lowerBounds: [Tier, number][]
): Tier {
  for (const [tier, lb] of lowerBounds) {
    if (value >= lb) return tier;
  }
  return "F-";
}

export function parseTierlist(csv: string): Tierlist {
  const parsed = Papa.parse<string[]>(csv, {
    skipEmptyLines: false,
    dynamicTyping: false,
  });
  const rows = parsed.data.filter(Array.isArray) as string[][];
  if (rows.length < 2) {
    throw new Error("Tierlist CSV empty or malformed");
  }

  const headerIdx = rows.findIndex((r) =>
    (r[0] ?? "").toString().toLowerCase().startsWith("s10")
  );
  const dataStart = headerIdx === -1 ? 1 : headerIdx + 1;

  const headerRow = headerIdx === -1 ? [] : rows[headerIdx];
  const seasonColIdx = headerRow.findIndex((cell) =>
    /^season\b/i.test((cell ?? "").toString().trim())
  );

  const table = extractTierTable(rows.slice(dataStart, dataStart + 20));
  const { cutoffs, tierLowerBounds } = buildCutoffsForDerivation(table);

  const builds: Build[] = [];
  const seen = new Set<string>();

  for (let i = dataStart; i < rows.length; i++) {
    const row = rows[i];
    const nameCell = (row[0] ?? "").toString().trim();
    const map1 = (row[1] ?? "").toString().trim();
    const mpm1 = numOrNull(row[2]);
    const den1 = numOrNull(row[3]);
    const norm1 = numOrNull(row[4]);
    if (!nameCell || !map1 || mpm1 === null || den1 === null || norm1 === null) {
      continue;
    }
    if (/^key\b/i.test(nameCell)) break;
    if (nameCell.length > 80) continue;

    const { displayName, handicap, retested } = parseBuildMeta(nameCell);
    const className = inferClass(displayName);
    const season =
      seasonColIdx >= 0 ? parseSeason(row[seasonColIdx]) : null;

    const maps: MapRun[] = [];
    const pushMap = (
      n: string,
      mpm: number | null,
      d: number | null,
      norm: number | null
    ) => {
      if (!n || mpm === null || d === null || norm === null) return;
      if (n === "---") return;
      const { name, fortified, doubleFortified } = stripMapSuffix(n);
      maps.push({ name, fortified, doubleFortified, mpm, density: d, normalizedMpm: norm });
    };
    pushMap(map1, mpm1, den1, norm1);
    pushMap(
      (row[5] ?? "").toString().trim(),
      numOrNull(row[6]),
      numOrNull(row[7]),
      numOrNull(row[8])
    );
    pushMap(
      (row[9] ?? "").toString().trim(),
      numOrNull(row[10]),
      numOrNull(row[11]),
      numOrNull(row[12])
    );
    if (maps.length === 0) continue;

    const avgMpm = numOrNull(row[13]) ?? maps.reduce((a, m) => a + m.mpm, 0) / maps.length;
    const avgNormalizedMpm =
      numOrNull(row[14]) ??
      maps.reduce((a, m) => a + m.normalizedMpm, 0) / maps.length;

    const tierRaw = tierFromCutoffs(avgNormalizedMpm, tierLowerBounds);
    const tierAdjusted = applyHandicap(tierRaw, handicap);

    const norms = maps.map((m) => m.normalizedMpm);
    const normStdDev = stdDev(norms);
    const densityProfile = classifyDensity(normStdDev, avgNormalizedMpm);

    let baseId = slugify(displayName);
    let id = baseId;
    let n = 2;
    while (seen.has(id)) {
      id = `${baseId}-${n++}`;
    }
    seen.add(id);

    builds.push({
      id,
      rawName: nameCell,
      displayName,
      className,
      handicap,
      retested,
      season,
      maps,
      avgMpm,
      avgNormalizedMpm,
      tierRaw,
      tierAdjusted,
      normStdDev,
      densityProfile,
    });
  }

  return {
    builds,
    cutoffs,
    fetchedAt: Date.now(),
  };
}
