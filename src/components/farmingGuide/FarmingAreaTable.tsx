import type { ActSection, Difficulty, MagicFind, Mobility, Rank } from "../../data/farmingGuide/types";
import { DamageChip } from "./DamageChip";

const DIFFICULTY_BG: Record<Difficulty, string> = {
  Low: "#2e5f2e",
  Medium: "#8a7a2e",
  High: "#8a3a2e",
  "Very High": "#6b1a1a",
  Depends: "#5a4530",
};

const MF_COLOR: Record<MagicFind, string> = {
  Yes: "#7fd65a",
  Sorta: "#ffd84a",
  No: "#8b8378",
};

const MOBILITY_COLOR: Record<Mobility, string> = {
  High: "#7fd65a",
  Medium: "#ffd84a",
  Low: "#ff6a3a",
};

const RANK_COLOR: Record<Rank, string> = {
  1: "#2e7d32",
  2: "#fdd835",
  3: "#c62828",
};

function DifficultyCell({ value }: { value: Difficulty | null }) {
  if (!value) return <span className="text-stone-600">—</span>;
  return (
    <span
      className="inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm"
      style={{ backgroundColor: DIFFICULTY_BG[value], color: "#f0e6c8" }}
    >
      {value}
    </span>
  );
}

function MfCell({ value }: { value: MagicFind | null }) {
  if (!value) return <span className="text-stone-600">—</span>;
  return (
    <span
      className="inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm"
      style={{ color: MF_COLOR[value], border: `1px solid ${MF_COLOR[value]}` }}
    >
      {value}
    </span>
  );
}

function MobilityCell({ value }: { value: Mobility | null }) {
  if (!value) return <span className="text-stone-600">—</span>;
  return (
    <span
      className="inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm"
      style={{ color: MOBILITY_COLOR[value], border: `1px solid ${MOBILITY_COLOR[value]}` }}
    >
      {value}
    </span>
  );
}

function RankBadge({ value }: { value: Rank | null }) {
  if (!value) return <span className="text-stone-600">—</span>;
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-sm text-xs font-mono font-bold"
      style={{ backgroundColor: RANK_COLOR[value], color: value === 2 ? "#1f1a00" : "#f8f5ea" }}
      title={`Rank ${value}`}
    >
      {value}
    </span>
  );
}

export function FarmingAreaTable({ acts }: { acts: ActSection[] }) {
  if (acts.length === 0) return null;
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-[10px] uppercase tracking-widest text-d2-unique">
          <tr className="border-b border-border">
            <th className="text-left px-3 py-2">Area</th>
            <th className="text-left px-2 py-2">Difficulty</th>
            <th className="text-left px-2 py-2">MF</th>
            <th className="text-left px-2 py-2">Item Types</th>
            <th className="text-left px-2 py-2">Mobility</th>
            <th className="text-left px-2 py-2">Best Damage</th>
            <th className="text-center px-2 py-2">Rank</th>
          </tr>
        </thead>
        <tbody>
          {acts.flatMap((section) => [
            <tr key={`${section.act}-hdr`} className="bg-panel-hi">
              <td
                colSpan={7}
                className="px-3 py-1.5 font-display uppercase tracking-widest text-sm text-d2-gold border-y border-border"
              >
                {section.act}
              </td>
            </tr>,
            ...section.areas.map((a, i) => (
              <tr
                key={`${section.act}-${i}-${a.name}`}
                className="border-b border-border/40 hover:bg-panel-hi/40"
              >
                <td className="px-3 py-1.5 text-stone-200">{a.name}</td>
                <td className="px-2 py-1.5">
                  <DifficultyCell value={a.difficulty} />
                </td>
                <td className="px-2 py-1.5">
                  <MfCell value={a.magicFind} />
                </td>
                <td className="px-2 py-1.5 text-stone-300">{a.itemType || "—"}</td>
                <td className="px-2 py-1.5">
                  <MobilityCell value={a.mobility} />
                </td>
                <td className="px-2 py-1.5">
                  <span className="flex flex-wrap gap-1">
                    {a.bestDamageTypes.length > 0
                      ? a.bestDamageTypes.map((d) => <DamageChip key={d} label={d} />)
                      : <span className="text-stone-600">—</span>}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <RankBadge value={a.rank} />
                </td>
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  );
}
