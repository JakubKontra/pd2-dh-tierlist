import type { BossLineup as BossLineupT } from "../../data/lateGame/types";
import type { ClassLookup } from "../../data/lateGame/classLookup";
import { classColor } from "../ClassBadge";
import { ClassIcon } from "../ClassIcon";
import { SkillIcon } from "./SkillIcon";
import { SkillName } from "./SkillName";

export function BossLineup({ lineup, classOf }: { lineup: BossLineupT; classOf: ClassLookup }) {
  return (
    <section className="panel p-4">
      <h4 className="font-display text-base uppercase tracking-wider text-d2-gold mb-3">
        {lineup.title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {lineup.groups.map((g, gi) => {
          const color = classColor(g.className);
          return (
            <div key={gi} className="min-w-0">
              <header className="flex items-center gap-2 mb-1.5 pb-1 border-b" style={{ borderColor: `${color}55` }}>
                <ClassIcon cls={g.className} size={14} color={color} />
                <span
                  className="text-xs uppercase tracking-wider font-semibold"
                  style={{ color }}
                >
                  {g.className === "Unknown" ? "Top 10" : g.className}
                </span>
              </header>
              <ol className="space-y-0.5 text-xs">
                {g.entries.map((e, ei) => {
                  const entryClass = g.className === "Unknown" ? classOf(e.name) : g.className;
                  return (
                    <li key={ei} className="flex items-center gap-1.5 py-0.5 min-w-0">
                      <span className="text-stone-500 font-mono w-6 shrink-0 text-right">{e.rank}</span>
                      <SkillIcon buildName={e.name} size={14} />
                      <SkillName name={e.name} cls={entryClass} className="truncate" />
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
