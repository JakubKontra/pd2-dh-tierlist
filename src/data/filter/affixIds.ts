// PREFIX / SUFFIX / AUTOMOD value-condition IDs.
// PD2 official ranges per wiki: PREFIX 1..805, SUFFIX 1..900, AUTOMOD 1..44.
// Named labels are a curated subset (charms/jewels from the wiki); anything else is just
// validated for being in the numeric range. Full per-ID labels live in external spreadsheets
// linked from the wiki - if/when we snapshot them, drop them into this file.

export type AffixDef = {
  id: number;
  name: string;
  applies?: string;   // freeform — "Grand Charm prefix", "Jewel suffix", etc.
};

export const PREFIX_MAX = 805;
export const SUFFIX_MAX = 900;
export const AUTOMOD_MAX = 44;

// Curated labeled prefixes (grand/large/small charm + jewel subset)
export const PREFIXES: AffixDef[] = [
  { id: 134, name: "Stalwart",                   applies: "Large Charm prefix (Defense)" },
  { id: 138, name: "Stalwart (SC)",              applies: "Small Charm prefix (Defense)" },
  { id: 142, name: "Ivory",                      applies: "Jewel prefix (Defense)" },
  { id: 167, name: "Bloody",                     applies: "Small Charm prefix (Min dmg)" },
  { id: 185, name: "Vermillion",                 applies: "Jewel prefix (Max dmg)" },
  { id: 198, name: "Ruby (ED%)",                 applies: "Jewel prefix (Damage %)" },
  { id: 200, name: "Dun",                        applies: "Jewel prefix (Dmg% To Mana)" },
  { id: 226, name: "Steel",                      applies: "Grand Charm prefix (AR)" },
  { id: 233, name: "Steel (LC)",                 applies: "Large Charm prefix (AR)" },
  { id: 237, name: "Steel (SC)",                 applies: "Small Charm prefix (AR)" },
  { id: 250, name: "Argent",                     applies: "Jewel prefix (AR)" },
  { id: 253, name: "Sharp",                      applies: "Grand Charm prefix (Max dmg)" },
  { id: 255, name: "Sharp (LC)",                 applies: "Large Charm prefix (Max dmg & AR)" },
  { id: 256, name: "Fine",                       applies: "Small Charm prefix (Max dmg & AR)" },
  { id: 280, name: "Lucky",                      applies: "Large Charm prefix (MF)" },
  { id: 292, name: "Serpent's",                  applies: "Grand Charm prefix (Mana)" },
  { id: 303, name: "Serpent's (SC)",             applies: "Small Charm prefix (Mana)" },
  { id: 319, name: "Shimmering",                 applies: "Grand Charm prefix (All res)" },
  { id: 321, name: "Shimmering (LC)",            applies: "Large Charm prefix (All res)" },
  { id: 322, name: "Shimmering (SC)",            applies: "Small Charm prefix (All res)" },
  { id: 337, name: "Scintillating",              applies: "Jewel prefix (All res)" },
  { id: 349, name: "Sapphire (SC)",              applies: "Small Charm prefix (Cold res)" },
  { id: 357, name: "Sapphire (Jewel)",           applies: "Jewel prefix (Cold res)" },
  { id: 369, name: "Ruby (SC)",                  applies: "Small Charm prefix (Fire res)" },
  { id: 376, name: "Ruby (Jewel)",               applies: "Jewel prefix (Fire res)" },
  { id: 388, name: "Amber (SC)",                 applies: "Small Charm prefix (Light res)" },
  { id: 396, name: "Ambergris",                  applies: "Jewel prefix (Light res)" },
  { id: 408, name: "Emerald (SC)",               applies: "Small Charm prefix (Poison res)" },
  { id: 416, name: "Jade",                       applies: "Jewel prefix (Poison res)" },
  { id: 419, name: "Aureolin",                   applies: "Jewel prefix (Mana after kill)" },
  { id: 430, name: "Amazon (Bow/Crossbow)",      applies: "Grand Charm prefix (Amazon)" },
  { id: 431, name: "Amazon (Passive/Magic)",     applies: "Grand Charm prefix (Amazon)" },
  { id: 432, name: "Amazon (Javelin/Spear)",     applies: "Grand Charm prefix (Amazon)" },
  { id: 442, name: "Sorceress (Fire)",           applies: "Grand Charm prefix (Sorceress)" },
  { id: 443, name: "Sorceress (Lightning)",      applies: "Grand Charm prefix (Sorceress)" },
  { id: 444, name: "Sorceress (Cold)",           applies: "Grand Charm prefix (Sorceress)" },
  { id: 454, name: "Necromancer (Curses)",       applies: "Grand Charm prefix (Necro)" },
  { id: 455, name: "Necromancer (Poison/Bone)",  applies: "Grand Charm prefix (Necro)" },
  { id: 456, name: "Necromancer (Summoning)",    applies: "Grand Charm prefix (Necro)" },
  { id: 466, name: "Paladin (Combat)",           applies: "Grand Charm prefix (Paladin)" },
  { id: 467, name: "Paladin (Offensive Aura)",   applies: "Grand Charm prefix (Paladin)" },
  { id: 468, name: "Paladin (Defensive Aura)",   applies: "Grand Charm prefix (Paladin)" },
  { id: 478, name: "Barb (Combat)",              applies: "Grand Charm prefix (Barb)" },
  { id: 479, name: "Barb (Masteries)",           applies: "Grand Charm prefix (Barb)" },
  { id: 480, name: "Barb (Warcries)",            applies: "Grand Charm prefix (Barb)" },
  { id: 490, name: "Druid (Summoning)",          applies: "Grand Charm prefix (Druid)" },
  { id: 491, name: "Druid (Shapeshifting)",      applies: "Grand Charm prefix (Druid)" },
  { id: 492, name: "Druid (Elemental)",          applies: "Grand Charm prefix (Druid)" },
  { id: 502, name: "Assassin (Traps)",           applies: "Grand Charm prefix (Assassin)" },
  { id: 503, name: "Assassin (Shadow)",          applies: "Grand Charm prefix (Assassin)" },
  { id: 504, name: "Assassin (Martial Arts)",    applies: "Grand Charm prefix (Assassin)" },
  { id: 617, name: "Hibernal",                   applies: "Grand Charm prefix (Cold dmg)" },
  { id: 621, name: "Hibernal (LC)",              applies: "Large Charm prefix (Cold dmg)" },
  { id: 625, name: "Hibernal (SC)",              applies: "Small Charm prefix (Cold dmg)" },
  { id: 629, name: "Flaming",                    applies: "Grand Charm prefix (Fire dmg)" },
  { id: 633, name: "Flaming (LC)",               applies: "Large Charm prefix (Fire dmg)" },
  { id: 637, name: "Flaming (SC)",               applies: "Small Charm prefix (Fire dmg)" },
  { id: 641, name: "Shocking",                   applies: "Grand Charm prefix (Light dmg)" },
  { id: 645, name: "Shocking (LC)",              applies: "Large Charm prefix (Light dmg)" },
  { id: 649, name: "Shocking (SC)",              applies: "Small Charm prefix (Light dmg)" },
  { id: 653, name: "Pestillent",                 applies: "Grand Charm prefix (Poison dmg)" },
  { id: 657, name: "Pestillent (LC)",            applies: "Large Charm prefix (Poison dmg)" },
  { id: 661, name: "Pestillent (SC)",            applies: "Small Charm prefix (Poison dmg)" },
  { id: 737, name: "Blood Sucking",              applies: "Jewel prefix (Life after kill)" },
  { id: 748, name: "Conduit",                    applies: "Large Charm prefix (Light skill %)" },
  { id: 749, name: "Numbing",                    applies: "Large Charm prefix (Cold skill %)" },
  { id: 750, name: "Inferno",                    applies: "Large Charm prefix (Fire skill %)" },
  { id: 751, name: "Infectious",                 applies: "Large Charm prefix (Poison skill %)" },
  { id: 752, name: "Scintillating (LC)",         applies: "Large Charm prefix (Magic skill %)" },
  { id: 811, name: "Gorelust",                   applies: "Jewel prefix (Open Wounds)" },
  { id: 903, name: "Quick",                      applies: "Large Charm prefix (IAS %)" },
  { id: 905, name: "Mystic",                     applies: "Large Charm prefix (FCR %)" },
];

