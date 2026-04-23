import type { ActPriority } from "../../data/mercGuide/types";

export function StatPriorityGrid({ priorities }: { priorities: ActPriority[] }) {
  if (priorities.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {priorities.map((p) => (
        <section key={p.act} className="panel p-3">
          <h4 className="font-display text-sm uppercase tracking-wider text-d2-gold mb-2 pb-1 border-b border-border/60">
            {p.act}
          </h4>
          <ul className="space-y-1 text-xs text-stone-300 leading-relaxed">
            {p.lines.map((line, i) => (
              <li key={i} className="whitespace-pre-line">
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
