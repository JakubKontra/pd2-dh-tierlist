export type GemDef = {
  code: string;            // e.g. gcv, gzv
  stackedCode?: string;    // e.g. gzvs (only exists for Flawless/Perfect and Skulls)
  quality: GemQuality;
  type: GemType;
  name: string;
};

export type GemQuality = "Chipped" | "Flawed" | "Normal" | "Flawless" | "Perfect";
export type GemType = "Amethyst" | "Topaz" | "Sapphire" | "Emerald" | "Ruby" | "Diamond" | "Skull";

// codes per wiki
// col 1 = chipped/flawed/normal (no stacked form)
// col 2 = flawless (stacked ends in 's')
// col 3 = perfect (stacked ends in 's')
const TABLE: Array<{ type: GemType; chipped: string; flawed: string; normal: string; flawless: string; perfect: string }> = [
  { type: "Amethyst", chipped: "gcv", flawed: "gfv", normal: "gsv", flawless: "gzv", perfect: "gpv" },
  { type: "Topaz",    chipped: "gcy", flawed: "gfy", normal: "gsy", flawless: "gly", perfect: "gpy" },
  { type: "Sapphire", chipped: "gcb", flawed: "gfb", normal: "gsb", flawless: "glb", perfect: "gpb" },
  { type: "Emerald",  chipped: "gcg", flawed: "gfg", normal: "gsg", flawless: "glg", perfect: "gpg" },
  { type: "Ruby",     chipped: "gcr", flawed: "gfr", normal: "gsr", flawless: "glr", perfect: "gpr" },
  { type: "Diamond",  chipped: "gcw", flawed: "gfw", normal: "gsw", flawless: "glw", perfect: "gpw" },
  { type: "Skull",    chipped: "skc", flawed: "skf", normal: "sku", flawless: "skl", perfect: "skz" },
];

export const GEMS: GemDef[] = TABLE.flatMap((row) => [
  { code: row.chipped,  quality: "Chipped",  type: row.type, name: `Chipped ${row.type}` },
  { code: row.flawed,   quality: "Flawed",   type: row.type, name: `Flawed ${row.type}` },
  { code: row.normal,   quality: "Normal",   type: row.type, name: row.type === "Skull" ? "Skull" : row.type },
  { code: row.flawless, stackedCode: `${row.flawless}s`, quality: "Flawless", type: row.type, name: `Flawless ${row.type}` },
  { code: row.perfect,  stackedCode: `${row.perfect}s`,  quality: "Perfect",  type: row.type, name: `Perfect ${row.type}` },
]);

export const GEMS_BY_CODE: Record<string, GemDef> = Object.fromEntries(
  GEMS.flatMap((g) => {
    const entries: Array<[string, GemDef]> = [[g.code, g]];
    if (g.stackedCode) entries.push([g.stackedCode, g]);
    return entries;
  })
);

export const GEM_TYPE_INDEX: Record<GemType, number> = {
  Amethyst: 1,
  Diamond: 2,
  Emerald: 3,
  Ruby: 4,
  Sapphire: 5,
  Topaz: 6,
  Skull: 7,
};

export const GEM_QUALITY_INDEX: Record<GemQuality, number> = {
  Chipped: 1,
  Flawed: 2,
  Normal: 3,
  Flawless: 4,
  Perfect: 5,
};
