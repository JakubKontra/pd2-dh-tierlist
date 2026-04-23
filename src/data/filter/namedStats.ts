// Named attribute codes - human-friendly aliases for specific stats.
// These are used as value conditions (SOCKETS>0, FRES>40) AND as value-reference output keywords (%SOCKETS%, %FRES%).

export type NamedStatDef = {
  code: string;
  label: string;
  itemAppearance: string;
  aliases?: string[];
  isBoolean?: boolean;     // FOOLS behaves as a boolean condition
  statId?: number;         // equivalent STAT### code if any
};

export const NAMED_STATS: NamedStatDef[] = [
  { code: "SOCKETS", label: "Total sockets",           itemAppearance: "Socketed (N)", aliases: ["SOCK"], statId: 194 },
  { code: "DEF",     label: "Total defense",           itemAppearance: "Defense: N / +N Defense", statId: 31 },
  { code: "ED",      label: "Enhanced defense/damage", itemAppearance: "+N% Enhanced Defense or +N% Enhanced Damage" },
  { code: "EDEF",    label: "Enhanced defense (incl. sockets & runeword bonuses)", itemAppearance: "+N% Enhanced Defense" },
  { code: "EDAM",    label: "Enhanced damage (incl. sockets & runeword bonuses)",  itemAppearance: "+N% Enhanced Damage" },
  { code: "MAXDUR",  label: "Max durability %",        itemAppearance: "Increase Maximum Durability N%", statId: 75 },
  { code: "AR",      label: "Attack rating",           itemAppearance: "+N to Attack Rating", statId: 19 },
  { code: "RES",     label: "All resistances",         itemAppearance: "All Resistances +N" },
  { code: "FRES",    label: "Fire resist",             itemAppearance: "Fire Resist +N%", statId: 39 },
  { code: "CRES",    label: "Cold resist",             itemAppearance: "Cold Resist +N%", statId: 43 },
  { code: "LRES",    label: "Lightning resist",        itemAppearance: "Lightning Resist +N%", statId: 41 },
  { code: "PRES",    label: "Poison resist",           itemAppearance: "Poison Resist +N%", statId: 45 },
  { code: "FRW",     label: "Faster run/walk",         itemAppearance: "+N% Faster Run/Walk", statId: 96 },
  { code: "IAS",     label: "Increased attack speed",  itemAppearance: "+N% Increased Attack Speed", statId: 93 },
  { code: "FCR",     label: "Faster cast rate",        itemAppearance: "+N% Faster Cast Rate", statId: 105 },
  { code: "FHR",     label: "Faster hit recovery",     itemAppearance: "+N% Faster Hit Recovery", statId: 99 },
  { code: "FBR",     label: "Faster block rate",       itemAppearance: "+N% Faster Block Rate", statId: 102 },
  { code: "MINDMG",  label: "Min damage",              itemAppearance: "+N to Minimum Damage", statId: 21 },
  { code: "MAXDMG",  label: "Max damage",              itemAppearance: "+N to Maximum Damage", statId: 22 },
  { code: "STR",     label: "Strength",                itemAppearance: "+N to Strength", statId: 0 },
  { code: "DEX",     label: "Dexterity",               itemAppearance: "+N to Dexterity", statId: 2 },
  { code: "LIFE",    label: "Max life",                itemAppearance: "+N to Life", statId: 7 },
  { code: "MANA",    label: "Max mana",                itemAppearance: "+N to Mana", statId: 9 },
  { code: "MFIND",   label: "Magic find",              itemAppearance: "N% Better Chance of Getting Magic Items", statId: 80 },
  { code: "GFIND",   label: "Gold find",               itemAppearance: "N% Extra Gold from Monsters", statId: 79 },
  { code: "MAEK",    label: "Mana per kill",           itemAppearance: "+N to Mana after each Kill", statId: 138 },
  { code: "DTM",     label: "Damage-to-mana",          itemAppearance: "N% Damage Taken Gained as Mana when Hit", statId: 114 },
  { code: "REPLIFE", label: "Replenish life",          itemAppearance: "Replenish Life +N", statId: 74 },
  { code: "REPAIR",  label: "Auto-repair",             itemAppearance: "Repairs X Durability in Y Seconds", statId: 252 },
  { code: "ARPER",   label: "% AR bonus",              itemAppearance: "N% Bonus to Attack Rating", statId: 119 },
  { code: "FOOLS",   label: "Fool's mod (AR + max dmg based on level)", itemAppearance: "Fool's", isBoolean: true },
];

export const NAMED_STATS_SET = new Set<string>(
  NAMED_STATS.flatMap((s) => [s.code, ...(s.aliases ?? [])])
);

export const NAMED_STATS_BY_CODE: Record<string, NamedStatDef> = Object.fromEntries(
  NAMED_STATS.flatMap((s) => [[s.code, s], ...(s.aliases?.map((a) => [a, s] as const) ?? [])])
);

// Shortcut codes listed in the wiki that can be used in STAT/MULTI addition expressions.
export const STAT_SHORTCUTS = new Set([
  "STR","DEX","LIFE","MANA","FRES","CRES","LRES","PRES",
  "EDEF","EDAM","FCR","AR","REPLIFE",
]);
