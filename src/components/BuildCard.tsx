import { Link } from "react-router-dom";
import type { Build } from "../data/types";
import { ClassBadge, classColor } from "./ClassBadge";
import { DensityBadge } from "./DensityBadge";
import { PinButton } from "./PinButton";
import { SeasonPill } from "./SeasonPill";
import { seasonById } from "../data/seasons";

function handicapLabel(h: number): string | null {
  if (!h) return null;
  const thirds = Math.round(h * 3);
  if (thirds === 0) return null;
  const sign = thirds > 0 ? "+" : "";
  return `${sign}${thirds}/3`;
}

export function BuildCard({ build }: { build: Build }) {
  const handicap = handicapLabel(build.handicap);
  const nameColor = build.season
    ? seasonById(build.season)?.displayColor
    : undefined;
  return (
    <Link
      to={`/build/${build.id}`}
      className="group relative panel p-2 pl-2.5 flex items-center gap-2 min-w-[180px] hover:panel-hi transition-colors"
      style={{ borderLeftWidth: 3, borderLeftColor: classColor(build.className) }}
    >
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium truncate leading-tight"
          style={{ color: nameColor ?? "#f5f5f4" }}
          title={
            build.season
              ? `Tested in ${build.season}`
              : "Season not recorded"
          }
        >
          {build.displayName}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <ClassBadge cls={build.className} />
          {handicap && (
            <span
              className="text-[10px] font-mono px-1.5 rounded-sm"
              style={{
                color: build.handicap > 0 ? "#f1d37a" : "#cc7777",
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid currentColor",
              }}
              title={`Tier handicap: ${handicap} tier(s)`}
            >
              H{handicap}
            </span>
          )}
          <DensityBadge
            profile={build.densityProfile}
            stdDev={build.normStdDev}
            variant="dot"
          />
          <SeasonPill season={build.season} size="xs" />
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-mono text-d2-gold">
          {Math.round(build.avgNormalizedMpm)}
        </div>
        <div className="text-[10px] text-stone-500">mpm/d</div>
      </div>
      <div className="shrink-0">
        <PinButton buildId={build.id} />
      </div>
    </Link>
  );
}
