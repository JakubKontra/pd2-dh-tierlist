import Papa from "papaparse";
import { TIERS, type ClassName, type Tier } from "../types";
import type {
  BossLineup,
  BuildRow,
  ClassGroup,
  ClassTable,
  ClassTableRow,
  Flag,
  LateGameData,
  MapImmunities,
  MapImmunityFlag,
  MapRow,
  MapTier,
  Mover,
  MoversSection,
  NewOnSeason,
  RankedEntry,
  RankedList,
} from "./types";
import {
  BOSS_LINEUP_ANCHORS,
  CLASSES_IN_SHEET,
  CLASS_TABLE_HEADER_SUFFIX,
  MAP_ANCHOR,
  MOVERS_ANCHOR,
  NEW_ON_SEASON_ANCHOR,
  OVERALL_TOP_10_ANCHORS,
  RANKING_ANCHORS,
} from "./anchors";

type Grid = string[][];

function cell(grid: Grid, r: number, c: number): string {
  const row = grid[r];
  if (!row) return "";
  return (row[c] ?? "").toString();
}

function trimCell(grid: Grid, r: number, c: number): string {
  return cell(grid, r, c).trim();
}

function rowIsBlank(grid: Grid, r: number, fromCol: number, toCol: number): boolean {
  for (let c = fromCol; c <= toCol; c++) {
    if (trimCell(grid, r, c) !== "") return false;
  }
  return true;
}

function parseTier(raw: string): Tier | null {
  const v = raw.trim();
  if (!v) return null;
  return (TIERS as readonly string[]).includes(v) ? (v as Tier) : null;
}

function parseFlag(raw: string): Flag {
  const v = raw.trim();
  if (!v) return "empty";
  if (v === "❌") return "none";
  // Count ✔ glyphs (including "✔︎" variants)
  const checks = (v.match(/✔/g) ?? []).length;
  if (checks >= 3) return "strong";
  if (checks === 2) return "good";
  if (checks === 1) return "ok";
  return "empty";
}

function inferClassFromHeader(headerCell: string): ClassName | null {
  const v = headerCell.trim();
  if (!v.endsWith(CLASS_TABLE_HEADER_SUFFIX)) return null;
  const name = v.slice(0, -CLASS_TABLE_HEADER_SUFFIX.length).trim();
  return (CLASSES_IN_SHEET as string[]).includes(name)
    ? (name as ClassName)
    : null;
}

interface Anchor {
  row: number;
  col: number;
  label: string;
}

function findAnchors(grid: Grid, needle: string): Anchor[] {
  const out: Anchor[] = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      if (trimCell(grid, r, c) === needle) {
        out.push({ row: r, col: c, label: needle });
      }
    }
  }
  return out;
}

function findFirstAnchor(grid: Grid, needle: string): Anchor | null {
  return findAnchors(grid, needle)[0] ?? null;
}

function parseLegend(grid: Grid): string[] {
  const out: string[] = [];
  for (let r = 2; r < grid.length; r++) {
    const v = trimCell(grid, r, 0);
    if (v) out.push(v);
  }
  return out;
}

function parseClassTable(grid: Grid, headerRow: number, col: number, className: ClassName): ClassTable {
  const rows: ClassTableRow[] = [];
  let blankRun = 0;
  for (let r = headerRow + 1; r < grid.length; r++) {
    const name = trimCell(grid, r, col);
    const tierRaw = trimCell(grid, r, col + 1);
    const fortify = trimCell(grid, r, col + 2);
    const budget = trimCell(grid, r, col + 3);
    const hc = trimCell(grid, r, col + 4);
    const t12 = trimCell(grid, r, col + 5);

    // Section end if row is entirely blank in our 6 cols for 2 rows running
    // AND the name col contains something that reads like another section header
    if (!name && !tierRaw && !fortify && !budget && !hc && !t12) {
      blankRun++;
      if (blankRun >= 2) break;
      continue;
    }
    blankRun = 0;

    // Another class header in the same column ends this table
    const maybeOtherClass = inferClassFromHeader(name);
    if (maybeOtherClass && maybeOtherClass !== className) break;

    // "Other" is a plain subtree divider; also "<Class> Builds" would already have been caught
    if (tierRaw === "Tier" && fortify === "Fortify?") break;

    // Subtree row: build name only, no tier/flags
    if (name && !tierRaw && !fortify && !budget && !hc && !t12) {
      rows.push({ kind: "subtree", name });
      continue;
    }

    // Regular build
    if (name) {
      const row: BuildRow = {
        kind: "build",
        name,
        tier: parseTier(tierRaw),
        fortify: parseFlag(fortify),
        budget: parseFlag(budget),
        hardcore: parseFlag(hc),
        t1t2: parseFlag(t12),
      };
      rows.push(row);
    }
  }
  return { className, rows };
}

