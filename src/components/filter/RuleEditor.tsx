import { useFilterStore } from "../../store/filter";
import { serializeRule } from "../../filter/serializer";
import { ConditionTreeEditor } from "./ConditionTreeEditor";
import { OutputEditor } from "./OutputEditor";

export function RuleEditor() {
  const rules = useFilterStore((s) => s.file.rules);
  const selectedRuleId = useFilterStore((s) => s.selectedRuleId);
  const updateRule = useFilterStore((s) => s.updateRule);

  const rule = rules.find((r) => r.id === selectedRuleId);

  if (!rule) {
    return (
      <div className="panel p-8 h-full flex items-center justify-center text-center text-stone-400 text-sm">
        <p>Select a rule on the left, or click <b>+ Add</b> to create one.</p>
      </div>
    );
  }

  const preview = serializeRule(rule);

  return (
    <div className="flex flex-col gap-3 h-[70vh] min-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
      <div className="panel p-3 flex flex-col gap-2">
        <h3 className="heading-gold text-sm uppercase tracking-widest">Conditions</h3>
        <ConditionTreeEditor
          node={rule.conditions}
          onChange={(next) => updateRule(rule.id, (r) => ({ ...r, conditions: next }))}
        />
      </div>

      <OutputEditor
        output={rule.output}
        onChange={(next) => updateRule(rule.id, (r) => ({ ...r, output: next }))}
      />

      <div className="panel p-3">
        <h3 className="heading-gold text-xs uppercase tracking-widest mb-2">Comment</h3>
        <input
          value={rule.inlineComment ?? ""}
          onChange={(e) => updateRule(rule.id, (r) => ({ ...r, inlineComment: e.target.value || undefined }))}
          placeholder="inline // comment (optional)"
          className="w-full bg-panel-hi border border-border px-2 py-1 text-xs font-mono focus:outline-none focus:border-d2-gold"
        />
      </div>

      <div className="panel-hi p-3 border border-border text-xs font-mono text-d2-normal break-all">
        <div className="text-stone-500 text-[10px] uppercase mb-1 tracking-widest">Preview</div>
        {preview}
      </div>
    </div>
  );
}
