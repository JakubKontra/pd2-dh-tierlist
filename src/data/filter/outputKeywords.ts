// Output keywords used in rule output (text and description).
// This is the non-color keyword set. Colors live in colors.ts.
// Notification keywords live in notificationKeywords.ts.

export type OutputKeywordDef = {
  keyword: string;
  label: string;
  description: string;
  category: OutputKeywordCategory;
};

export type OutputKeywordCategory = "name" | "value" | "formatting" | "requirement" | "dimension";

export const OUTPUT_KEYWORDS: OutputKeywordDef[] = [
  // Name / formatting
  { keyword: "NAME",       label: "Item default name", description: "Item's default appearance - can be modified/replaced", category: "name" },
  { keyword: "BASENAME",   label: "Item base name",    description: "Base name stripped of quality descriptors and color", category: "name" },
  { keyword: "CONTINUE",   label: "Continue to next rule", description: "Stores current output in %NAME% and keeps checking rules", category: "formatting" },
  { keyword: "NL",         label: "New line",           description: "Adds a new line (bottom-up) - works in descriptions and ID'd magic+/runeword/shop item names", category: "formatting" },
  { keyword: "CL",         label: "Conditional new line", description: "New line unless already on one", category: "formatting" },
  { keyword: "CS",         label: "Conditional space", description: "Space unless one is already there", category: "formatting" },

  // Values (item)
  { keyword: "ILVL",       label: "Item level (1..99)",  description: "", category: "value" },
  { keyword: "ALVL",       label: "Affix level (1..99)", description: "Used to determine which affixes can roll", category: "value" },
  { keyword: "CRAFTALVL",  label: "Prospective crafted ALVL", description: "", category: "value" },
  { keyword: "REROLLALVL", label: "Prospective reroll ALVL",  description: "", category: "value" },
  { keyword: "LVLREQ",     label: "Level requirement (0..99)", description: "", category: "requirement" },
  { keyword: "PRICE",      label: "Sell price (1..35000)", description: "", category: "value" },
  { keyword: "SELLPRICE",  label: "Sell price (alias of %PRICE%)", description: "", category: "value" },
  { keyword: "BUYPRICE",   label: "Buy price",           description: "", category: "value" },
  { keyword: "QTY",        label: "Quantity (0..350)",   description: "", category: "value" },
  { keyword: "RANGE",      label: "Melee range adder",   description: "0..5", category: "value" },
  { keyword: "WPNSPD",     label: "Weapon speed modifier", description: "-60..20", category: "value" },
  { keyword: "RUNENUM",    label: "Rune number (0..33)", description: "", category: "value" },
  { keyword: "RUNENAME",   label: "Rune name (e.g. 'Vex')", description: "", category: "value" },
  { keyword: "GEMLEVEL",   label: "Gem quality label",   description: "Chipped, Flawed, Normal, Flawless, Perfect", category: "value" },
  { keyword: "GEMTYPE",    label: "Gem type label",      description: "Amethyst/Diamond/Emerald/Ruby/Sapphire/Topaz/Skull", category: "value" },
  { keyword: "CODE",       label: "Item code",           description: "", category: "value" },
  { keyword: "MAXSOCKETS", label: "Max sockets possible", description: "", category: "value" },

  // Dimensions
  { keyword: "HEIGHT", label: "Inventory height", description: "", category: "dimension" },
  { keyword: "WIDTH",  label: "Inventory width",  description: "", category: "dimension" },
  { keyword: "AREA",   label: "Inventory area",   description: "height × width", category: "dimension" },

  // Requirements
  { keyword: "REQDEX", label: "Required dex",     description: "", category: "requirement" },
  { keyword: "REQSTR", label: "Required str",     description: "", category: "requirement" },
  { keyword: "REQLVL", label: "Required level",   description: "", category: "requirement" },
  { keyword: "UPDEX",  label: "Required dex when upgraded", description: "", category: "requirement" },
  { keyword: "UPSTR",  label: "Required str when upgraded", description: "", category: "requirement" },
  { keyword: "UPLVL",  label: "Required lvl when upgraded", description: "", category: "requirement" },

  // Base damage & armor
  { keyword: "BASEMINONEH",  label: "Base min 1h damage", description: "", category: "value" },
  { keyword: "BASEMINTWOH",  label: "Base min 2h damage", description: "", category: "value" },
  { keyword: "BASEMINTHROW", label: "Base min throw damage", description: "", category: "value" },
  { keyword: "BASEMINKICK",  label: "Base min kick damage",  description: "", category: "value" },
  { keyword: "BASEMINSMITE", label: "Base min smite damage", description: "", category: "value" },
  { keyword: "BASEMAXONEH",  label: "Base max 1h damage", description: "", category: "value" },
  { keyword: "BASEMAXTWOH",  label: "Base max 2h damage", description: "", category: "value" },
  { keyword: "BASEMAXTHROW", label: "Base max throw damage", description: "", category: "value" },
  { keyword: "BASEMAXKICK",  label: "Base max kick damage",  description: "", category: "value" },
  { keyword: "BASEMAXSMITE", label: "Base max smite damage", description: "", category: "value" },
  { keyword: "MAXRES",       label: "Max-all-res cap",    description: "", category: "value" },
  { keyword: "ALLATTRIB",    label: "+X to all stats",    description: "", category: "value" },
  { keyword: "BASEBLOCK",    label: "Base block chance",  description: "", category: "value" },
];

export const OUTPUT_KEYWORDS_SET = new Set(OUTPUT_KEYWORDS.map((k) => k.keyword));
