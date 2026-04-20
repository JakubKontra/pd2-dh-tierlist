import { Link } from "react-router-dom";
import type { Build } from "../data/types";
import { ClassBadge, classColor } from "./ClassBadge";
import { PinButton } from "./PinButton";

function handicapLabel(h: number): string | null {
  if (!h) return null;
  const thirds = Math.round(h * 3);
  if (thirds === 0) return null;
  const sign = thirds > 0 ? "+" : "";
  return `${sign}${thirds}/3`;
}

export function BuildCard({ build }: { build: Build }) {
  const handicap = handicapLabel(build.handicap);
  return (
    <Link
      to={`/build/${build.id}`}
      className="group relative panel p-2 pl-2.5 flex items-center gap-2 min-w-[180px] hover:panel-hi transition-colors"
      style={{ borderLeftWidth: 3, borderLeftColor: classColor(build.className) }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-stone-100 truncate leading-tight group-hover:text-d2-unique">
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
          {build.retested === true && (
            <span
              className="text-[10px] font-mono px-1 rounded-sm"
              style={{ color: "#7cb342", border: "1px solid #7cb342" }}
              title="Retested with closed-beta patch notes"
            >
              RT
            </span>
          )}
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
