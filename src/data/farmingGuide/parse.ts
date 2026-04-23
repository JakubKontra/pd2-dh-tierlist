import Papa from "papaparse";
import type { ClassName } from "../types";
import {
  CLASS_HEADER_REGEX,
  FARMING_AREAS_ANCHOR,
  FARMING_KEY_ANCHOR,
  LEGEND_HEADING_REGEX,
  PROGRESSION_HEADING_REGEX,
  SOLO_SELF_FOUND_ANCHOR,
  STARTER_BUILDS_ANCHOR,
} from "./anchors";
import {
  DAMAGE_ELEMENTS,
  type ActLabel,
  type ActSection,
  type ClassBuildGroup,
  type DamageElement,
  type Difficulty,
  type FarmingArea,
  type FarmingGuideData,
  type LegendEntry,
  type MagicFind,
  type Mobility,
  type ProgressionStep,
  type Rank,
  type StarterBuild,
} from "./types";

type Grid = string[][];

function trimCell(grid: Grid, r: number, c: number): string {
  const row = grid[r];
  if (!row) return "";
  return (row[c] ?? "").toString().trim();
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

function parseMobility(v: string): Mobility | null {
  return v === "Low" || v === "Medium" || v === "High" ? v : null;
}

function parseDifficulty(v: string): Difficulty | null {
  if (v === "Low" || v === "Medium" || v === "High" || v === "Very High" || v === "Depends") {
    return v;
  }
  return null;
}

function parseMagicFind(v: string): MagicFind | null {
  return v === "Yes" || v === "No" || v === "Sorta" ? v : null;
}

function parseRank(v: string): Rank | null {
  const n = parseInt(v, 10);
  return n === 1 || n === 2 || n === 3 ? (n as Rank) : null;
}

function parseDamageTypes(v: string): DamageElement[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is DamageElement =>
      (DAMAGE_ELEMENTS as readonly string[]).includes(s)
    );
}

