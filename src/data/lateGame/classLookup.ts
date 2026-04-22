import type { ClassName } from "../types";
import { inferClass } from "../classMap";
import type { ClassTable } from "./types";

function normalize(raw: string): string {
  return raw.toLowerCase().replace(/\s+/g, " ").trim();
}

// Boss-lineup / Top-10 shorthand that never appears in a per-class table.
// Matched against the full normalized name first, then against substrings.
// Add a new entry here when a name in a mixed list shows the wrong color.
const MANUAL_OVERRIDES: Array<{ match: string | RegExp; cls: ClassName }> = [
  { match: "summon amazon", cls: "Amazon" },
  { match: "summon zon", cls: "Amazon" },
  { match: "summon - decoys/valks + strafe", cls: "Amazon" },
  { match: /\bbarbarian\b/, cls: "Barbarian" },
  { match: /\bbarb\b/, cls: "Barbarian" },
  { match: "golem summon", cls: "Necromancer" },
  { match: /\bgolems?\b/, cls: "Necromancer" },
  { match: /^summon\s*-\s*(clay|blood|fire|iron) golems?/, cls: "Necromancer" },
  { match: /^summon\s*-\s*(skeletal|skele|mage|phys)/, cls: "Necromancer" },
  { match: /^summon\s*-\s*revives?/, cls: "Necromancer" },
  { match: /^summon\s*-\s*(ravens|wolves|bears)/, cls: "Druid" },
  { match: /^summon\s*\(bears|^summon\s*\(raven|^summon\s*\(4x bears/, cls: "Druid" },
  { match: /^fire\s*\(volcano|fissure|armageddon|armaggeddon/, cls: "Druid" },
  { match: /^wind\s*-\s*/, cls: "Druid" },
  { match: /^bear\s*-\s*/, cls: "Druid" },
  { match: /^wolf\s*-\s*/, cls: "Druid" },
  { match: /shockwave \(max oak sage\)/, cls: "Druid" },
  { match: /max oak sage/, cls: "Druid" },
  { match: /deep wounds/, cls: "Barbarian" },
  { match: /max battle cry/, cls: "Barbarian" },
  { match: /enchantress/, cls: "Sorceress" },
  { match: /bone spear\/spirit/, cls: "Necromancer" },
  { match: /teeth\/bone spear/, cls: "Necromancer" },
  { match: /desecrate\/poison strike/, cls: "Necromancer" },
  { match: /poison strike\/desecrate/, cls: "Necromancer" },
  { match: /fist of the heavens\/holy bolt/, cls: "Paladin" },
  { match: /^foh\//, cls: "Paladin" },
  { match: /holy bolt/, cls: "Paladin" },
];

function overrideFor(name: string): ClassName | null {
  const norm = normalize(name);
  for (const o of MANUAL_OVERRIDES) {
    if (typeof o.match === "string") {
      if (norm === o.match) return o.cls;
    } else if (o.match.test(norm)) {
      return o.cls;
    }
  }
  return null;
}

export type ClassLookup = (buildName: string) => ClassName;

export function buildClassLookup(tables: ClassTable[]): ClassLookup {
  // Authoritative map from per-class tables: every build listed under a
  // Sorceress header is a Sorceress skill, etc.
  const exact = new Map<string, ClassName>();
  for (const t of tables) {
    for (const row of t.rows) {
      if (row.kind !== "build") continue;
      exact.set(normalize(row.name), t.className);
    }
  }
  return (name: string) => {
    const norm = normalize(name);

    // 1. Manual overrides win — they handle the fuzzy shorthand in boss lineups
    //    ("Bear/Zeal/Jab Barbarian", "Fire (Volcano/Fissure/Armageddon)", etc.)
    //    that would otherwise get mis-inferred by pattern matching on leading tokens.
    const override = overrideFor(name);
    if (override) return override;

    // 2. Exact hit in an authoritative per-class table
    const hit = exact.get(norm);
    if (hit) return hit;

    // 3. Slashed names like "FOH/Holy Bolt" — try each segment
    if (norm.includes("/")) {
      for (const seg of norm.split("/")) {
        const s = exact.get(seg.trim());
        if (s) return s;
      }
    }

    // 4. Hyphen splits like "Bear - Maul", "Wolf - Rabies"
    if (norm.includes(" - ")) {
      const tail = norm.split(" - ").pop();
      if (tail) {
        const s = exact.get(tail.trim());
        if (s) return s;
      }
    }

    // 5. Last resort: pattern-based inference from existing MPM tierlist module
    return inferClass(name);
  };
}
