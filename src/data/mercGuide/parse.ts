import Papa from "papaparse";
import {
  ACT_LABEL_REGEX,
  HEADER_BUILDS_ANCHOR,
  NOT_APPLICABLE,
  SAME_AS_OFFENSIVE,
} from "./anchors";
import type {
  ActPriority,
  MercActLabel,
  MercBuildRow,
  MercGuideData,
  MercSlot,
} from "./types";

type Grid = string[][];

function trimCell(grid: Grid, r: number, c: number): string {
  const row = grid[r];
  if (!row) return "";
  return (row[c] ?? "").toString().trim();
}

function rawCell(grid: Grid, r: number, c: number): string {
  const row = grid[r];
  if (!row) return "";
  return (row[c] ?? "").toString();
}

interface Anchor {
  row: number;
  col: number;
}

function findAnchor(grid: Grid, needle: string): Anchor | null {
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      if (trimCell(grid, r, c) === needle) return { row: r, col: c };
    }
  }
  return null;
}

function splitLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseOffensiveSlot(grid: Grid, r: number, col: number): MercSlot {
  return {
    mercTypes: splitLines(rawCell(grid, r, col + 1)),
    items: splitLines(rawCell(grid, r, col + 2)),
  };
}

function parseDefensiveSlot(grid: Grid, r: number, col: number): MercSlot {
  const mercRaw = rawCell(grid, r, col + 3);
  const itemsRaw = rawCell(grid, r, col + 4);
  if (mercRaw.trim() === SAME_AS_OFFENSIVE) {
    return { mercTypes: [], items: [], sameAsOffensive: true };
  }
  return {
    mercTypes: splitLines(mercRaw),
    items: splitLines(itemsRaw),
  };
}

function parseStarterSlot(grid: Grid, r: number, col: number): MercSlot {
  const mercRaw = rawCell(grid, r, col + 5);
  const itemsRaw = rawCell(grid, r, col + 6);
  const mercTrim = mercRaw.trim();
  const itemsTrim = itemsRaw.trim();
  if (mercTrim === NOT_APPLICABLE || itemsTrim === NOT_APPLICABLE) {
    return { mercTypes: [], items: [], notApplicable: true };
  }
  if (!mercTrim && !itemsTrim) {
    return { mercTypes: [], items: [], notApplicable: true };
  }
  return {
    mercTypes: splitLines(mercRaw),
    items: splitLines(itemsRaw),
  };
}

const PRIORITY_BULLET_REGEX = /^\d+\.\s/;
const NOTE_MARKER_REGEX = /^\*{2,}/;

function groupPriorityLines(lines: string[]): string[] {
  const grouped: string[] = [];
  for (const line of lines) {
    const isNewBullet = PRIORITY_BULLET_REGEX.test(line) || NOTE_MARKER_REGEX.test(line);
    if (isNewBullet || grouped.length === 0) {
      grouped.push(line);
    } else {
      grouped[grouped.length - 1] = `${grouped[grouped.length - 1]} ${line}`;
    }
  }
  return grouped;
}

function normalizeAct(value: string): MercActLabel | null {
  const match = ACT_LABEL_REGEX.exec(value);
  if (!match) return null;
  return `Act ${match[1]}` as MercActLabel;
}

export function parseMercGuide(csv: string): MercGuideData {
  const parsed = Papa.parse<string[]>(csv, {
    skipEmptyLines: false,
    dynamicTyping: false,
  });
  const grid = parsed.data.filter(Array.isArray) as Grid;

  const anchor = findAnchor(grid, HEADER_BUILDS_ANCHOR);
  if (!anchor) {
    return { builds: [], priorities: [], fetchedAt: Date.now() };
  }
  const col = anchor.col;

  const builds: MercBuildRow[] = [];
  const priorities: ActPriority[] = [];
  let blankRun = 0;

  for (let r = anchor.row + 1; r < grid.length; r++) {
    const name = trimCell(grid, r, col);
    const actCell = trimCell(grid, r, col + 7);

    if (!name && !actCell) {
      blankRun++;
      if (blankRun >= 2 && builds.length > 0) break;
      continue;
    }
    blankRun = 0;

    if (name) {
      builds.push({
        name,
        offensive: parseOffensiveSlot(grid, r, col),
        defensive: parseDefensiveSlot(grid, r, col),
        starter: parseStarterSlot(grid, r, col),
      });
    }

    const act = normalizeAct(actCell);
    if (act) {
      priorities.push({
        act,
        lines: groupPriorityLines(splitLines(rawCell(grid, r, col + 8))),
      });
    }
  }

  return {
    builds,
    priorities,
    fetchedAt: Date.now(),
  };
}
