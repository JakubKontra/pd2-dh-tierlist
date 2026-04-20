import type { Season } from "../data/types";
import { seasonById } from "../data/seasons";

interface Props {
  season: Season | null;
  size?: "xs" | "sm" | "md";
}

export function SeasonPill({ season, size = "xs" }: Props) {
  if (!season) return null;
  const meta = seasonById(season);
  if (!meta) return null;

  const cls =
    size === "md"
      ? "px-2 py-0.5 text-xs gap-1.5"
      : size === "sm"
        ? "px-1.5 py-0.5 text-[11px] gap-1"
        : "px-1 py-px text-[9px] gap-1";

  return (
    <span
      className={`${cls} font-mono uppercase tracking-wider rounded-sm border inline-flex items-center shrink-0`}
      style={{ color: meta.displayColor, borderColor: meta.displayColor }}
      title={`Tested in ${meta.name} (sheet font: ${meta.sheetFontColor})`}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.displayColor }}
      />
      {meta.id}
    </span>
  );
}
