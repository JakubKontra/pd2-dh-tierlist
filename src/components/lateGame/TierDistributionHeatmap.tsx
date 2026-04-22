import { useMemo } from "react";
import { TIERS, type Tier } from "../../data/types";
import { tierColorVar } from "../../data/tiering";
import { classColor } from "../ClassBadge";
import { ClassIcon } from "../ClassIcon";
import type { ClassTable } from "../../data/lateGame/types";
import { CLASSES_IN_SHEET } from "../../data/lateGame/anchors";

interface Props {
  tables: ClassTable[];
}

export function TierDistributionHeatmap({ tables }: Props) {
  const { matrix, maxCount, classTotals, tierTotals, grandTotal } = useMemo(() => {
    const matrix = new Map<string, number>();
    const classTotals = new Map<string, number>();
    const tierTotals = new Map<Tier, number>();
    let maxCount = 0;
    let grandTotal = 0;

    for (const t of tables) {
      let classSum = 0;
      for (const row of t.rows) {
        if (row.kind !== "build" || !row.tier) continue;
        const key = `${t.className}|${row.tier}`;
        const next = (matrix.get(key) ?? 0) + 1;
        matrix.set(key, next);
        if (next > maxCount) maxCount = next;
        classSum++;
        tierTotals.set(row.tier, (tierTotals.get(row.tier) ?? 0) + 1);
        grandTotal++;
      }
      classTotals.set(t.className, classSum);
    }
    return { matrix, maxCount, classTotals, tierTotals, grandTotal };
  }, [tables]);

  const cellFor = (cls: string, tier: Tier) => matrix.get(`${cls}|${tier}`) ?? 0;

  return (
    <section className="panel p-4">
      <h4 className="font-display text-base uppercase tracking-wider text-d2-gold mb-3">
        Tier distribution by class
      </h4>
      <p className="text-xs text-stone-500 mb-3">
        Build count in each tier per class. Cell intensity scales with count.{" "}
        <span className="text-stone-400">{grandTotal}</span> builds total across 7 classes.
      </p>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="border-separate border-spacing-[2px] text-xs">
          <thead>
            <tr>
              <th className="w-28 text-left pl-1 text-[10px] uppercase tracking-widest text-stone-500 font-normal">
                Class
              </th>
              {TIERS.map((tier) => (
                <th
                  key={tier}
                  className="w-9 text-center font-display font-bold"
                  style={{
                    color: "#0a0805",
                    backgroundColor: tierColorVar(tier),
                    padding: "2px 0",
                    borderRadius: 2,
                  }}
                >
                  {tier}
                </th>
              ))}
              <th className="w-12 text-center text-[10px] uppercase tracking-widest text-stone-500 font-normal pl-2">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {CLASSES_IN_SHEET.map((cls) => {
              const color = classColor(cls);
              const total = classTotals.get(cls) ?? 0;
              return (
                <tr key={cls}>
                  <td className="pl-1 pr-2">
                    <span className="flex items-center gap-1.5" style={{ color }}>
                      <ClassIcon cls={cls} size={12} color={color} />
                      <span className="font-semibold text-[11px]">{cls}</span>
                    </span>
                  </td>
                  {TIERS.map((tier) => {
                    const count = cellFor(cls, tier);
                    const intensity = count === 0 ? 0 : 0.15 + 0.85 * (count / maxCount);
                    const tierColor = tierColorVar(tier);
                    return (
                      <td
                        key={tier}
                        className="w-9 h-7 text-center rounded-sm"
                        title={`${cls} · ${tier}: ${count} build${count === 1 ? "" : "s"}`}
                        style={{
                          backgroundColor:
                            count === 0 ? "rgba(255,255,255,0.02)" : tierColor,
                          opacity: count === 0 ? 0.4 : intensity,
                          color: count === 0 ? "#3a2e20" : "#0a0805",
                          fontWeight: count > 0 ? 700 : 400,
                          border: `1px solid ${count === 0 ? "var(--color-border)" : tierColor}`,
                        }}
                      >
                        {count > 0 ? count : ""}
                      </td>
                    );
                  })}
                  <td
                    className="w-12 text-center pl-2 font-mono font-bold"
                    style={{ color }}
                  >
                    {total}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="pl-1 pr-2 pt-2 text-[10px] uppercase tracking-widest text-stone-500">
                Total
              </td>
              {TIERS.map((tier) => {
                const total = tierTotals.get(tier) ?? 0;
                return (
                  <td
                    key={tier}
                    className="w-9 text-center pt-2 font-mono text-stone-400"
                  >
                    {total || ""}
                  </td>
                );
              })}
              <td className="w-12 text-center pl-2 pt-2 font-mono text-d2-gold font-bold">
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-stone-500 mt-3">
        Columns are tier letters (left = strongest). Numbers are build counts. Darker cells = more builds in that tier for that class.
      </p>
    </section>
  );
}
