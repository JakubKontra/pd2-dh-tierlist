import { useState } from "react";
import { useFilterStore } from "../../store/filter";

export function MetaEditors() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <StrictnessLevelsEditor />
      <AliasesEditor />
      <FormulasEditor />
    </div>
  );
}

function StrictnessLevelsEditor() {
  const levels = useFilterStore((s) => s.file.strictnessLevels);
  const addLevel = useFilterStore((s) => s.addStrictnessLevel);
  const updateLevel = useFilterStore((s) => s.updateStrictnessLevel);
  const deleteLevel = useFilterStore((s) => s.deleteStrictnessLevel);
  const [name, setName] = useState("");

  return (
    <section className="panel p-3 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h4 className="heading-gold text-xs uppercase tracking-widest">Strictness levels</h4>
        <span className="text-xs text-stone-500">{levels.length}/12</span>
      </header>
      <p className="text-[11px] text-stone-500">
        Custom filter strictness levels. Up to 12. Referenced via <code>FILTLVL</code>/<code>%TIER-N%</code>.
      </p>
      <ol className="space-y-1 text-xs">
        {levels.map((l, i) => (
          <li key={l.id} className="flex items-center gap-2">
            <span className="text-stone-600 tabular-nums w-6">{i + 1}</span>
            <input
              value={l.name}
              onChange={(e) => updateLevel(l.id, e.target.value)}
              className="flex-1 bg-panel-hi border border-border px-2 py-0.5 font-mono"
            />
            <button onClick={() => deleteLevel(l.id)} className="text-stone-500 hover:text-d2-red">×</button>
          </li>
        ))}
        {levels.length === 0 && <li className="text-stone-600 italic">none</li>}
      </ol>
      {levels.length < 12 && (
        <div className="flex items-center gap-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Low Strictness"
            className="flex-1 bg-panel-hi border border-border px-2 py-0.5 text-xs font-mono"
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                addLevel(name.trim());
                setName("");
              }
            }}
          />
          <button
            onClick={() => {
              if (name.trim()) {
                addLevel(name.trim());
                setName("");
              }
            }}
            className="text-xs px-2 py-1 border border-border hover:border-d2-gold"
          >
            +
          </button>
        </div>
      )}
    </section>
  );
}

function AliasesEditor() {
  const aliases = useFilterStore((s) => s.file.aliases);
  const addAlias = useFilterStore((s) => s.addAlias);
  const updateAlias = useFilterStore((s) => s.updateAlias);
  const deleteAlias = useFilterStore((s) => s.deleteAlias);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <section className="panel p-3 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h4 className="heading-gold text-xs uppercase tracking-widest">Aliases</h4>
        <span className="text-xs text-stone-500">{aliases.length}</span>
      </header>
      <p className="text-[11px] text-stone-500">
        Text substitutions applied when the filter is loaded.
      </p>
      <ol className="space-y-1 text-xs max-h-48 overflow-y-auto scrollbar-thin">
        {aliases.map((a) => (
          <li key={a.id} className="flex items-center gap-1">
            <input
              value={a.key}
              onChange={(e) => updateAlias(a.id, { key: e.target.value })}
              className="w-24 bg-panel-hi border border-border px-2 py-0.5 font-mono"
            />
            <span className="text-stone-500">:</span>
            <input
              value={a.value}
              onChange={(e) => updateAlias(a.id, { value: e.target.value })}
              className="flex-1 bg-panel-hi border border-border px-2 py-0.5 font-mono"
            />
            <button onClick={() => deleteAlias(a.id)} className="text-stone-500 hover:text-d2-red">×</button>
          </li>
        ))}
        {aliases.length === 0 && <li className="text-stone-600 italic">none</li>}
      </ol>
      <div className="flex items-center gap-1">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="KEY"
          className="w-24 bg-panel-hi border border-border px-2 py-0.5 text-xs font-mono"
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="replacement text"
          className="flex-1 bg-panel-hi border border-border px-2 py-0.5 text-xs font-mono"
        />
        <button
          onClick={() => {
            if (key.trim() && value.trim()) {
              addAlias(key.trim(), value.trim());
              setKey("");
              setValue("");
            }
          }}
          className="text-xs px-2 py-1 border border-border hover:border-d2-gold"
        >
          +
        </button>
      </div>
    </section>
  );
}

function FormulasEditor() {
  const formulas = useFilterStore((s) => s.file.formulas);
  const addFormula = useFilterStore((s) => s.addFormula);
  const updateFormula = useFilterStore((s) => s.updateFormula);
  const deleteFormula = useFilterStore((s) => s.deleteFormula);
  const [key, setKey] = useState("");
  const [expr, setExpr] = useState("");

  return (
    <section className="panel p-3 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h4 className="heading-gold text-xs uppercase tracking-widest">Formulas</h4>
        <span className="text-xs text-stone-500">{formulas.length}</span>
      </header>
      <p className="text-[11px] text-stone-500">
        Named formulas referenceable via <code>FORMULAKEY</code>. Key chars: <code>A-Z</code>, <code>_</code>.
      </p>
      <ol className="space-y-1 text-xs max-h-48 overflow-y-auto scrollbar-thin">
        {formulas.map((f) => (
          <li key={f.id} className="flex items-center gap-1">
            <input
              value={f.key}
              onChange={(e) => updateFormula(f.id, { key: e.target.value })}
              className="w-24 bg-panel-hi border border-border px-2 py-0.5 font-mono"
            />
            <span className="text-stone-500">:</span>
            <input
              value={f.expression}
              onChange={(e) => updateFormula(f.id, { expression: e.target.value })}
              className="flex-1 bg-panel-hi border border-border px-2 py-0.5 font-mono"
            />
            <button onClick={() => deleteFormula(f.id)} className="text-stone-500 hover:text-d2-red">×</button>
          </li>
        ))}
        {formulas.length === 0 && <li className="text-stone-600 italic">none</li>}
      </ol>
      <div className="flex items-center gap-1">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="_A"
          className="w-24 bg-panel-hi border border-border px-2 py-0.5 text-xs font-mono"
        />
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="STAT1>50"
          className="flex-1 bg-panel-hi border border-border px-2 py-0.5 text-xs font-mono"
        />
        <button
          onClick={() => {
            if (key.trim() && expr.trim()) {
              addFormula(key.trim(), expr.trim());
              setKey("");
              setExpr("");
            }
          }}
          className="text-xs px-2 py-1 border border-border hover:border-d2-gold"
        >
          +
        </button>
      </div>
    </section>
  );
}
