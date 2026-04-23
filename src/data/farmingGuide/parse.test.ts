import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { describe, it, expect } from "vitest";
import { parseFarmingGuide } from "./parse";
import { CLASSES_IN_SHEET } from "./anchors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, "__fixtures__/guide.csv"), "utf8");
const data = parseFarmingGuide(fixture);

describe("parseFarmingGuide", () => {
  it("parses every class with a mobility and at least 1 build", () => {
    for (const cls of CLASSES_IN_SHEET) {
      const g = data.builds.find((b) => b.className === cls);
      expect(g, `missing group for ${cls}`).toBeDefined();
      expect(g!.mobility).toMatch(/^(Low|Medium|High)$/);
      expect(g!.builds.length, `${cls} should have builds`).toBeGreaterThan(0);
    }
  });

  it("parses Sorceress builds including known entries", () => {
    const sorc = data.builds.find((b) => b.className === "Sorceress")!;
    expect(sorc.mobility).toBe("High");
    const names = sorc.builds.map((b) => b.name);
    expect(names).toContain("Frozen Orb");
    expect(names).toContain("Meteor");
    const meteor = sorc.builds.find((b) => b.name === "Meteor")!;
    expect(meteor.damageTypes).toEqual(["Fire", "Physical"]);
  });

  it("parses all 6 act sections", () => {
    const acts = data.acts.map((a) => a.act);
    expect(acts).toEqual(["Act 1", "Act 2", "Act 3", "Act 4", "Act 5", "UBERS"]);
  });

  it("parses Pit as an Act 1 area with expected metadata", () => {
    const act1 = data.acts.find((a) => a.act === "Act 1")!;
    const pit = act1.areas.find((a) => a.name === "Pit")!;
    expect(pit.difficulty).toBe("Low");
    expect(pit.magicFind).toBe("Yes");
    expect(pit.mobility).toBe("Medium");
    expect(pit.rank).toBe(2);
    expect(pit.bestDamageTypes).toContain("Physical");
    expect(pit.bestDamageTypes).toContain("Magic");
  });

  it("parses UBERS section with a Very High difficulty entry", () => {
    const ubers = data.acts.find((a) => a.act === "UBERS")!;
    expect(ubers.areas.length).toBeGreaterThan(0);
    const hasVeryHigh = ubers.areas.some((a) => a.difficulty === "Very High");
    expect(hasVeryHigh).toBe(true);
  });

  it("parses STEP 0 through STEP 4 in solo progression", () => {
    const headings = data.progression.map((p) => p.heading);
    expect(headings).toContain("STEP 0");
    expect(headings).toContain("STEP 1");
    expect(headings).toContain("STEP 2");
    expect(headings).toContain("STEP 3");
    expect(headings).toContain("STEP 4");
    expect(headings).toContain("CONSIDER");
  });

  it("parses the column legend with the documented titles", () => {
    const titles = data.legend.map((l) => l.title);
    expect(titles).toContain("Difficulty");
    expect(titles).toContain("Magic Find?");
    expect(titles).toContain("Item Type");
    expect(titles).toContain("Best Damage Types");
    expect(titles).toContain("Rank");
  });

  it("parses 4 steps in Solo Self-Found Progression", () => {
    const headings = data.soloSelfFound.map((p) => p.heading);
    expect(headings).toEqual(["STEP 1", "STEP 2", "STEP 3", "STEP 4"]);
  });
});
