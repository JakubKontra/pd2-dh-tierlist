import type { ClassName } from "../types";

export const STARTER_BUILDS_ANCHOR = "Recommended Starter Builds";
export const FARMING_AREAS_ANCHOR = "Best LOD Farming Areas";
export const FARMING_KEY_ANCHOR = "Farming Guide Key";
export const SOLO_SELF_FOUND_ANCHOR = "Solo Self-Found Progression";

export const CLASSES_IN_SHEET: ClassName[] = [
  "Sorceress",
  "Druid",
  "Assassin",
  "Barbarian",
  "Amazon",
  "Necromancer",
  "Paladin",
];

export const CLASS_HEADER_REGEX =
  /^(Sorceress|Druid|Assassin|Barbarian|Amazon|Necromancer|Paladin)(?:\s*\([^)]+\))?\s*-\s*Mobility Class:\s*(Low|Medium|High)\s*$/;

export const PROGRESSION_HEADING_REGEX =
  /^(STEP\s+\d+|Bonus(?:\s+#\d+)?|CONSIDER)\s*:/i;

export const LEGEND_HEADING_REGEX = /^\*\*\*\s*([^-]+?)\s*-\s*(.*)$/;

export const ACTS = [
  "Act 1",
  "Act 2",
  "Act 3",
  "Act 4",
  "Act 5",
  "UBERS",
] as const;
