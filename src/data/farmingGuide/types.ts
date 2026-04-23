import type { ClassName } from "../types";

export type Mobility = "Low" | "Medium" | "High";
export type Difficulty = "Low" | "Medium" | "High" | "Very High" | "Depends";
export type MagicFind = "Yes" | "No" | "Sorta";
export type Rank = 1 | 2 | 3;

export const DAMAGE_ELEMENTS = [
  "Fire",
  "Cold",
  "Lightning",
  "Poison",
  "Physical",
  "Magic",
  "Multi",
  "Any",
  "Find Item",
  "Depends",
] as const;
export type DamageElement = (typeof DAMAGE_ELEMENTS)[number];

export interface StarterBuild {
  name: string;
  damageTypes: string[];
}

export interface ClassBuildGroup {
  className: ClassName;
  mobility: Mobility;
  builds: StarterBuild[];
}

export type ActLabel =
  | "Act 1"
  | "Act 2"
  | "Act 3"
  | "Act 4"
  | "Act 5"
  | "UBERS";

export interface FarmingArea {
  name: string;
  difficulty: Difficulty | null;
  magicFind: MagicFind | null;
  itemType: string;
  mobility: Mobility | null;
  bestDamageTypes: DamageElement[];
  rank: Rank | null;
}

export interface ActSection {
  act: ActLabel;
  areas: FarmingArea[];
}

export interface ProgressionStep {
  heading: string;
  body: string[];
}

export interface LegendEntry {
  title: string;
  lines: string[];
}

export interface FarmingGuideData {
  progression: ProgressionStep[];
  builds: ClassBuildGroup[];
  acts: ActSection[];
  legend: LegendEntry[];
  soloSelfFound: ProgressionStep[];
  fetchedAt: number;
}
