import type { Build, Tier } from "../data/types";
import { tierColorVar } from "../data/tiering";
import { BuildCard } from "./BuildCard";

interface Props {
  tier: Tier;
  builds: Build[];
}

export function TierRow({ tier, builds }: Props) {
  const color = tierColorVar(tier);
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 items-stretch">
      <div
        className="flex items-center justify-center rounded-sm font-display text-3xl font-bold border"
        style={{
          color: "#0a0805",
          backgroundColor: color,
          borderColor: color,
          textShadow: "0 1px 0 rgba(255,255,255,0.3), 0 -1px 0 rgba(0,0,0,0.4)",
          boxShadow: `0 0 16px ${color}33, inset 0 0 8px rgba(0,0,0,0.4)`,
        }}
      >
        {tier}
      </div>
      <div
        className="panel p-2 min-h-[68px] flex flex-wrap gap-2 content-start"
        style={{ borderLeft: `3px solid ${color}55` }}
      >
        {builds.length === 0 ? (
          <div className="text-xs text-stone-600 italic self-center pl-2">
            no builds match current filters
          </div>
        ) : (
          builds.map((b) => <BuildCard key={b.id} build={b} />)
        )}
      </div>
    </div>
  );
}
