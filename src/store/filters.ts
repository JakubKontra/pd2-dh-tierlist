import { create } from "zustand";
import type { ClassName, Season } from "../data/types";

export type RetestedFilter = "all" | "retested" | "not-retested";
export type SeasonFilter = Season | "all";

interface FilterState {
  classFilter: ClassName | "All";
  search: string;
  applyHandicap: boolean;
  retestedFilter: RetestedFilter;
  seasonFilter: SeasonFilter;
  setClassFilter: (c: ClassName | "All") => void;
  setSearch: (s: string) => void;
  setApplyHandicap: (b: boolean) => void;
  setRetestedFilter: (f: RetestedFilter) => void;
  setSeasonFilter: (f: SeasonFilter) => void;
  reset: () => void;
}

export const useFilters = create<FilterState>((set) => ({
  classFilter: "All",
  search: "",
  applyHandicap: true,
  retestedFilter: "all",
  seasonFilter: "all",
  setClassFilter: (classFilter) => set({ classFilter }),
  setSearch: (search) => set({ search }),
  setApplyHandicap: (applyHandicap) => set({ applyHandicap }),
  setRetestedFilter: (retestedFilter) => set({ retestedFilter }),
  setSeasonFilter: (seasonFilter) => set({ seasonFilter }),
  reset: () =>
    set({
      classFilter: "All",
      search: "",
      applyHandicap: true,
      retestedFilter: "all",
      seasonFilter: "all",
    }),
}));
