import type { ProgressionStep } from "../../data/farmingGuide/types";

export function ProgressionSteps({ steps }: { steps: ProgressionStep[] }) {
  if (steps.length === 0) return null;
  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {steps.map((s) => (
        <li key={s.heading} className="panel p-3">
          <h4 className="font-display text-sm uppercase tracking-widest text-d2-gold mb-1.5 pb-1 border-b border-border/60">
            {s.heading}
          </h4>
          <p className="text-xs leading-relaxed text-stone-300 whitespace-pre-line">
            {s.body.join("\n")}
          </p>
        </li>
      ))}
    </ol>
  );
}
