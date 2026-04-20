import { CLASSES, type ClassName } from "../data/types";
import { useFilters, type RetestedFilter } from "../store/filters";
import { classColor } from "./ClassBadge";

export function FilterBar({ total, visible }: { total: number; visible: number }) {
  const {
    classFilter,
    search,
    applyHandicap,
    retestedFilter,
    setClassFilter,
    setSearch,
    setApplyHandicap,
    setRetestedFilter,
  } = useFilters();

  const classes: (ClassName | "All")[] = ["All", ...CLASSES];
  const retestedOpts: { k: RetestedFilter; label: string; title: string }[] = [
    { k: "all", label: "All", title: "Show every build" },
    {
      k: "retested",
      label: "RT'd",
      title: "Retested after closed-beta patch notes",
    },
    {
      k: "not-retested",
      label: "Not RT'd",
      title: "Not retested — may reflect older beta data",
    },
  ];

  return (
    <div className="panel p-3 mb-5 sticky top-[62px] z-30 backdrop-blur-sm bg-panel/95">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {classes.map((c) => {
            const active = classFilter === c;
            const color = c === "All" ? "#d4af37" : classColor(c as ClassName);
            return (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className="px-3 py-1 text-xs uppercase tracking-wider font-mono rounded-sm border transition-all"
                style={{
                  color: active ? "#0a0805" : color,
                  borderColor: color,
                  backgroundColor: active ? color : "rgba(0,0,0,0.3)",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        <input
          type="search"
          placeholder="Search build…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="panel-hi px-3 py-1 text-sm rounded-sm outline-none focus:border-d2-gold placeholder:text-stone-600 text-stone-100 min-w-[180px] flex-1 sm:flex-none sm:w-[240px]"
        />
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 mr-1">
            Tested
          </span>
          {retestedOpts.map((o) => {
            const active = retestedFilter === o.k;
            return (
              <button
                key={o.k}
                onClick={() => setRetestedFilter(o.k)}
                title={o.title}
                className="px-2 py-1 text-[11px] uppercase tracking-wider font-mono rounded-sm border transition-colors"
                style={{
                  color: active ? "#0a0805" : "#9acd32",
                  backgroundColor: active ? "#9acd32" : "rgba(0,0,0,0.3)",
                  borderColor: "#7bb661",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer select-none ml-auto">
          <input
            type="checkbox"
            checked={applyHandicap}
            onChange={(e) => setApplyHandicap(e.target.checked)}
            className="accent-d2-gold"
          />
          <span>
            Apply handicap
            <span className="text-stone-600 ml-1">
              ({applyHandicap ? "Dark Humility's tier" : "raw data"})
            </span>
          </span>
        </label>
        <div className="text-xs text-stone-500 font-mono shrink-0">
          {visible}/{total}
        </div>
      </div>
    </div>
  );
}
