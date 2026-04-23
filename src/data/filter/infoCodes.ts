// "Info" value-condition codes: character, item, or world properties that can be compared.
// Some also have %CODE% output forms.

import type { ValueOp } from "../../filter/types";

export type InfoCodeDef = {
  code: string;
  label: string;
  description: string;
  aliases?: string[];
  valueRange?: [number, number];
  validOperators?: ValueOp[];     // defaults to ["=","<",">","~"]; some (PREFIX/SUFFIX/AUTOMOD) only support "=" and "~"
  category: InfoCategory;
};

export type InfoCategory = "character" | "item" | "world" | "affix" | "damage" | "requirement" | "misc";

export const INFO_CODES: InfoCodeDef[] = [
  // gold/item-level/affix-level/rarity
  { code: "GOLD",       label: "Gold amount",        description: "Gold pile value. Can be hidden but not modified.", category: "item" },
  { code: "GEMLEVEL",   label: "Gem quality level",  description: "1..5 (Chipped→Perfect)", aliases: ["GEM"], valueRange: [1, 5], category: "item" },
  { code: "GEMTYPE",    label: "Gem type",           description: "1..7 (Amethyst, Diamond, Emerald, Ruby, Sapphire, Topaz, Skull)", valueRange: [1, 7], category: "item" },
  { code: "RUNE",       label: "Rune number",        description: "1..33 (El..Zod)", valueRange: [1, 33], category: "item" },
  { code: "QTY",        label: "Quantity",           description: "Stack size", category: "item" },
  { code: "LVLREQ",     label: "Level requirement",  description: "Required character level to use", category: "requirement" },
  { code: "PRICE",      label: "Vendor sell price",  description: "1..35000", valueRange: [1, 35000], category: "item" },
  { code: "ALVL",       label: "Affix level",        description: "Determines which affixes can roll", category: "item" },
  { code: "CRAFTALVL",  label: "Prospective crafted ALVL", description: "ALVL of crafted result if this item is used as the ingredient", category: "item" },
  { code: "REROLLALVL", label: "Prospective reroll ALVL", description: "ALVL when rerolled via cube recipe", category: "item" },
  { code: "QLVL",       label: "Quality level",      description: "Base-level quality of the item template", category: "item" },
  { code: "ILVL",       label: "Item level",         description: "Item level", category: "item" },

  // character / world
  { code: "CLVL",    label: "Character level", description: "Character level (1..99)", valueRange: [1, 99], category: "character" },
  { code: "DIFF",    label: "Difficulty",      description: "0=Normal, 1=Nightmare, 2=Hell", valueRange: [0, 2], category: "world" },
  { code: "MAPID",   label: "Current zone ID", description: "1..194 - see zone list", valueRange: [1, 194], category: "world" },
  { code: "MAPTIER", label: "Map tier",        description: "0=PvP, 1..3=T1..T3, 4=Dungeon, 5=Unique", valueRange: [0, 5], category: "world" },

  // affixes
  { code: "PREFIX",  label: "Item prefix ID",  description: "1..805 - use '=' or '~' only", valueRange: [1, 805], validOperators: ["=", "~"], category: "affix" },
  { code: "SUFFIX",  label: "Item suffix ID",  description: "1..900 - use '=' or '~' only", valueRange: [1, 900], validOperators: ["=", "~"], category: "affix" },
  { code: "AUTOMOD", label: "Item automod ID", description: "1..44 - use '=' or '~' only",  valueRange: [1, 44],  validOperators: ["=", "~"], category: "affix" },

  // strictness
  { code: "FILTLVL", label: "Filter strictness level", description: "0 (show all) up to 12 custom levels", valueRange: [0, 12], category: "world" },
  { code: "TRUE",    label: "Always true",  description: "Useful for toggling globals via aliases", category: "misc" },
  { code: "FALSE",   label: "Always false", description: "Useful for toggling globals via aliases", category: "misc" },

  // sockets, base damage, dimensions
  { code: "MAXSOCKETS",   label: "Max sockets possible", description: "Based on the item template", category: "item" },
  { code: "BASEMINONEH",  label: "Base min 1-hand damage", description: "", category: "damage" },
  { code: "BASEMINTWOH",  label: "Base min 2-hand damage", description: "", category: "damage" },
  { code: "BASEMINTHROW", label: "Base min throw damage",  description: "", category: "damage" },
  { code: "BASEMINKICK",  label: "Base min kick damage",   description: "", category: "damage" },
  { code: "BASEMINSMITE", label: "Base min smite damage",  description: "", category: "damage" },
  { code: "BASEMAXONEH",  label: "Base max 1-hand damage", description: "", category: "damage" },
  { code: "BASEMAXTWOH",  label: "Base max 2-hand damage", description: "", category: "damage" },
  { code: "BASEMAXTHROW", label: "Base max throw damage",  description: "", category: "damage" },
  { code: "BASEMAXKICK",  label: "Base max kick damage",   description: "", category: "damage" },
  { code: "BASEMAXSMITE", label: "Base max smite damage",  description: "", category: "damage" },

  // requirements
  { code: "REQDEX", label: "Required dexterity",      description: "", category: "requirement" },
  { code: "REQSTR", label: "Required strength",       description: "", category: "requirement" },
  { code: "REQLVL", label: "Required character level", description: "", category: "requirement" },
  { code: "UPDEX",  label: "Required dex when upgraded", description: "0 if no upgrade exists", category: "requirement" },
  { code: "UPSTR",  label: "Required str when upgraded", description: "0 if no upgrade exists", category: "requirement" },
  { code: "UPLVL",  label: "Required lvl when upgraded", description: "0 if no upgrade exists", category: "requirement" },

  // misc
  { code: "MAXRES",    label: "Max all resistance cap", description: "", category: "item" },
  { code: "ALLATTRIB", label: "+X to all stats",        description: "", category: "item" },
  { code: "BASEBLOCK", label: "Base block chance",      description: "", category: "item" },
  { code: "HEIGHT",    label: "Item height",            description: "Inventory height in cells", category: "item" },
  { code: "WIDTH",     label: "Item width",             description: "Inventory width in cells", category: "item" },
  { code: "AREA",      label: "Item area",              description: "Height × width", category: "item" },

  // SELLPRICE / BUYPRICE output-only aliases are handled under outputKeywords, but SELLPRICE as condition == PRICE
  { code: "SELLPRICE", label: "Vendor sell price (alias of PRICE)", description: "", category: "item" },
];

export const INFO_CODES_SET = new Set<string>(
  INFO_CODES.flatMap((c) => [c.code, ...(c.aliases ?? [])])
);

export const INFO_CODES_BY_CODE: Record<string, InfoCodeDef> = Object.fromEntries(
  INFO_CODES.flatMap((c) => [[c.code, c], ...(c.aliases?.map((a) => [a, c] as const) ?? [])])
);
