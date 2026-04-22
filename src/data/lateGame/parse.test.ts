import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { describe, it, expect } from "vitest";
import { parseLateGame } from "./parse";
import { CLASSES_IN_SHEET } from "./anchors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, "__fixtures__/sheet.csv"), "utf8");
const data = parseLateGame(fixture);

describe("parseLateGame", () => {
  it("parses every class into a non-empty table", () => {
    for (const cls of CLASSES_IN_SHEET) {
      const t = data.classTables.find((x) => x.className === cls);
      expect(t, `missing table for ${cls}`).toBeDefined();
      const buildCount = t!.rows.filter((r) => r.kind === "build").length;
      expect(buildCount, `${cls} should have builds`).toBeGreaterThan(5);
    }
  });

  it("parses build rows with a valid tier on most entries", () => {
    const allBuilds = data.classTables.flatMap((t) =>
      t.rows.flatMap((r) => (r.kind === "build" ? [r] : []))
    );
    expect(allBuilds.length).toBeGreaterThan(100);
    const withTier = allBuilds.filter((b) => b.tier !== null);
    expect(withTier.length / allBuilds.length).toBeGreaterThan(0.9);
  });

  it("parses flag cells into the Flag enum", () => {
    const sorc = data.classTables.find((t) => t.className === "Sorceress")!;
    const nova = sorc.rows.find(
      (r) => r.kind === "build" && r.name === "Nova"
    );
    expect(nova?.kind).toBe("build");
    if (nova?.kind === "build") {
      expect(nova.tier).toBe("S-");
      expect(nova.fortify).toBe("none");
      expect(nova.budget).toBe("none");
      expect(nova.hardcore).toBe("ok");
      expect(nova.t1t2).toBe("good");
    }
  });

  it("extracts subtree rows as kind=subtree", () => {
    const sorc = data.classTables.find((t) => t.className === "Sorceress")!;
    const trees = sorc.rows.filter((r) => r.kind === "subtree").map((r) => r.name);
    expect(trees).toContain("Lightning Tree");
    expect(trees).toContain("Cold Tree");
    expect(trees).toContain("Fire Tree");
  });

  it("parses Solo Mapping Top 10 with 10 entries and valid tiers", () => {
    const topN = data.rankings.find((r) => r.title === "Solo Mapping Top 10");
    expect(topN).toBeDefined();
    expect(topN!.entries.length).toBeGreaterThanOrEqual(10);
    const withTier = topN!.entries.filter((e) => e.tier !== null);
    expect(withTier.length).toBeGreaterThanOrEqual(10);
  });

  it("parses all 5 boss lineups with class groups", () => {
    const titles = data.bossLineups.map((b) => b.title);
    expect(titles).toContain("DH's Recommended Uber Tristram Builds");
    expect(titles).toContain("DH's Recommended Dclone Killers");
    expect(titles).toContain("DH's Recommended Rathma Killers");
    expect(titles).toContain("DH's Recommended Lucion Killers");
    expect(titles).toContain("DH's Starter Line-up (Recommended Starter Builds)");
  });

  it("parses map immunities with 3 tier buckets", () => {
    expect(data.mapImmunities.tiers.length).toBe(3);
    for (const t of data.mapImmunities.tiers) {
      expect(t.maps.length).toBeGreaterThan(0);
      for (const m of t.maps) {
        expect(m.name.length).toBeGreaterThan(0);
      }
    }
    expect(data.mapImmunities.footnote).toMatch(/Fire Towers/);
  });

  it("parses movers with from/to tiers and arrow separator", () => {
    expect(data.movers).not.toBeNull();
    const movers = data.movers!;
    expect(movers.entries.length).toBeGreaterThan(5);
    for (const m of movers.entries) {
      expect(m.from).not.toBeNull();
      expect(m.to).not.toBeNull();
    }
  });

  it("parses legend with >= 20 rows", () => {
    expect(data.legend.length).toBeGreaterThanOrEqual(20);
  });
});
