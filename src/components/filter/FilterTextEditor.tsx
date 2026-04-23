import { useMemo } from "react";
import { useFilterStore } from "../../store/filter";

export function FilterTextEditor() {
  const rawText = useFilterStore((s) => s.rawText);
  const setRawText = useFilterStore((s) => s.setRawText);
  const diagnostics = useFilterStore((s) => s.diagnostics);

  const errorLines = useMemo(() => {
    const set = new Set<number>();
    for (const d of diagnostics) if (d.severity === "error") set.add(d.line);
    return set;
  }, [diagnostics]);

  const warningLines = useMemo(() => {
    const set = new Set<number>();
    for (const d of diagnostics) if (d.severity === "warning") set.add(d.line);
    return set;
  }, [diagnostics]);

  const lineCount = Math.max(rawText.split("\n").length, 1);
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="panel p-0 overflow-hidden flex flex-col h-[70vh] min-h-[400px]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border text-xs text-stone-400">
        <span>Filter text</span>
        <span>{rawText.length.toLocaleString()} chars</span>
      </div>
      <div className="flex-1 flex overflow-auto font-mono text-sm scrollbar-thin">
        <ol
          className="shrink-0 py-2 pl-2 pr-2 text-right text-stone-600 select-none border-r border-border bg-panel-hi"
          style={{ minWidth: "3rem" }}
        >
          {lines.map((n) => (
            <li
              key={n}
              className={
                errorLines.has(n)
                  ? "text-d2-red"
                  : warningLines.has(n)
                  ? "text-d2-rare"
                  : ""
              }
              style={{ lineHeight: "1.5rem" }}
              title={
                errorLines.has(n)
                  ? diagnostics.filter((d) => d.line === n && d.severity === "error").map((d) => d.message).join("; ")
                  : warningLines.has(n)
                  ? diagnostics.filter((d) => d.line === n && d.severity === "warning").map((d) => d.message).join("; ")
                  : undefined
              }
            >
              {n}
            </li>
          ))}
        </ol>
        <textarea
          spellCheck={false}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`// Paste or write a PD2 loot filter here.\nItemDisplay[]: %NAME%`}
          className="flex-1 resize-none bg-transparent outline-none py-2 pl-3 pr-3 text-d2-normal caret-d2-gold"
          style={{ lineHeight: "1.5rem", tabSize: 4 }}
        />
      </div>
    </div>
  );
}
