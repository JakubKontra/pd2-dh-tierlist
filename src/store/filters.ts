import { create } from "zustand";
import type { ClassName } from "../data/types";

export type RetestedFilter = "all" | "retested" | "not-retested";

interface FilterState {
  classFilter: ClassName | "All";
  search: string;
  applyHandicap: boolean;
  retestedFilter: RetestedFilter;
  setClassFilter: (c: ClassName | "All") => void;
  setSearch: (s: string) => void;
  setApplyHandicap: (b: boolean) => void;
  setRetestedFilter: (f: RetestedFilter) => void;
  reset: () => void;
}

export const useFilters = create<FilterState>((set) => ({
  classFilter: "All",
  search: "",
  applyHandicap: true,
  retestedFilter: "all",
  setClassFilter: (classFilter) => set({ classFilter }),
  setSearch: (search) => set({ search }),
  setApplyHandicap: (applyHandicap) => set({ applyHandicap }),
  setRetestedFilter: (retestedFilter) => set({ retestedFilter }),
  reset: () =>
    set({
      classFilter: "All",
      search: "",
      applyHandicap: true,
      retestedFilter: "all",
    }),
}));
