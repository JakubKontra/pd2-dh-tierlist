import { SEASONS } from "../data/seasons";

export function SeasonLegend({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
        <span className="text-stone-500 uppercase tracking-wider">
          Season key:
        </span>
        {SEASONS.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1"
            title={`${s.name} — sheet font: ${s.sheetFontColor}. ${s.note}`}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full border border-black/40"
              style={{ backgroundColor: s.displayColor }}
            />
            <span className="text-stone-300">{s.id}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="panel p-4">
      <h3 className="text-sm uppercase tracking-widest text-d2-unique mb-1">
        Season legend
      </h3>
      <p className="text-xs text-stone-500 mb-3">
        Dark Humility colors each row in the source sheet by the season the
        build was tested in. The CSV export we pull doesn't include font
        colors, so per-row season tagging isn't automatic yet — use this
        legend as a reference when cross-referencing the sheet directly.
      </p>
      <ul className="space-y-2">
        {SEASONS.map((s) => (
          <li key={s.id} className="flex items-start gap-3">
            <span
              className="inline-block w-4 h-4 mt-0.5 rounded-sm border border-black/40 shrink-0"
              style={{ backgroundColor: s.displayColor }}
              aria-hidden
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="font-display text-sm"
                  style={{ color: s.displayColor }}
                >
                  {s.id}
                </span>
                <span className="text-stone-200 text-sm">{s.name}</span>
                <span className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">
                  sheet font: {s.sheetFontColor}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{s.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