function parseStarterBuilds(grid: Grid): ClassBuildGroup[] {
  const anchor = findAnchor(grid, STARTER_BUILDS_ANCHOR);
  if (!anchor) return [];
  const col = anchor.col;
  const damageCol = col + 2;

  const groups: ClassBuildGroup[] = [];
  let current: ClassBuildGroup | null = null;
  let blankRun = 0;

  for (let r = anchor.row + 1; r < grid.length; r++) {
    const name = trimCell(grid, r, col);
    const dmg = trimCell(grid, r, damageCol);

    if (!name && !dmg) {
      blankRun++;
      if (blankRun >= 2) break;
      continue;
    }
    blankRun = 0;

    const classMatch = CLASS_HEADER_REGEX.exec(name);
    if (classMatch) {
      if (current) groups.push(current);
      current = {
        className: classMatch[1] as ClassName,
        mobility: classMatch[2] as Mobility,
        builds: [],
      };
      continue;
    }

    if (!current) continue;
    if (!name) continue;

    const build: StarterBuild = {
      name,
      damageTypes: dmg
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    current.builds.push(build);
  }
  if (current) groups.push(current);
  return groups;
}

function parseFarmingAreas(grid: Grid): ActSection[] {
  const anchor = findAnchor(grid, FARMING_AREAS_ANCHOR);
  if (!anchor) return [];
  const col = anchor.col;

  const sections: ActSection[] = [];
  let current: ActSection | null = null;
  let blankRun = 0;

  for (let r = anchor.row + 1; r < grid.length; r++) {
    const name = trimCell(grid, r, col);

    if (!name) {
      blankRun++;
      if (blankRun >= 3) break;
      continue;
    }
    blankRun = 0;

    // "Act N" repeats in col+1 due to merged-cell rendering — pure section break.
    if (/^Act \d$/.test(name) && trimCell(grid, r, col + 1) === name) {
      if (current) sections.push(current);
      current = { act: name as ActLabel, areas: [] };
      continue;
    }

    // "UBERS" starts a new section AND doubles as an area row with real metadata.
    if (name === "UBERS") {
      if (current) sections.push(current);
      current = { act: "UBERS", areas: [] };
      // fall through: the same row also holds the "Uber Tristram" area data
    }

    if (!current) continue;

    const area: FarmingArea = {
      name,
      difficulty: parseDifficulty(trimCell(grid, r, col + 1)),
      magicFind: parseMagicFind(trimCell(grid, r, col + 2)),
      itemType: trimCell(grid, r, col + 3),
      mobility: parseMobility(trimCell(grid, r, col + 4)),
      bestDamageTypes: parseDamageTypes(trimCell(grid, r, col + 5)),
      rank: parseRank(trimCell(grid, r, col + 6)),
    };
    current.areas.push(area);
  }
  if (current) sections.push(current);
  return sections;
}

function collectProseColumn(grid: Grid, col: number, startRow: number, endRow: number): string[] {
  const lines: string[] = [];
  for (let r = startRow; r < endRow; r++) {
    lines.push(trimCell(grid, r, col));
  }
  return lines;
}

function parseStepsFromLines(lines: string[]): ProgressionStep[] {
  const steps: ProgressionStep[] = [];
  let current: ProgressionStep | null = null;
  for (const line of lines) {
    if (!line) continue;
    const match = PROGRESSION_HEADING_REGEX.exec(line);
    if (match) {
      if (current) steps.push(current);
      const heading = match[1].replace(/\s+/g, " ").toUpperCase();
      const rest = line.slice(match[0].length).trim();
      current = { heading, body: rest ? [rest] : [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) steps.push(current);
  return steps;
}

function parseProgression(grid: Grid): ProgressionStep[] {
  const keyAnchor = findAnchor(grid, FARMING_KEY_ANCHOR);
  const endRow = keyAnchor ? keyAnchor.row : grid.length;
  const lines = collectProseColumn(grid, 0, 0, endRow);
  return parseStepsFromLines(lines);
}

function parseLegend(grid: Grid): LegendEntry[] {
  const keyAnchor = findAnchor(grid, FARMING_KEY_ANCHOR);
  if (!keyAnchor) return [];
  const soloAnchor = findAnchor(grid, SOLO_SELF_FOUND_ANCHOR);
  const endRow = soloAnchor ? soloAnchor.row : grid.length;

  const entries: LegendEntry[] = [];
  let current: LegendEntry | null = null;

  for (let r = keyAnchor.row + 1; r < endRow; r++) {
    const raw = trimCell(grid, r, 0);
    if (!raw) continue;

    const headingMatch = LEGEND_HEADING_REGEX.exec(raw);
    if (headingMatch) {
      if (current) entries.push(current);
      const title = headingMatch[1].trim();
      const firstLine = headingMatch[2].replace(/\*+$/, "").trim();
      current = { title, lines: firstLine ? [firstLine] : [] };
      continue;
    }

    if (/^Note:/i.test(raw)) {
      if (current) entries.push(current);
      current = { title: "Note", lines: [raw.replace(/^Note:\s*/i, "")] };
      continue;
    }

    if (current) {
      current.lines.push(raw.replace(/\*+$/, "").trim());
    }
  }
  if (current) entries.push(current);
  return entries;
}

function parseSoloSelfFound(grid: Grid): ProgressionStep[] {
  const anchor = findAnchor(grid, SOLO_SELF_FOUND_ANCHOR);
  if (!anchor) return [];
  const lines = collectProseColumn(grid, 0, anchor.row + 1, grid.length);
  return parseStepsFromLines(lines);
}

export function parseFarmingGuide(csv: string): FarmingGuideData {
  const parsed = Papa.parse<string[]>(csv, {
    skipEmptyLines: false,
    dynamicTyping: false,
  });
  const grid = parsed.data.filter(Array.isArray) as Grid;

  return {
    progression: parseProgression(grid),
    builds: parseStarterBuilds(grid),
    acts: parseFarmingAreas(grid),
    legend: parseLegend(grid),
    soloSelfFound: parseSoloSelfFound(grid),
    fetchedAt: Date.now(),
  };
}
