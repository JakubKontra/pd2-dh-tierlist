import type { ClassName, Tier } from "../types";

export type Flag = "strong" | "good" | "ok" | "none" | "empty";

export interface BuildRow {
  kind: "build";
  name: string;
  tier: Tier | null;
  fortify: Flag;
  budget: Flag;
  hardcore: Flag;
  t1t2: Flag;
}

export interface SubTreeRow {
  kind: "subtree";
  name: string;
}

export type ClassTableRow = BuildRow | SubTreeRow;

export interface ClassTable {
  className: ClassName;
  rows: ClassTableRow[];
}

export interface RankedEntry {
  rank: string;
  name: string;
  tier: Tier | null;
}

export interface RankedList {
  title: string;
  entries: RankedEntry[];
}

export interface ClassGroup {
  className: ClassName;
  entries: RankedEntry[];
}

export interface BossLineup {
  title: string;
  groups: ClassGroup[];
}

export interface Mover {
  rank: string;
  name: string;
  from: Tier | null;
  to: Tier | null;
}

export interface MoversSection {
  title: string;
  entries: Mover[];
}

export interface NewOnSeason {
  title: string;
  entries: RankedEntry[];
}

export type MapImmunityFlag = "yes" | "no";

export interface MapRow {
  name: string;
  fire: MapImmunityFlag;
  cold: MapImmunityFlag;
  lightning: MapImmunityFlag;
  poison: MapImmunityFlag;
  physical: MapImmunityFlag;
  magic: MapImmunityFlag;
}

export interface MapTier {
  label: string;
  maps: MapRow[];
}

export interface MapImmunities {
  tiers: MapTier[];
  footnote: string | null;
}

export interface LateGameData {
  legend: string[];
  classTables: ClassTable[];
  rankings: RankedList[];
  bossLineups: BossLineup[];
  movers: MoversSection | null;
  newOnSeason: NewOnSeason | null;
  mapImmunities: MapImmunities;
  fetchedAt: number;
}
