// "Mutable" boolean codes - depend on viewing context (character class, inventory location)
// per https://wiki.projectdiablo2.com/wiki/Item_Filtering#Mutable_Codes

export type MutableCodeDef = {
  code: string;
  label: string;
  category: "class" | "location";
};

export const MUTABLE_CODES: MutableCodeDef[] = [
  { code: "AMAZON",      label: "Character is an Amazon",      category: "class" },
  { code: "ASSASSIN",    label: "Character is an Assassin",    category: "class" },
  { code: "BARBARIAN",   label: "Character is a Barbarian",    category: "class" },
  { code: "DRUID",       label: "Character is a Druid",        category: "class" },
  { code: "NECROMANCER", label: "Character is a Necromancer",  category: "class" },
  { code: "PALADIN",     label: "Character is a Paladin",      category: "class" },
  { code: "SORCERESS",   label: "Character is a Sorceress",    category: "class" },
  { code: "SHOP",        label: "Item is in a merchant's shop window", category: "location" },
  { code: "EQUIPPED",    label: "Item is equipped by the character",   category: "location" },
  { code: "MERC",        label: "Item is equipped by the mercenary",   category: "location" },
  { code: "INVENTORY",   label: "Item is in the inventory",            category: "location" },
  { code: "CUBE",        label: "Item is in the Horadric Cube",        category: "location" },
  { code: "STASH",       label: "Item is in the stash",                category: "location" },
  { code: "GROUND",      label: "Item is on the ground",               category: "location" },
];

export const MUTABLE_CODES_SET = new Set(MUTABLE_CODES.map((c) => c.code));
