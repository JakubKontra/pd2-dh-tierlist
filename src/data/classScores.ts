import type { ClassName } from "./types";

export interface ClassRoleScore {
  mapping: number;
  starter: number;
  bossing: number;
  total: number;
}

const TABLE: Record<Exclude<ClassName, "Unknown">, ClassRoleScore> = {
  Sorceress: { mapping: 1, starter: 7, bossing: 2, total: 10 },
  Druid: { mapping: 3, starter: 3, bossing: 5, total: 11 },
  Assassin: { mapping: 6, starter: 1, bossing: 4, total: 11 },
  Barbarian: { mapping: 2, starter: 4, bossing: 6, total: 12 },
  Amazon: { mapping: 5, starter: 2, bossing: 7, total: 14 },
  Necromancer: { mapping: 4, starter: 6, bossing: 1, total: 11 },
  Paladin: { mapping: 7, starter: 5, bossing: 3, total: 15 },
};

export function roleScoreFor(cls: ClassName): ClassRoleScore | null {
  if (cls === "Unknown") return null;
  return TABLE[cls];
}

export function allClassRoleScores(): { className: ClassName; score: ClassRoleScore }[] {
  return (Object.keys(TABLE) as Exclude<ClassName, "Unknown">[]).map((c) => ({
    className: c,
    score: TABLE[c],
  }));
}
