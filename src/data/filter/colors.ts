// PD2 filter text colors. Keyword form is %NAME% (e.g. %RED%, %GOLD%).
// hex = approximate CSS color for UI preview
// innerHex / avgHex = 2-digit D2 palette codes used by minimap icons (%MAP-XX%, %DOT-XX%, …)

export type ColorDef = {
  keyword: string;        // e.g. "RED"
  label: string;
  hex: string;            // CSS hex for preview
  inner?: string;         // D2 palette index (2 hex chars) for minimap icons
  avg?: string;
  defaultFor?: string;    // human-readable default usage
  custom?: boolean;       // only works w/ Glide or HD text
};

export const COLORS: ColorDef[] = [
  { keyword: "WHITE",      label: "White",      hex: "#ffffff", inner: "1F", avg: "20", defaultFor: "regular items" },
  { keyword: "GRAY",       label: "Gray",       hex: "#888888", inner: "C6", avg: "1D", defaultFor: "regular items (eth / socketed)" },
  { keyword: "BLUE",       label: "Blue",       hex: "#4040ff", inner: "94", avg: "97", defaultFor: "magic items, descriptions" },
  { keyword: "YELLOW",     label: "Yellow",     hex: "#ffff00", inner: "6A", avg: "6D", defaultFor: "rare items" },
  { keyword: "GOLD",       label: "Gold",       hex: "#d4af37", inner: "D3", avg: "53", defaultFor: "unique items, runeword names" },
  { keyword: "GREEN",      label: "Green",      hex: "#00ff00", inner: "7D", avg: "84", defaultFor: "set items" },
  { keyword: "DARK_GREEN", label: "Dark Green", hex: "#007f00", inner: "76", avg: "77" },
  { keyword: "TAN",        label: "Tan",        hex: "#d2b48c", inner: "0E", avg: "5A" },
  { keyword: "BLACK",      label: "Black",      hex: "#000000", inner: "21", avg: "21" },
  { keyword: "PURPLE",     label: "Purple",     hex: "#a020f0", inner: "9B", avg: "9B" },
  { keyword: "RED",        label: "Red",        hex: "#ff3232", inner: "55", avg: "62", defaultFor: "broken/unusable" },
  { keyword: "ORANGE",     label: "Orange",     hex: "#ff8000", inner: "0B", avg: "60", defaultFor: "crafted, quest items, runes" },
  { keyword: "CORAL",      label: "Coral",      hex: "#ff7f50", custom: true },
  { keyword: "SAGE",       label: "Sage",       hex: "#9caf88", custom: true },
  { keyword: "TEAL",       label: "Teal",       hex: "#008080", avg: "9F", custom: true },
  { keyword: "LIGHT_GRAY", label: "Light Gray", hex: "#c8c8c8", custom: true },
];

export const COLORS_BY_KEYWORD: Record<string, ColorDef> = Object.fromEntries(
  COLORS.map((c) => [c.keyword, c])
);

export const COLOR_KEYWORDS = new Set(COLORS.map((c) => c.keyword));

// 1-digit %NOTIFY-X% color codes (wiki: "WHITE, RED, GREEN, BLUE, GOLD, GRAY, BLACK, TAN, ORANGE, YELLOW, DARK_GREEN, PURPLE, GREEN, WHITE, BLACK, WHITE")
export const NOTIFY_COLORS: Record<string, string> = {
  "0": "WHITE",
  "1": "RED",
  "2": "GREEN",
  "3": "BLUE",
  "4": "GOLD",
  "5": "GRAY",
  "6": "BLACK",
  "7": "TAN",
  "8": "ORANGE",
  "9": "YELLOW",
  A: "DARK_GREEN",
  B: "PURPLE",
  C: "GREEN",
  D: "WHITE",
  E: "BLACK",
  F: "WHITE",
};
