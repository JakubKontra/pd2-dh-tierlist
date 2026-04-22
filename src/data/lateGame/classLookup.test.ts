import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { describe, it, expect } from "vitest";
import { parseLateGame } from "./parse";
import { buildClassLookup } from "./classLookup";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, "__fixtures__/sheet.csv"), "utf8");
const data = parseLateGame(fixture);
const classOf = buildClassLookup(data.classTables);

describe("classLookup — user-reported miscategorizations", () => {
  it("'Summon Amazon' → Amazon", () => {
    expect(classOf("Summon Amazon")).toBe("Amazon");
  });

  it("'Golem Summon' → Necromancer", () => {
    expect(classOf("Golem Summon")).toBe("Necromancer");
  });

  it("'Fire (Volcano/Fissure/Armageddon)' → Druid", () => {
    expect(classOf("Fire (Volcano/Fissure/Armageddon)")).toBe("Druid");
    // Sheet contains "Armaggeddon" typo too — must also resolve
    expect(classOf("Fire (Volcano/Fissure/Armaggeddon) ")).toBe("Druid");
  });

  it("'Bear/Zeal/Jab Barbarian' → Barbarian (not Amazon via /^Jab\\b/)", () => {
    expect(classOf("Bear/Zeal/Jab Barbarian")).toBe("Barbarian");
    expect(classOf("Bear/Zeal/Jab Barbarian ")).toBe("Barbarian");
  });

  it("'Blood Golems' / 'Blood Golem' → Necromancer", () => {
    expect(classOf("Blood Golems")).toBe("Necromancer");
    expect(classOf("Blood Golem")).toBe("Necromancer");
  });
});

describe("classLookup — sanity on each resolution path", () => {
  it("exact table hit: 'Hydra' → Sorceress", () => {
    expect(classOf("Hydra")).toBe("Sorceress");
  });

  it("hyphen-tail split: 'Bear - Maul' → Druid", () => {
    expect(classOf("Bear - Maul")).toBe("Druid");
  });

  it("slash split: 'FOH/Holy Bolt' → Paladin", () => {
    expect(classOf("FOH/Holy Bolt")).toBe("Paladin");
  });

  it("'Fire Golems' / 'Clay Golems' → Necromancer", () => {
    expect(classOf("Fire Golems")).toBe("Necromancer");
    expect(classOf("Clay Golems")).toBe("Necromancer");
  });

  it("'Summon - Ravens/Wolves/Bears' → Druid", () => {
    expect(classOf("Summon - Ravens/Wolves/Bears")).toBe("Druid");
  });

  it("'Summon - Clay Golems/Blood Golems' → Necromancer", () => {
    expect(classOf("Summon - Clay Golems/Blood Golems")).toBe("Necromancer");
  });
});
