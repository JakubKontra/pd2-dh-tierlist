import {
  ITEM_CODES,
  ITEM_GROUPS,
  MUTABLE_CODES,
  INFO_CODES,
  NAMED_STATS,
  NUMBERED_STATS,
  SKILLS,
  SKILL_TABS,
  CLSK_CLASSES,
  RUNES,
  GEMS,
  MAP_IDS,
  CORRUPTIONS,
  PREFIXES,
  SUFFIXES,
} from "../../data/filter";
import type { CodeOption } from "./CodePicker";

// Options for boolean conditions (group codes, mutable codes, item rarities, etc.)
export const BOOLEAN_OPTIONS: CodeOption[] = [
  ...ITEM_GROUPS.map((g): CodeOption => ({ code: g.code, label: g.label, group: `Item group / ${g.category}` })),
  ...MUTABLE_CODES.map((m): CodeOption => ({ code: m.code, label: m.label, group: `Mutable / ${m.category}` })),
  ...ITEM_CODES.map((i): CodeOption => ({ code: i.code, label: i.name, group: `Item / ${i.category}${i.subcategory ? " / " + i.subcategory : ""}${i.tier ? " (" + i.tier + ")" : ""}` })),
  ...RUNES.map((r): CodeOption => ({ code: r.code, label: `${r.name} Rune (#${r.number})`, group: "Rune" })),
  ...RUNES.map((r): CodeOption => ({ code: r.stackedCode, label: `${r.name} Rune stacked`, group: "Rune (stacked)" })),
  ...GEMS.map((g): CodeOption => ({ code: g.code, label: g.name, group: "Gem" })),
];

// Options for value conditions (LHS code that has a comparison operator)
export const VALUE_LHS_OPTIONS: CodeOption[] = [
  ...INFO_CODES.map((c): CodeOption => ({ code: c.code, label: c.label, group: `Info / ${c.category}`, description: c.description })),
  ...NAMED_STATS.map((s): CodeOption => ({ code: s.code, label: s.label, group: "Named stat", description: s.itemAppearance })),
  ...NUMBERED_STATS.filter((s) => s.category !== "unused").map((s): CodeOption => ({
    code: `STAT${s.id}`,
    label: s.label,
    group: `STAT / ${s.category}`,
  })),
  ...SKILLS.map((s): CodeOption => ({ code: `SK${s.id}`, label: s.name, group: `Skill / ${s.class}` })),
  ...Object.entries(CLSK_CLASSES).map(([id, cls]): CodeOption => ({ code: `CLSK${id}`, label: `${cls} skills`, group: "Class skill" })),
  ...Object.entries(SKILL_TABS).map(([id, meta]): CodeOption => ({ code: `TABSK${id}`, label: `${meta.class} - ${meta.name}`, group: "Skill tab" })),
  { code: "ALLSK", label: "All skills", group: "Skill" },
];

export const ANY_OPTION_GROUPS: CodeOption[] = [
  ...BOOLEAN_OPTIONS,
  ...VALUE_LHS_OPTIONS,
];

export const MAP_ID_OPTIONS: CodeOption[] = MAP_IDS.map((m) => ({
  code: String(m.id),
  label: `${m.id} - ${m.name}`,
  group: `Act ${m.act}`,
}));

export const CORRUPTION_OPTIONS: CodeOption[] = CORRUPTIONS.map((c) => ({
  code: String(c.id),
  label: c.label,
  group: "Corruption",
}));

export const PREFIX_OPTIONS: CodeOption[] = PREFIXES.map((p) => ({
  code: String(p.id),
  label: p.name,
  group: p.applies ?? "Prefix",
}));

export const SUFFIX_OPTIONS: CodeOption[] = SUFFIXES.map((s) => ({
  code: String(s.id),
  label: s.name,
  group: s.applies ?? "Suffix",
}));
