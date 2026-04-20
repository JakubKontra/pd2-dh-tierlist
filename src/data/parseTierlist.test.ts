import { describe, it, expect } from "vitest";
import { parseTierlist } from "./parseTierlist";

const SAMPLE_CSV = `S10-13 Tested Build,T3 Map 1,MPM 1,Density 1,(MPM*200)/(D+100) 1,T3 Map 2,MPM 2,Density 2,(MPM*200)/(D+100) 2,T3 Map 3,MPM 3,Density 3,(MPM*200)/(D+100) 3,Top 3 Map Avg. MPM,Top 3 T3 Map Avg. Std. MPM,Top 3 Map Avg. MPM Mean,Tier-Cutoffs,Tiers,Class Mapping Score (7->1),Class Starter Score (7->1),Class Bossing Score (7->1),Class Total Score
Nova (H Lvl 1),Blood Moon,719,125,639.11,Phlegethon,677,136,573.73,Canyon of Sescheron,650,116,601.85,682.00,604.90,531,673.58,S+,Sorceress,Sorceress,Sorceress,Sorceress
Charged Bolt (H Lvl 1),Blood Moon,546,105,532.68,Canyon of Sescheron,470,118,431.19,Phlegethon,504,129,440.17,506.67,468.02,Top 3 Map Avg. MPM Median,649.21,S,1,7,2,10
Chain Lightning (H Lvl 1),Blood Moon,619,122,557.66,Canyon of Sescheron,616,123,552.47,Phlegethon,570,109,545.45,601.67,551.86,531,624.84,S-,Druid,Druid,Druid,Druid
Teleport Thunder Storm (Passive) (H Lvl 1),Blood Moon,559,121,505.88,Canyon of Sescheron,539,132,464.66,Phlegethon,527,109,504.31,541.67,491.61,Top 3 Map Avg. MPM Max,600.47,A+,3,3,5,11
Vengeance (Kingslayer) ,Blood Moon,452,137,381.43,Phlegethon,376,120,341.82,Canyon of Sescheron,504,155,395.29,444.00,372.85,748,576.10,A,Assassin,Assassin,Assassin,Assassin
Frost Nova (H Lvl 1) (RT'd),Blood Moon,680,113,638.50,Phlegethon,668,140,556.67,Canyon of Sescheron,663,128,581.58,670.33,592.25,Top 3 Map Avg. MPM Min,551.73,A-,6,1,4,11
Frozen Orb (H Lvl 1),Blood Moon,673,117,620.28,Phlegethon,591,123,530.04,Canyon of Sescheron,752,145,613.88,672.00,588.07,254,527.36,B+,Barbarian,Barbarian,Barbarian,Barbarian
Ice Barrage (H Lvl 1),Blood Moon,733,121,663.35,Phlegethon,591,124,527.68,Canyon of Sescheron,561,111,531.75,628.33,574.26,Max - Mean (Top Half),502.99,B,2,4,6,12
Blizzard ,Blood Moon (f),741,133,636.05,Phlegethon (f),578,117,532.72,Canyon of Sescheron (f),655,131,567.10,658.00,578.62,217,478.62,B-,Amazon,Amazon,Amazon,Amazon
Glacial Spike,Blood Moon,412,121,372.85,Phlegethon,327,137,275.95,Canyon of Sescheron,317,135,269.79,352.00,306.20,Mean - Min (Bottom Half),450.29,C+,5,2,7,14
Vengeance ,Blood Moon (f),806,149,647.39,Canyon of Sescheron ,577,118,529.36,Phlegethon,566,115,526.51,649.67,567.75,,,,,,,
,,,,,,,,,,,,,,,,,,,,,
Key,,,,,,,,,,,,,,,,,,,,,
"H = Tier Handicap, Lvl 1 = + 1/3rd Tier ",,,,,,,,,,,,,,,,,,,,,`;

describe("parseTierlist", () => {
  const tl = parseTierlist(SAMPLE_CSV);

  it("parses all builds and stops before the key section", () => {
    expect(tl.builds.length).toBe(11);
    expect(tl.builds.find((b) => b.displayName.toLowerCase().startsWith("key"))).toBeUndefined();
  });

  it("extracts handicap", () => {
    const nova = tl.builds.find((b) => b.displayName === "Nova");
    expect(nova?.handicap).toBeCloseTo(1 / 3, 3);
    const spike = tl.builds.find((b) => b.displayName === "Glacial Spike");
    expect(spike?.handicap).toBe(0);
  });

  it("extracts retested flag", () => {
    const fnova = tl.builds.find((b) => b.displayName === "Frost Nova");
    expect(fnova?.retested).toBe(true);
    const nova = tl.builds.find((b) => b.displayName === "Nova");
    expect(nova?.retested).toBeNull();
  });

  it("strips (f) into map.fortified and cleans name", () => {
    const bliz = tl.builds.find((b) => b.displayName === "Blizzard");
    expect(bliz?.maps.every((m) => m.fortified)).toBe(true);
    expect(bliz?.maps[0].name).toBe("Blood Moon");
  });

  it("infers class from build name", () => {
    expect(tl.builds.find((b) => b.displayName === "Nova")?.className).toBe("Sorceress");
    expect(tl.builds.find((b) => b.displayName === "Chain Lightning")?.className).toBe("Sorceress");
    expect(tl.builds.find((b) => b.displayName === "Vengeance (Kingslayer)")?.className).toBe("Paladin");
  });

  it("disambiguates duplicate-named builds with unique ids", () => {
    const vengs = tl.builds.filter((b) => b.displayName.startsWith("Vengeance"));
    expect(vengs.length).toBe(2);
    expect(new Set(vengs.map((v) => v.id)).size).toBe(2);
  });

  it("extracts tier cutoffs from the embedded table", () => {
    const nova = tl.builds.find((b) => b.displayName === "Nova");
    expect(["A+", "S-", "S"]).toContain(nova?.tierAdjusted);
  });

  it("uses col O avgNormalizedMpm", () => {
    const nova = tl.builds.find((b) => b.displayName === "Nova");
    expect(nova?.avgNormalizedMpm).toBeCloseTo(604.9, 1);
    expect(nova?.avgMpm).toBeCloseTo(682, 1);
  });
});
