import type { ClassBuildGroup } from "../../data/farmingGuide/types";
import { ClassIcon } from "../ClassIcon";
import { classColor } from "../ClassBadge";
import { DamageChip } from "./DamageChip";

const MOBILITY_COLOR: Record<string, string> = {
  High: "#7fd65a",
  Medium: "#ffd84a",
  Low: "#ff6a3a",
};

export function StarterBuildsGrid({ groups }: { groups: ClassBuildGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groups.map((g) => (
        <section key={g.className} className="panel p-3">
          <header className="flex items-center gap-2 mb-2 pb-1.5 border-b border-border/60">
            <ClassIcon cls={g.className} size={18} />
            <h4
              className="font-display text-base uppercase tracking-wider"
              style={{ color: classColor(g.className) }}
            >
              {g.className}
            </h4>
            <span
              className="ml-auto text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-sm"
              style={{
                color: MOBILITY_COLOR[g.mobility],
                border: `1px solid ${MOBILITY_COLOR[g.mobility]}`,
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              Mobility {g.mobility}
            </span>
          </header>
          <ul className="space-y-1">
            {g.builds.map((b) => (
              <li
                key={b.name}
                className="grid items-center gap-2 py-0.5 text-xs"
                style={{ gridTemplateColumns: "1fr auto" }}
              >
                <span className="text-stone-200 truncate" title={b.name}>
                  {b.name}
                </span>
                <span className="flex gap-1 flex-wrap justify-end">
                  {b.damageTypes.map((d) => (
                    <DamageChip key={d} label={d} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
