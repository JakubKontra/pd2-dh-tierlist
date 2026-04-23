// Item group (boolean) codes: rarities, tiers, properties, armor/weapon class groups.

export type ItemGroupDef = {
  code: string;
  label: string;
  category: ItemGroupCategory;
  aliases?: string[];         // alternative codes that mean the same thing (e.g. EQ1 ↔ HELM)
  description?: string;
};

export type ItemGroupCategory =
  | "rarity"
  | "tier"
  | "property"
  | "armor"
  | "weapon"
  | "misc"
  | "class-restricted";

export const ITEM_GROUPS: ItemGroupDef[] = [
  // rarities
  { code: "NMAG",  label: "Regular (incl. most non-equipment)", category: "rarity" },
  { code: "MAG",   label: "Magic",   category: "rarity" },
  { code: "RARE",  label: "Rare",    category: "rarity" },
  { code: "UNI",   label: "Unique",  category: "rarity" },
  { code: "SET",   label: "Set",     category: "rarity" },
  { code: "CRAFT", label: "Crafted", category: "rarity" },

  // tiers
  { code: "NORM", label: "Normal",      category: "tier" },
  { code: "EXC",  label: "Exceptional", category: "tier" },
  { code: "ELT",  label: "Elite",       category: "tier" },

  // properties
  { code: "ID",     label: "Identified",                        category: "property" },
  { code: "INF",    label: "Inferior",                          category: "property" },
  { code: "SUP",    label: "Superior",                          category: "property" },
  { code: "ETH",    label: "Ethereal",                          category: "property" },
  { code: "RW",     label: "Runeword",                          category: "property" },
  { code: "GEMMED", label: "Socketed with a gem/rune/jewel",    category: "property" },

  // armor groups
  { code: "HELM",   label: "Helms (incl. class helms)", category: "armor", aliases: ["EQ1"] },
  { code: "CHEST",  label: "Chests",                    category: "armor", aliases: ["EQ2"] },
  { code: "SHIELD", label: "Shields (incl. class shields)", category: "armor", aliases: ["EQ3"] },
  { code: "GLOVES", label: "Gloves",                    category: "armor", aliases: ["EQ4"] },
  { code: "BOOTS",  label: "Boots",                     category: "armor", aliases: ["EQ5"] },
  { code: "BELT",   label: "Belts",                     category: "armor", aliases: ["EQ6"] },
  { code: "CIRC",   label: "Circlets",                  category: "armor", aliases: ["EQ7"] },
  { code: "ARMOR",  label: "All armors (incl. class-restricted)", category: "armor" },

  // weapon groups
  { code: "AXE",      label: "Axes (incl. throwing axes)", category: "weapon", aliases: ["WP1"] },
  { code: "MACE",     label: "Maces",                       category: "weapon", aliases: ["WP2"] },
  { code: "SWORD",    label: "Swords",                      category: "weapon", aliases: ["WP3"] },
  { code: "DAGGER",   label: "Daggers (incl. throwing knives)", category: "weapon", aliases: ["WP4"] },
  { code: "THROWING", label: "Throwing Weapons",            category: "weapon", aliases: ["WP5"] },
  { code: "JAV",      label: "Javelins (incl. Amazon)",     category: "weapon", aliases: ["WP6"] },
  { code: "SPEAR",    label: "Spears (incl. Amazon)",       category: "weapon", aliases: ["WP7"] },
  { code: "POLEARM",  label: "Polearms",                    category: "weapon", aliases: ["WP8"] },
  { code: "BOW",      label: "Bows (incl. Amazon)",         category: "weapon", aliases: ["WP9"] },
  { code: "XBOW",     label: "Crossbows",                   category: "weapon", aliases: ["WP10"] },
  { code: "STAFF",    label: "Staves",                      category: "weapon", aliases: ["WP11"] },
  { code: "WAND",     label: "Wands",                       category: "weapon", aliases: ["WP12"] },
  { code: "SCEPTER",  label: "Scepters",                    category: "weapon", aliases: ["WP13"] },
  { code: "WEAPON",   label: "All weapons (incl. class-restricted)", category: "weapon" },
  { code: "1H",       label: "1-Handed Weapons",            category: "weapon" },
  { code: "2H",       label: "2-Handed Weapons",            category: "weapon" },
  { code: "CLUB",     label: "Clubs (mace subtype)",        category: "weapon" },
  { code: "TMACE",    label: "Tipped Maces (mace subtype)", category: "weapon" },
  { code: "HAMMER",   label: "Hammers (mace subtype)",      category: "weapon" },

  // misc
  { code: "JEWELRY", label: "Rings & amulets", category: "misc" },
  { code: "CHARM",   label: "Charms (small, large, grand)", category: "misc" },
  { code: "QUIVER",  label: "Quivers (arrows, bolts)", category: "misc" },
  { code: "MISC",    label: "Misc items (potions, gems, runes, ingredients, quest)", category: "misc" },

  // class-restricted
  { code: "DRU", label: "Druid pelts",            category: "class-restricted", aliases: ["CL1"] },
  { code: "BAR", label: "Barbarian helms",        category: "class-restricted", aliases: ["CL2"] },
  { code: "DIN", label: "Paladin shields",        category: "class-restricted", aliases: ["CL3"] },
  { code: "NEC", label: "Necromancer shields",    category: "class-restricted", aliases: ["CL4"] },
  { code: "SIN", label: "Assassin weapons",       category: "class-restricted", aliases: ["CL5"] },
  { code: "SOR", label: "Sorceress weapons (Orbs)", category: "class-restricted", aliases: ["CL6"] },
  { code: "ZON", label: "Amazon weapons",         category: "class-restricted", aliases: ["CL7"] },
  { code: "CLASS", label: "All class-restricted items", category: "class-restricted" },
];

export const ITEM_GROUPS_SET = new Set<string>(
  ITEM_GROUPS.flatMap((g) => [g.code, ...(g.aliases ?? [])])
);

export const ITEM_GROUPS_BY_CODE: Record<string, ItemGroupDef> = Object.fromEntries(
  ITEM_GROUPS.flatMap((g) => [[g.code, g], ...(g.aliases?.map((a) => [a, g] as const) ?? [])])
);