function parseClassTables(grid: Grid): ClassTable[] {
  const out: ClassTable[] = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      const v = trimCell(grid, r, c);
      const cls = inferClassFromHeader(v);
      if (!cls) continue;
      if (trimCell(grid, r, c + 1) !== "Tier") continue;
      if (out.some((t) => t.className === cls)) continue;
      out.push(parseClassTable(grid, r, c, cls));
    }
  }
  // Preserve the canonical class order regardless of grid order
  out.sort(
    (a, b) =>
      CLASSES_IN_SHEET.indexOf(a.className) -
      CLASSES_IN_SHEET.indexOf(b.className)
  );
  return out;
}

// Generic ranked list: columns [rank, name, ..., tier?] starting at given row+col
// For Top 10 lists, tier is at col+4 (because of merged cells).
function parseRankedList(
  grid: Grid,
  headerRow: number,
  col: number,
  tierColOffset: number | null
): RankedEntry[] {
  const out: RankedEntry[] = [];
  let blankRun = 0;
  for (let r = headerRow + 1; r < grid.length; r++) {
    const rank = trimCell(grid, r, col);
    const name = trimCell(grid, r, col + 1);
    const tierRaw =
      tierColOffset !== null ? trimCell(grid, r, col + tierColOffset) : "";

    // Stop if the rank col now contains a next-section header (non-# text)
    if (rank && !/^#/.test(rank) && !name && !tierRaw) break;

    if (!rank && !name) {
      blankRun++;
      if (blankRun >= 2) break;
      continue;
    }
    blankRun = 0;

    // Some lists use "#1-2", "#3-6" (Overall Class Power Ranking)
    if (!/^#/.test(rank) && !/^\d/.test(rank)) break;

    out.push({
      rank,
      name,
      tier: tierColOffset !== null ? parseTier(tierRaw) : null,
    });
  }
  return out;
}

function parseRankings(grid: Grid): RankedList[] {
  const out: RankedList[] = [];
  for (const title of RANKING_ANCHORS) {
    const anchor = findFirstAnchor(grid, title);
    if (!anchor) continue;
    const tierOffset = title === "Solo Mapping Top 10" ? 4 : null;
    const entries = parseRankedList(grid, anchor.row, anchor.col, tierOffset);
    if (entries.length) out.push({ title, entries });
  }
  return out;
}

function parseMovers(grid: Grid): MoversSection | null {
  const anchor = findFirstAnchor(grid, MOVERS_ANCHOR);
  if (!anchor) return null;
  const out: Mover[] = [];
  const col = anchor.col;
  let blankRun = 0;
  for (let r = anchor.row + 1; r < grid.length; r++) {
    const rank = trimCell(grid, r, col);
    const name = trimCell(grid, r, col + 1);
    const from = trimCell(grid, r, col + 2);
    const arrow = trimCell(grid, r, col + 3);
    const to = trimCell(grid, r, col + 4);
    if (!rank && !name) {
      blankRun++;
      if (blankRun >= 2) break;
      continue;
    }
    blankRun = 0;
    if (!/^#/.test(rank)) break;
    if (arrow && arrow !== "→") break;
    out.push({ rank, name, from: parseTier(from), to: parseTier(to) });
  }
  return { title: MOVERS_ANCHOR, entries: out };
}

function parseNewOnSeason(grid: Grid): NewOnSeason | null {
  const anchor = findFirstAnchor(grid, NEW_ON_SEASON_ANCHOR);
  if (!anchor) return null;
  // Uses the same shape as Solo Mapping Top 10 (tier at col+4)
  const entries = parseRankedList(grid, anchor.row, anchor.col, 4);
  return { title: NEW_ON_SEASON_ANCHOR, entries };
}

function parseClassGroupsDown(
  grid: Grid,
  headerRow: number,
  col: number
): ClassGroup[] {
  const groups: ClassGroup[] = [];
  let current: ClassGroup | null = null;
  for (let r = headerRow + 1; r < grid.length; r++) {
    const name = trimCell(grid, r, col);
    const build = trimCell(grid, r, col + 1);

    // Another anchor or blank section end: stop on two blank rows
    if (!name && !build) {
      // continue: blank rows separate class groups in some columns
      continue;
    }

    // Class header line
    if ((CLASSES_IN_SHEET as string[]).includes(name) && !build) {
      if (current && current.entries.length) groups.push(current);
      current = { className: name as ClassName, entries: [] };
      continue;
    }

    // Ranked entry within current class group
    if (/^#/.test(name) && build) {
      if (!current) continue;
      current.entries.push({ rank: name, name: build, tier: null });
      continue;
    }

    // Anything else (another section label in the same column) ends this lineup
    if (name && !/^#/.test(name)) {
      break;
    }
  }
  if (current && current.entries.length) groups.push(current);
  return groups;
}

function parseBossLineups(grid: Grid): BossLineup[] {
  const out: BossLineup[] = [];
  for (const title of BOSS_LINEUP_ANCHORS) {
    const anchor = findFirstAnchor(grid, title);
    if (!anchor) continue;
    const groups = parseClassGroupsDown(grid, anchor.row, anchor.col);
    if (groups.length) out.push({ title, groups });
  }
  // Also attach the Overall Top 10 lineups as their own entries
  for (const title of OVERALL_TOP_10_ANCHORS) {
    const anchor = findFirstAnchor(grid, title);
    if (!anchor) continue;
    const entries = parseRankedList(grid, anchor.row, anchor.col, null);
    if (!entries.length) continue;
    out.push({
      title,
      groups: [{ className: "Unknown" as ClassName, entries }],
    });
  }
  return out;
}

function parseImmunityFlag(raw: string): MapImmunityFlag {
  return raw.trim() ? "yes" : "no";
}

function parseMapImmunities(grid: Grid): MapImmunities {
  const anchor = findFirstAnchor(grid, MAP_ANCHOR);
  if (!anchor) return { tiers: [], footnote: null };
  const col = anchor.col;

  // The "Maps" sub-header lives 2 rows below the anchor (e.g., row 3 -> anchor row 1)
  // Walk rows downward looking for "Tier 1/2/3" labels in col
  const tiers: MapTier[] = [];
  let current: MapTier | null = null;
  let footnote: string | null = null;

  for (let r = anchor.row + 1; r < grid.length; r++) {
    const label = trimCell(grid, r, col);
    if (!label) {
      if (rowIsBlank(grid, r, col, col + 6)) continue;
    }

    // Tier label opens a new bucket
    if (/^Tier \d$/.test(label)) {
      if (current) tiers.push(current);
      current = { label, maps: [] };
      continue;
    }

    // Fire/Cold/Lightning/... header row — skip
    if (label === "Maps" || label === "Fire") continue;

    // Footnote row (starts with *)
    if (label.startsWith("*")) {
      footnote = label;
      continue;
    }

    // Data row
    if (label && current) {
      const mapRow: MapRow = {
        name: label,
        fire: parseImmunityFlag(trimCell(grid, r, col + 1)),
        cold: parseImmunityFlag(trimCell(grid, r, col + 2)),
        lightning: parseImmunityFlag(trimCell(grid, r, col + 3)),
        poison: parseImmunityFlag(trimCell(grid, r, col + 4)),
        physical: parseImmunityFlag(trimCell(grid, r, col + 5)),
        magic: parseImmunityFlag(trimCell(grid, r, col + 6)),
      };
      current.maps.push(mapRow);
    }
  }
  if (current) tiers.push(current);
  return { tiers, footnote };
}

export function parseLateGame(csv: string): LateGameData {
  const parsed = Papa.parse<string[]>(csv, {
    skipEmptyLines: false,
    dynamicTyping: false,
  });
  const grid = parsed.data.filter(Array.isArray) as Grid;

  return {
    legend: parseLegend(grid),
    classTables: parseClassTables(grid),
    rankings: parseRankings(grid),
    bossLineups: parseBossLineups(grid),
    movers: parseMovers(grid),
    newOnSeason: parseNewOnSeason(grid),
    mapImmunities: parseMapImmunities(grid),
    fetchedAt: Date.now(),
  };
}
