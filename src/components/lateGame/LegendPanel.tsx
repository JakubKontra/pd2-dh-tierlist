import { useState } from "react";

interface Props {
  lines: string[];
}

// The first 6 lines are tier letter definitions (S…F)
// Subsequent lines are field descriptions keyed to Fortify / Budget / HC / T1-T2
// We keep the ordering from column A, but wrap to 2 columns for readability.
export function LegendPanel({ lines }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="panel mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg text-d2-gold uppercase tracking-widest">
          Legend / Key
        </span>
        <span className="text-stone-500 text-xs font-mono">
          {open ? "[collapse]" : "[expand]"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-stone-300">
          {lines.map((line, i) => (
            <p key={i} className="leading-snug">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
