import { create } from "zustand";
import { parseFilter } from "../filter/parser";
import { serializeFilter } from "../filter/serializer";
import { validate } from "../filter/validator";
import type { Alias, Diagnostic, FilterFile, Formula, Rule, StrictnessLevel } from "../filter/types";

const DRAFT_KEY = "pd2.lootFilter.draft";
const DEBOUNCE_MS = 200;

function newRuleId(file: FilterFile): string {
  let n = file.rules.length + 1;
  const existing = new Set(file.rules.map((r) => r.id));
  while (existing.has(`rule${n}`)) n++;
  return `rule${n}`;
}

function emptyFile(): FilterFile {
  return {
    strictnessLevels: [],
    aliases: [],
    formulas: [],
    rules: [],
    rawLines: [],
  };
}

function load(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}

function save(text: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, text);
  } catch {
    // ignore quota errors
  }
}

type FilterStore = {
  rawText: string;
  file: FilterFile;
  diagnostics: Diagnostic[];
  selectedRuleId: string | null;
  setRawText: (text: string) => void;
  replaceRawText: (text: string) => void; // no debounce, immediate parse (for Import)
  clear: () => void;
  exportText: () => string;
  // AST mutators (re-serialize to rawText so the text editor stays in sync)
  selectRule: (id: string | null) => void;
  addRule: () => string;
  deleteRule: (id: string) => void;
  toggleRuleEnabled: (id: string) => void;
  moveRule: (id: string, delta: number) => void;
  updateRule: (id: string, updater: (r: Rule) => Rule) => void;
  // Meta editors
  addStrictnessLevel: (name: string) => void;
  updateStrictnessLevel: (id: string, name: string) => void;
  deleteStrictnessLevel: (id: string) => void;
  addAlias: (key: string, value: string) => void;
  updateAlias: (id: string, patch: Partial<Pick<Alias, "key" | "value">>) => void;
  deleteAlias: (id: string) => void;
  addFormula: (key: string, expression: string) => void;
  updateFormula: (id: string, patch: Partial<Pick<Formula, "key" | "expression">>) => void;
  deleteFormula: (id: string) => void;
};

let debounceHandle: ReturnType<typeof setTimeout> | null = null;

export const useFilterStore = create<FilterStore>((set, get) => {
  const initial = load();
  const initialParse = initial ? parseFilter(initial) : { file: emptyFile(), diagnostics: [] };
  const initialValidate = validate(initialParse.file);

  const commitFile = (file: FilterFile) => {
    const text = serializeFilter(file);
    const reparsed = parseFilter(text);
    const v = validate(reparsed.file);
    save(text);
    set({
      rawText: text,
      file: reparsed.file,
      diagnostics: [...reparsed.diagnostics, ...v],
    });
  };

  return {
    rawText: initial,
    file: initialParse.file,
    diagnostics: [...initialParse.diagnostics, ...initialValidate],
    selectedRuleId: null,

    setRawText: (text) => {
      set({ rawText: text });
      save(text);
      if (debounceHandle) clearTimeout(debounceHandle);
      debounceHandle = setTimeout(() => {
        const p = parseFilter(text);
        const v = validate(p.file);
        set({ file: p.file, diagnostics: [...p.diagnostics, ...v] });
      }, DEBOUNCE_MS);
    },

    replaceRawText: (text) => {
      if (debounceHandle) clearTimeout(debounceHandle);
      const p = parseFilter(text);
      const v = validate(p.file);
      save(text);
      set({ rawText: text, file: p.file, diagnostics: [...p.diagnostics, ...v] });
    },

    clear: () => {
      if (debounceHandle) clearTimeout(debounceHandle);
      save("");
      set({ rawText: "", file: emptyFile(), diagnostics: [] });
    },

    exportText: () => {
      const { rawText, file } = get();
      return rawText.trim() !== "" ? rawText : serializeFilter(file);
    },

    selectRule: (id) => set({ selectedRuleId: id }),

    addRule: () => {
      const { file } = get();
      const id = newRuleId(file);
      const rule: Rule = {
        id,
        enabled: true,
        conditions: null,
        output: { name: [], description: [], hasDescription: false, continue: false, notifications: [] },
        leadingComments: [],
        sourceLine: 0,
      };
      const nextFile = { ...file, rules: [...file.rules, rule] };
      commitFile(nextFile);
      set({ selectedRuleId: id });
      return id;
    },

    deleteRule: (id) => {
      const { file, selectedRuleId } = get();
      const nextFile = { ...file, rules: file.rules.filter((r) => r.id !== id) };
      commitFile(nextFile);
      if (selectedRuleId === id) set({ selectedRuleId: null });
    },

    toggleRuleEnabled: (id) => {
      const { file } = get();
      const nextFile = {
        ...file,
        rules: file.rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
      };
      commitFile(nextFile);
    },

    moveRule: (id, delta) => {
      const { file } = get();
      const rules = [...file.rules];
      const idx = rules.findIndex((r) => r.id === id);
      if (idx === -1) return;
      const target = Math.max(0, Math.min(rules.length - 1, idx + delta));
      if (target === idx) return;
      const [removed] = rules.splice(idx, 1);
      rules.splice(target, 0, removed);
      commitFile({ ...file, rules });
    },

    updateRule: (id, updater) => {
      const { file } = get();
      const rules = file.rules.map((r) => (r.id === id ? updater(r) : r));
      commitFile({ ...file, rules });
    },

    addStrictnessLevel: (name) => {
      const { file } = get();
      const lvl: StrictnessLevel = { id: `lvl${file.strictnessLevels.length + 1}`, name, sourceLine: 0 };
      commitFile({ ...file, strictnessLevels: [...file.strictnessLevels, lvl] });
    },
    updateStrictnessLevel: (id, name) => {
      const { file } = get();
      commitFile({
        ...file,
        strictnessLevels: file.strictnessLevels.map((l) => (l.id === id ? { ...l, name } : l)),
      });
    },
    deleteStrictnessLevel: (id) => {
      const { file } = get();
      commitFile({
        ...file,
        strictnessLevels: file.strictnessLevels.filter((l) => l.id !== id),
      });
    },

    addAlias: (key, value) => {
      const { file } = get();
      const alias: Alias = { id: `alias${file.aliases.length + 1}`, key, value, sourceLine: 0 };
      commitFile({ ...file, aliases: [...file.aliases, alias] });
    },
    updateAlias: (id, patch) => {
      const { file } = get();
      commitFile({
        ...file,
        aliases: file.aliases.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      });
    },
    deleteAlias: (id) => {
      const { file } = get();
      commitFile({ ...file, aliases: file.aliases.filter((a) => a.id !== id) });
    },

    addFormula: (key, expression) => {
      const { file } = get();
      const formula: Formula = { id: `formula${file.formulas.length + 1}`, key, expression, sourceLine: 0 };
      commitFile({ ...file, formulas: [...file.formulas, formula] });
    },
    updateFormula: (id, patch) => {
      const { file } = get();
      commitFile({
        ...file,
        formulas: file.formulas.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      });
    },
    deleteFormula: (id) => {
      const { file } = get();
      commitFile({ ...file, formulas: file.formulas.filter((f) => f.id !== id) });
    },
  };
});