export const SUFFIXES: AffixDef[] = [
  { id: 165, name: "Malice",       applies: "Jewel suffix (ATD)" },
  { id: 171, name: "Fervor",       applies: "Jewel suffix (IAS)" },
  { id: 222, name: "Carnage",      applies: "Jewel suffix (Max dmg)" },
  { id: 258, name: "Dexterity",    applies: "Grand Charm suffix (Dexterity)" },
  { id: 259, name: "Dexterity (LC)", applies: "Large Charm suffix (Dexterity)" },
  { id: 260, name: "Dexterity (SC)", applies: "Small Charm suffix (Dexterity)" },
  { id: 265, name: "Balance",      applies: "Grand Charm suffix (FHR)" },
  { id: 266, name: "Balance (LC)", applies: "Large Charm suffix (FHR)" },
  { id: 267, name: "Balance (SC)", applies: "Small Charm suffix (FHR)" },
  { id: 268, name: "Truth",        applies: "Jewel suffix (FHR)" },
  { id: 281, name: "Greed",        applies: "Grand Charm suffix (GF%)" },
  { id: 283, name: "Greed (LC)",   applies: "Large Charm suffix (GF%)" },
  { id: 284, name: "Greed (SC)",   applies: "Small Charm suffix (GF%)" },
  { id: 285, name: "Avarice",      applies: "Jewel suffix (GF%)" },
  { id: 291, name: "Good Luck",    applies: "Small Charm suffix (MF%)" },
  { id: 292, name: "Prosperity",   applies: "Jewel suffix (MF%)" },
  { id: 339, name: "Vita",         applies: "Grand Charm suffix (36-45 life)" },
  { id: 345, name: "Vita (LC)",    applies: "Large Charm suffix (Life)" },
  { id: 346, name: "Vita (LC alt)", applies: "Large Charm suffix (Life)" },
  { id: 349, name: "Vita (SC)",    applies: "Small Charm suffix (Life)" },
  { id: 351, name: "Hope",         applies: "Jewel suffix (Life)" },
  { id: 371, name: "Freedom",      applies: "Jewel suffix (-15% Req)" },
  { id: 390, name: "Strength",     applies: "Grand Charm suffix (Strength)" },
  { id: 391, name: "Strength (LC)", applies: "Large Charm suffix (Strength)" },
  { id: 392, name: "Strength (SC)", applies: "Small Charm suffix (Strength)" },
  { id: 399, name: "Inertia",      applies: "Grand Charm suffix (FRW)" },
  { id: 400, name: "Inertia (LC)", applies: "Large Charm suffix (FRW)" },
  { id: 401, name: "Inertia (SC)", applies: "Small Charm suffix (FRW)" },
  { id: 670, name: "Daring",       applies: "Jewel suffix (Dexterity)" },
  { id: 672, name: "Knowledge",    applies: "Jewel suffix (Energy)" },
  { id: 674, name: "Virility",     applies: "Jewel suffix (Strength)" },
  { id: 685, name: "Anthrax",      applies: "Grand Charm suffix (Poison dmg)" },
  { id: 689, name: "Anthrax (LC)", applies: "Large Charm suffix (Poison dmg)" },
  { id: 693, name: "Anthrax (SC)", applies: "Small Charm suffix (Poison dmg)" },
  { id: 697, name: "Winter",       applies: "Grand Charm suffix (Cold dmg)" },
  { id: 701, name: "Winter (LC)",  applies: "Large Charm suffix (Cold dmg)" },
  { id: 705, name: "Winter (SC)",  applies: "Small Charm suffix (Cold dmg)" },
  { id: 709, name: "Incineration", applies: "Grand Charm suffix (Fire dmg)" },
  { id: 713, name: "Incineration (LC)", applies: "Large Charm suffix (Fire dmg)" },
  { id: 717, name: "Incineration (SC)", applies: "Small Charm suffix (Fire dmg)" },
  { id: 721, name: "Storms",       applies: "Grand Charm suffix (Light dmg)" },
  { id: 725, name: "Storms (LC)",  applies: "Large Charm suffix (Light dmg)" },
  { id: 729, name: "Storms (SC)",  applies: "Small Charm suffix (Light dmg)" },
];

export const AUTOMODS: AffixDef[] = [
  // 1..44 per wiki - IDs 1..44 without curated labels; placeholder names.
];

export const PREFIXES_BY_ID: Record<number, AffixDef> = Object.fromEntries(PREFIXES.map((a) => [a.id, a]));
export const SUFFIXES_BY_ID: Record<number, AffixDef> = Object.fromEntries(SUFFIXES.map((a) => [a.id, a]));
export const AUTOMODS_BY_ID: Record<number, AffixDef> = Object.fromEntries(AUTOMODS.map((a) => [a.id, a]));
