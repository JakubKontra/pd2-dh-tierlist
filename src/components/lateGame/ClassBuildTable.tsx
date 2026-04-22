import type { ClassTable } from "../../data/lateGame/types";
import { classColor } from "../ClassBadge";
import { ClassIcon } from "../ClassIcon";
import { FlagCell } from "./FlagCell";
import { SkillIcon } from "./SkillIcon";
import { SkillName } from "./SkillName";
import { TierBadge } from "./TierBadge";

export function ClassBuildTable({ table }: { table: ClassTable }) {
  const color = classColor(table.className);
  return (
    <section className="panel overflow-hidden">
      <header
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: `${color}55` }}
      >
        <img
          src={`/icons/classes/${table.className}.webp`}
          width={40}
          height={40}
          alt=""
          aria-hidden
          className="shrink-0 rounded-sm"
        />
        <h3
          className="font-display text-2xl uppercase tracking-wider"
          style={{ color }}
        >
          {table.className}
        </h3>
        <span className="ml-auto text-xs text-stone-500 font-mono">
          {table.rows.filter((r) => r.kind === "build").length} builds
        </span>
      </header>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm border-separate border-spacing-0 min-w-[560px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-stone-500">
              <th className="text-left font-normal py-1.5 px-3">Build</th>
              <th className="text-center font-normal py-1.5 px-2">Tier</th>
              <th className="text-center font-normal py-1.5 px-2">Fortify</th>
              <th className="text-center font-normal py-1.5 px-2">Budget</th>
              <th className="text-center font-normal py-1.5 px-2">HC</th>
              <th className="text-center font-normal py-1.5 px-2">T1-T2</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => {
              if (r.kind === "subtree") {
                return (
                  <tr key={i}>
                    <td
                      colSpan={6}
                      className="py-1.5 px-3 text-[11px] uppercase tracking-widest font-semibold text-d2-unique border-t border-b border-border/60 bg-panel-hi/40"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ClassIcon cls={table.className} size={12} color={color} />
                        {r.name}
                      </span>
                    </td>
                  </tr>
                );
              }
              return (
                <tr
                  key={i}
                  className="hover:bg-panel-hi/60 transition-colors"
                >
                  <td className="py-1.5 px-3 flex items-center gap-2">
                    <SkillIcon buildName={r.name} />
                    <SkillName name={r.name} cls={table.className} />
                  </td>
                  <td className="text-center px-2">
                    <TierBadge tier={r.tier} />
                  </td>
                  <td className="text-center px-2">
                    <FlagCell value={r.fortify} />
                  </td>
                  <td className="text-center px-2">
                    <FlagCell value={r.budget} />
                  </td>
                  <td className="text-center px-2">
                    <FlagCell value={r.hardcore} />
                  </td>
                  <td className="text-center px-2">
                    <FlagCell value={r.t1t2} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
