import { CLASSES, type ClassName } from "../data/types";
import { useFilters, type RetestedFilter } from "../store/filters";
import { classColor } from "./ClassBadge";
import { ClassIcon } from "./ClassIcon";

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
      label: "β-retest",
      title:
        "Flagged (RT'd) in the sheet: retested after closed-beta patch notes to verify specific nerf/buff changes.",
    },
    {
      k: "not-retested",
      label: "No β-retest",
      title:
        "Not tagged (RT'd). These are still S13 tests for tan-font builds; older-season carryovers (other font colors) are not distinguishable via the CSV export.",
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
                className="px-2.5 py-1 text-xs uppercase tracking-wider font-mono rounded-sm border transition-all inline-flex items-center gap-1.5"
                style={{
                  color: active ? "#0a0805" : color,
                  borderColor: color,
                  backgroundColor: active ? color : "rgba(0,0,0,0.3)",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {c !== "All" && (
                  <ClassIcon
                    cls={c as ClassName}
                    size={13}
                    color={active ? "#0a0805" : undefined}
                  />
                )}
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
        <div
          className="flex items-center gap-1"
          title="Closed-beta retest status — whether the build was retested after closed-beta patch notes"
        >
          <span className="text-[10px] uppercase tracking-wider text-stone-500 mr-1">
            β-retest
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
