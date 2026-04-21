export type Season = "S13" | "S12" | "S11" | "S10";

export interface SeasonMeta {
  id: Season;
  name: string;
  sheetFontColor: string;
  displayColor: string;
  note: string;
}

export const SEASONS: SeasonMeta[] = [
  {
    id: "S13",
    name: "Season 13 — Betrayal",
    sheetFontColor: "tan",
    displayColor: "#d4af37",
    note: "Current season. Most builds in the sheet — reflects post-beta balance.",
  },
  {
    id: "S12",
    name: "Season 12",
    sheetFontColor: "green",
    displayColor: "#5fb33d",
    note: "Previous-season carryover. MPM numbers still reflect S12 patch balance.",
  },
  {
    id: "S11",
    name: "Season 11",
    sheetFontColor: "orange",
    displayColor: "#e6943c",
    note: "Two-season carryover. Use with caution if balance has shifted.",
  },
  {
    id: "S10",
    name: "Season 10",
    sheetFontColor: "white",
    displayColor: "#b8b8b8",
    note: "Oldest carryover entries.",
  },
];

export function seasonById(id: Season): SeasonMeta | undefined {
  return SEASONS.find((s) => s.id === id);
}
