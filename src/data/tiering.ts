import { TIERS, type Tier, type TierCutoffs } from "./types";

const TOP_HALF: Tier[] = ["S+", "S", "S-", "A+", "A", "A-", "B+", "B", "B-"];
const BOTTOM_HALF: Tier[] = ["C+", "C", "C-", "D+", "D", "D-", "F+", "F", "F-"];

export function deriveTier(
  avgNormalizedMpm: number,
  cutoffs: TierCutoffs
): Tier {
  const { median, topHalfInterval, bottomHalfInterval } = cutoffs;

  if (avgNormalizedMpm >= median) {
    const steps = Math.floor((avgNormalizedMpm - median) / topHalfInterval);
    const idx = Math.max(0, Math.min(TOP_HALF.length - 1, TOP_HALF.length - 1 - steps));
    return TOP_HALF[idx];
  } else {
    const steps = Math.floor((median - avgNormalizedMpm) / bottomHalfInterval);
    const idx = Math.max(0, Math.min(BOTTOM_HALF.length - 1, steps));
    return BOTTOM_HALF[idx];
  }
}

export function applyHandicap(tier: Tier, handicap: number): Tier {
  if (!handicap) return tier;
  const idx = TIERS.indexOf(tier);
  if (idx === -1) return tier;
  const subTierShift = Math.round(handicap * 3);
  const newIdx = Math.max(0, Math.min(TIERS.length - 1, idx - subTierShift));
  return TIERS[newIdx];
}

export function tierColorVar(tier: Tier): string {
  const map: Record<Tier, string> = {
    "S+": "var(--color-tier-splus)",
    S: "var(--color-tier-s)",
    "S-": "var(--color-tier-sminus)",
    "A+": "var(--color-tier-aplus)",
    A: "var(--color-tier-a)",
    "A-": "var(--color-tier-aminus)",
    "B+": "var(--color-tier-bplus)",
    B: "var(--color-tier-b)",
    "B-": "var(--color-tier-bminus)",
    "C+": "var(--color-tier-cplus)",
    C: "var(--color-tier-c)",
    "C-": "var(--color-tier-cminus)",
    "D+": "var(--color-tier-dplus)",
    D: "var(--color-tier-d)",
    "D-": "var(--color-tier-dminus)",
    "F+": "var(--color-tier-fplus)",
    F: "var(--color-tier-f)",
    "F-": "var(--color-tier-fminus)",
  };
  return map[tier];
}
