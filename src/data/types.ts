export const TIERS = [
  "S+", "S", "S-",
  "A+", "A", "A-",
  "B+", "B", "B-",
  "C+", "C", "C-",
  "D+", "D", "D-",
  "F+", "F", "F-",
] as const;

export type Tier = (typeof TIERS)[number];

export const CLASSES = [
  "Amazon",
  "Assassin",
  "Barbarian",
  "Druid",
  "Necromancer",
  "Paladin",
  "Sorceress",
] as const;

export type ClassName = (typeof CLASSES)[number] | "Unknown";

export interface MapRun {
  name: string;
  fortified: boolean;
  doubleFortified: boolean;
  mpm: number;
  density: number;
  normalizedMpm: number;
}

export type DensityProfile = "consistent" | "neutral" | "density-dependent";

export type Season = "S13" | "S12" | "S11" | "S10";

export interface Build {
  id: string;
  rawName: string;
  displayName: string;
  className: ClassName;
  handicap: number;
  retested: boolean | null;
  season: Season | null;
  maps: MapRun[];
  avgMpm: number;
  avgNormalizedMpm: number;
  tierRaw: Tier;
  tierAdjusted: Tier;
  normStdDev: number;
  densityProfile: DensityProfile;
}

export interface TierCutoffs {
  topHalfInterval: number;
  bottomHalfInterval: number;
  median: number;
  max: number;
  min: number;
}

export interface Tierlist {
  builds: Build[];
  cutoffs: TierCutoffs;
  fetchedAt: number;
}
