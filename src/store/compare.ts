import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_PINS = 3;

interface CompareState {
  pinned: string[];
  togglePin: (id: string) => void;
  clear: () => void;
  isPinned: (id: string) => boolean;
  canAdd: () => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      pinned: [],
      togglePin: (id) =>
        set((s) => {
          if (s.pinned.includes(id)) {
            return { pinned: s.pinned.filter((p) => p !== id) };
          }
          if (s.pinned.length >= MAX_PINS) return s;
          return { pinned: [...s.pinned, id] };
        }),
      clear: () => set({ pinned: [] }),
      isPinned: (id) => get().pinned.includes(id),
      canAdd: () => get().pinned.length < MAX_PINS,
    }),
    { name: "pd2-compare-v1" }
  )
);
