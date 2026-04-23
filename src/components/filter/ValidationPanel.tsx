import { useMemo } from "react";
import { useFilterStore } from "../../store/filter";

export function ValidationPanel() {
  const diagnostics = useFilterStore((s) => s.diagnostics);

  const sorted = useMemo(
    () =>
      [...diagnostics].sort((a, b) => {
        const rank = (s: string) => (s === "error" ? 0 : s === "warning" ? 1 : 2);
        return rank(a.severity) - rank(b.severity) || a.line - b.line;
      }),
    [diagnostics]
  );

  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const warningCount = diagnostics.filter((d) => d.severity === "warning").length;

  return (
    <aside className="panel p-3 h-[70vh] min-h-[400px] overflow-y-auto scrollbar-thin">
      <header className="flex items-baseline justify-between mb-2">
        <h3 className="heading-gold text-sm uppercase tracking-widest">Diagnostics</h3>
        <span className="text-xs text-stone-500">{diagnostics.length} total</span>
      </header>
      {diagnostics.length === 0 ? (
        <p className="text-xs text-stone-500 italic">No problems detected.</p>
      ) : (
        <>
          <p className="text-xs text-stone-500 mb-3">
            {errorCount > 0 && <span className="text-d2-red">{errorCount} error{errorCount === 1 ? "" : "s"}</span>}
            {errorCount > 0 && warningCount > 0 && " · "}
            {warningCount > 0 && <span className="text-d2-rare">{warningCount} warning{warningCount === 1 ? "" : "s"}</span>}
          </p>
          <ul className="space-y-2 text-xs">
            {sorted.slice(0, 200).map((d, i) => (
              <li key={i} className="leading-snug">
                <span
                  className={
                    d.severity === "error"
                      ? "text-d2-red"
                      : d.severity === "warning"
                      ? "text-d2-rare"
                      : "text-d2-magic"
                  }
                >
                  {d.severity.toUpperCase()}
                </span>{" "}
                <span className="text-stone-500">line {d.line}</span>
                {d.code && <span className="text-stone-600"> · {d.code}</span>}
                <div className="text-stone-300 break-words">{d.message}</div>
              </li>
            ))}
            {sorted.length > 200 && (
              <li className="text-stone-500 italic">(+ {sorted.length - 200} more not shown)</li>
            )}
          </ul>
        </>
      )}
    </aside>
  );
}
