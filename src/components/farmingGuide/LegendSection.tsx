import type { LegendEntry } from "../../data/farmingGuide/types";

export function LegendSection({ entries }: { entries: LegendEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {entries.map((e) => (
        <div key={e.title} className="panel p-3">
          <h4 className="font-display text-sm uppercase tracking-wider text-d2-unique mb-1.5 pb-1 border-b border-border/60">
            {e.title}
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line">
            {e.lines.join("\n")}
          </p>
        </div>
      ))}
    </div>
  );
}
