import type { Tier } from "../../data/types";
import { tierColorVar } from "../../data/tiering";

interface Props {
  tier: Tier | null;
  size?: "sm" | "md";
}

export function TierBadge({ tier, size = "sm" }: Props) {
  if (!tier) {
    return <span className="text-stone-600 text-xs">—</span>;
  }
  const color = tierColorVar(tier);
  const padding = size === "md" ? "px-2 py-0.5 text-sm" : "px-1.5 py-0.5 text-xs";
  return (
    <span
      className={`${padding} rounded-sm font-display font-bold inline-block leading-none border`}
      style={{
        color: "#0a0805",
        backgroundColor: color,
        borderColor: color,
        textShadow: "0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      {tier}
    </span>
  );
}
