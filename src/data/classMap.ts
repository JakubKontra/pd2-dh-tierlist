import type { ClassName } from "./types";

interface Rule {
  pattern: RegExp;
  cls: ClassName;
  priority: number;
}

const rules: Rule[] = [
  { pattern: /Holy Shock Multishot/i, cls: "Paladin", priority: 13 },
  { pattern: /Holy Fire Exp Arrow/i, cls: "Paladin", priority: 13 },
  { pattern: /Zeal Barb/i, cls: "Barbarian", priority: 13 },

  { pattern: /\bSentry\b/i, cls: "Assassin", priority: 10 },
  { pattern: /\bSen\b/i, cls: "Assassin", priority: 10 },
  { pattern: /Death Sentry/i, cls: "Assassin", priority: 10 },
  { pattern: /Blade Fury/i, cls: "Assassin", priority: 10 },
  { pattern: /Blade Sentinel/i, cls: "Assassin", priority: 10 },
  { pattern: /Blade Dance/i, cls: "Assassin", priority: 10 },
  { pattern: /Phoenix Strike/i, cls: "Assassin", priority: 10 },
  { pattern: /Cobra Strike/i, cls: "Assassin", priority: 10 },
  { pattern: /Fists of Fire/i, cls: "Assassin", priority: 10 },
  { pattern: /Claws of Thunder/i, cls: "Assassin", priority: 10 },
  { pattern: /Blades of Ice/i, cls: "Assassin", priority: 10 },
  { pattern: /Tiger Strike/i, cls: "Assassin", priority: 10 },
  { pattern: /Dragon Tail/i, cls: "Assassin", priority: 10 },
  { pattern: /Mind Blast/i, cls: "Assassin", priority: 10 },
  { pattern: /Shock Web/i, cls: "Assassin", priority: 10 },
  { pattern: /Wake of Fire/i, cls: "Assassin", priority: 10 },
  { pattern: /Fire Blast/i, cls: "Assassin", priority: 10 },
  { pattern: /Venom Bow/i, cls: "Assassin", priority: 10 },

  { pattern: /Wind \(Twister/i, cls: "Druid", priority: 10 },
  { pattern: /Wind \(Tornado/i, cls: "Druid", priority: 10 },
  { pattern: /Wind Fury/i, cls: "Druid", priority: 10 },
  { pattern: /Arctic Blast/i, cls: "Druid", priority: 10 },
  { pattern: /Ele Fire/i, cls: "Druid", priority: 10 },
  { pattern: /Shock Wave/i, cls: "Druid", priority: 10 },
  { pattern: /Rabies/i, cls: "Druid", priority: 10 },
  { pattern: /Fire Claws/i, cls: "Druid", priority: 10 },
  { pattern: /^Fury\b/i, cls: "Druid", priority: 10 },
  { pattern: /Maul/i, cls: "Druid", priority: 10 },
  { pattern: /Summon Druid/i, cls: "Druid", priority: 10 },
  { pattern: /Poison Creeper/i, cls: "Druid", priority: 10 },

  { pattern: /^Passive Sorc/i, cls: "Sorceress", priority: 10 },
  { pattern: /^Bear Sorc/i, cls: "Sorceress", priority: 10 },
  { pattern: /^Nova\b/i, cls: "Sorceress", priority: 10 },
  { pattern: /^Frost Nova/i, cls: "Sorceress", priority: 10 },
  { pattern: /^Poison Nova/i, cls: "Necromancer", priority: 11 },
  { pattern: /Charged Bolt\b/i, cls: "Sorceress", priority: 8 },
  { pattern: /Charged Bolt Sentry/i, cls: "Assassin", priority: 11 },
  { pattern: /Thunder Storm/i, cls: "Sorceress", priority: 10 },
  { pattern: /^Chain Lightning\b/i, cls: "Sorceress", priority: 8 },
  { pattern: /Chain Lightning Sen/i, cls: "Assassin", priority: 11 },
  { pattern: /Frozen Orb/i, cls: "Sorceress", priority: 10 },
  { pattern: /Ice Barrage/i, cls: "Sorceress", priority: 10 },
  { pattern: /Blizzard/i, cls: "Sorceress", priority: 10 },
  { pattern: /Glacial Spike/i, cls: "Sorceress", priority: 10 },
  { pattern: /Cold Enchant/i, cls: "Sorceress", priority: 10 },
  { pattern: /Fire Enchant/i, cls: "Sorceress", priority: 10 },
  { pattern: /Combustion/i, cls: "Sorceress", priority: 10 },
  { pattern: /Fire Ball/i, cls: "Sorceress", priority: 10 },
  { pattern: /Meteor/i, cls: "Sorceress", priority: 10 },
  { pattern: /Hydra/i, cls: "Sorceress", priority: 10 },
  { pattern: /^Inferno/i, cls: "Sorceress", priority: 10 },
  { pattern: /Teleport Thunder Storm/i, cls: "Sorceress", priority: 10 },

  { pattern: /Frenzy/i, cls: "Barbarian", priority: 10 },
  { pattern: /Whirlwind/i, cls: "Barbarian", priority: 10 },
  { pattern: /\bWW\b/i, cls: "Barbarian", priority: 10 },
  { pattern: /Leap Attack/i, cls: "Barbarian", priority: 10 },
  { pattern: /Double Throw/i, cls: "Barbarian", priority: 10 },
  { pattern: /Split Throw/i, cls: "Barbarian", priority: 10 },
  { pattern: /Concentrate/i, cls: "Barbarian", priority: 10 },
  { pattern: /Berserk/i, cls: "Barbarian", priority: 10 },
  { pattern: /War Cry/i, cls: "Barbarian", priority: 10 },
  { pattern: /Wolf Barb/i, cls: "Barbarian", priority: 12 },
  { pattern: /Bear Barb/i, cls: "Barbarian", priority: 12 },

  { pattern: /^Poison Strike/i, cls: "Necromancer", priority: 10 },
  { pattern: /^Teeth\b/i, cls: "Necromancer", priority: 10 },
  { pattern: /Bone Spear/i, cls: "Necromancer", priority: 10 },
  { pattern: /Bone Wall/i, cls: "Necromancer", priority: 10 },
  { pattern: /Corpse Explosion/i, cls: "Necromancer", priority: 10 },
  { pattern: /Skele Summon/i, cls: "Necromancer", priority: 10 },
  { pattern: /Goblin Summon/i, cls: "Necromancer", priority: 10 },
  { pattern: /Ele Summon/i, cls: "Necromancer", priority: 10 },
  { pattern: /Pure Phys Revives/i, cls: "Necromancer", priority: 10 },
  { pattern: /Pure Ele Revives/i, cls: "Necromancer", priority: 10 },
  { pattern: /Fire Golems?/i, cls: "Necromancer", priority: 10 },
  { pattern: /Blood Golems?/i, cls: "Necromancer", priority: 10 },
  { pattern: /Clay Golems?/i, cls: "Necromancer", priority: 10 },
  { pattern: /Confuse/i, cls: "Necromancer", priority: 10 },
  { pattern: /Dark Pact/i, cls: "Necromancer", priority: 10 },
  { pattern: /^Desecrate\b/i, cls: "Necromancer", priority: 9 },
  { pattern: /Desecrate Death Sentry/i, cls: "Assassin", priority: 11 },

  { pattern: /Fist of Heavens/i, cls: "Paladin", priority: 10 },
  { pattern: /^FOH\b/i, cls: "Paladin", priority: 10 },
  { pattern: /Holy Bolt/i, cls: "Paladin", priority: 10 },
  { pattern: /Blessed Hammer/i, cls: "Paladin", priority: 10 },
  { pattern: /Sacrifice Hammer/i, cls: "Paladin", priority: 10 },
  { pattern: /Zeal/i, cls: "Paladin", priority: 10 },
  { pattern: /Vengeance/i, cls: "Paladin", priority: 10 },
  { pattern: /Smite/i, cls: "Paladin", priority: 10 },
  { pattern: /Sacrifice/i, cls: "Paladin", priority: 9 },
  { pattern: /Holy Freeze/i, cls: "Paladin", priority: 10 },
  { pattern: /Holy Fire/i, cls: "Paladin", priority: 10 },
  { pattern: /Holy Shock/i, cls: "Paladin", priority: 10 },
  { pattern: /Sanctuary/i, cls: "Paladin", priority: 10 },
  { pattern: /Charge - /i, cls: "Paladin", priority: 10 },
  { pattern: /Physical Charge/i, cls: "Paladin", priority: 10 },
  { pattern: /Beardin/i, cls: "Paladin", priority: 10 },

  { pattern: /Principle Strafe/i, cls: "Amazon", priority: 12 },
  { pattern: /Multishot/i, cls: "Amazon", priority: 12 },
  { pattern: /Multiple Shot/i, cls: "Sorceress", priority: 12 },
  { pattern: /Exp Arrow/i, cls: "Amazon", priority: 12 },
  { pattern: /Thorns Sacrifice/i, cls: "Paladin", priority: 12 },
  { pattern: /Lightning Fury/i, cls: "Amazon", priority: 10 },
  { pattern: /Lightning Strike/i, cls: "Amazon", priority: 10 },
  { pattern: /Power Strike/i, cls: "Amazon", priority: 10 },
  { pattern: /Charged Strike/i, cls: "Amazon", priority: 10 },
  { pattern: /Plague Javelin/i, cls: "Amazon", priority: 10 },
  { pattern: /^Jab\b/i, cls: "Amazon", priority: 10 },
  { pattern: /^Fend\b/i, cls: "Amazon", priority: 10 },
  { pattern: /Bearzon/i, cls: "Amazon", priority: 12 },
  { pattern: /Strafe/i, cls: "Amazon", priority: 10 },
  { pattern: /Crackleshot/i, cls: "Amazon", priority: 12 },
  { pattern: /Freezing Arrow/i, cls: "Amazon", priority: 10 },
  { pattern: /Cold Arrow/i, cls: "Amazon", priority: 10 },
  { pattern: /^Fire Arrow/i, cls: "Amazon", priority: 10 },
  { pattern: /Exploding Arrow/i, cls: "Amazon", priority: 10 },
  { pattern: /Magic Arrow/i, cls: "Amazon", priority: 10 },
  { pattern: /Hybrid Valk/i, cls: "Amazon", priority: 10 },
  { pattern: /Decoy Summon/i, cls: "Amazon", priority: 10 },
];

export function inferClass(buildName: string): ClassName {
  let best: Rule | null = null;
  for (const rule of rules) {
    if (rule.pattern.test(buildName)) {
      if (!best || rule.priority > best.priority) best = rule;
    }
  }
  if (best) return best.cls;
  if (typeof console !== "undefined") {
    console.warn(`[classMap] Unmatched build: "${buildName}"`);
  }
  return "Unknown";
}
