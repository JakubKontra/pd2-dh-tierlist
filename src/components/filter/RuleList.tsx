import { useFilterStore } from "../../store/filter";
import { serializeRule } from "../../filter/serializer";

export function RuleList() {
  const rules = useFilterStore((s) => s.file.rules);
  const selectedRuleId = useFilterStore((s) => s.selectedRuleId);
  const selectRule = useFilterStore((s) => s.selectRule);
  const addRule = useFilterStore((s) => s.addRule);
  const deleteRule = useFilterStore((s) => s.deleteRule);
  const moveRule = useFilterStore((s) => s.moveRule);
  const toggleRuleEnabled = useFilterStore((s) => s.toggleRuleEnabled);

  return (
    <div className="panel flex flex-col h-[70vh] min-h-[400px]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="heading-gold text-sm uppercase tracking-widest">Rules</h3>
        <button
          onClick={() => addRule()}
          className="px-2 py-0.5 text-xs border border-border hover:border-d2-gold transition-colors"
        >
          + Add
        </button>
      </div>
      <ol className="flex-1 overflow-y-auto scrollbar-thin">
        {rules.length === 0 && (
          <li className="p-4 text-xs text-stone-500 italic">No rules yet. Click + Add to create one, or paste a filter via the Text / Import tabs.</li>
        )}
        {rules.map((r, i) => {
          const text = serializeRule(r);
          const isSel = selectedRuleId === r.id;
          return (
            <li
              key={r.id}
              onClick={() => selectRule(r.id)}
              className={`group px-2 py-2 border-b border-border/40 cursor-pointer flex items-start gap-2 text-xs ${
                isSel ? "bg-panel-hi" : "hover:bg-panel-hi/40"
              } ${r.enabled ? "" : "opacity-50"}`}
            >
              <span className="text-stone-600 tabular-nums w-8 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0 font-mono break-all text-d2-normal">
                {text.length > 180 ? text.slice(0, 180) + "…" : text}
              </div>
              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); moveRule(r.id, -1); }}
                  className="px-1 hover:text-d2-gold"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveRule(r.id, 1); }}
                  className="px-1 hover:text-d2-gold"
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleRuleEnabled(r.id); }}
                  className="text-[10px] px-1 border border-border hover:border-d2-gold"
                  title={r.enabled ? "Disable (comment out)" : "Enable"}
                >
                  {r.enabled ? "on" : "off"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this rule?")) deleteRule(r.id);
                  }}
                  className="text-[10px] px-1 border border-border hover:border-d2-red"
                  title="Delete rule"
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
