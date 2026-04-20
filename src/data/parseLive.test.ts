import { describe, it, expect } from "vitest";
import { parseTierlist } from "./parseTierlist";
import { CLASSES, type ClassName } from "./types";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1ipTsARndewEJaREWfcDeuCelKWpCEcFy9nrigp220_Y/export?format=csv&gid=0";

describe("parseTierlist against live sheet", () => {
  it("parses the real sheet with no unknown classes and reasonable counts", async () => {
    const res = await fetch(CSV_URL, { redirect: "follow" });
    expect(res.ok).toBe(true);
    const csv = await res.text();
    const tl = parseTierlist(csv);

    expect(tl.builds.length).toBeGreaterThan(100);
    expect(tl.builds.length).toBeLessThan(150);

    const byClass: Record<string, number> = {};
    for (const b of tl.builds) {
      byClass[b.className] = (byClass[b.className] ?? 0) + 1;
    }

    for (const c of CLASSES as readonly ClassName[]) {
      expect(byClass[c] ?? 0).toBeGreaterThan(0);
    }

    const unknowns = tl.builds.filter((b) => b.className === "Unknown");
    if (unknowns.length > 0) {
      console.log(
        "Unknown builds:",
        unknowns.map((b) => b.displayName)
      );
    }
    expect(unknowns.length).toBe(0);

    const tiers = new Set(tl.builds.map((b) => b.tierAdjusted));
    expect(tiers.size).toBeGreaterThan(3);
  }, 30_000);
});
