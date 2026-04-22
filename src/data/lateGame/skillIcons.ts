// Build-name → skill-icon-filename mapping. Build names in DH's sheet are
// fuzzy ("FOH/Holy Bolt", "Wolf - Rabies", "Blade Sentinel/Fury") so this
// normalizes the name, tries an exact match, then falls back to aliases
// for known shorthand. Returns null when no confident match exists — the
// caller should render nothing rather than a broken image.

const ALIASES: Record<string, string> = {
  foh: "Fist_of_the_Heavens",
  "fist of the heavens": "Fist_of_the_Heavens",
  "fists of fire": "Fists_of_Fire",
  "holy bolt": "Holy_Bolt",
  "holy nova": "Holy_Nova",
  "holy light": "Holy_Light",
  "holy fire": "Holy_Fire",
  "holy freeze": "Holy_Freeze",
  "holy shock": "Holy_Shock",
  "blessed hammer": "Blessed_Hammer",
  hammer: "Blessed_Hammer",
  hdin: "Blessed_Hammer",
  sanctuary: "Sanctuary",
  charge: "Charge",
  zeal: "Zeal",
  smite: "Smite",
  vengeance: "Vengeance",
  conviction: "Conviction",

  hydra: "Hydra",
  meteor: "Meteor",
  blizzard: "Blizzard",
  "blizzard ": "Blizzard",
  "frozen orb": "Frozen_Orb",
  "ice barrage": "Ice_Barrage",
  "ice blast": "Ice_Blast",
  "ice bolt": "Ice_Bolt",
  "glacial spike": "Glacial_Spike",
  "frost nova": "Frost_Nova",
  "chilling armor": "Chilling_Armor",
  "shiver armor": "Shiver_Armor",
  "cold enchant": "Cold_Enchant",
  "fire ball": "Fire_Ball",
  "fire bolt": "Fire_Bolt",
  "fire wall": "Fire_Wall",
  "fire arrow": "Fire_Arrow",
  "cold arrow": "Cold_Arrow",
  "ice arrow": "Ice_Arrow",
  "magic arrow": "Magic_Arrow",
  "guided arrow": "Guided_Arrow",
  "multiple shot": "Multiple_Shot",
  "multi shot": "Multiple_Shot",
  "exploding arrow": "Exploding_Arrow",
  "freezing arrow": "Freezing_Arrow",
  "immolation arrow": "Immolation_Arrow",
  "immolation/exploding arrow": "Immolation_Arrow",
  "fire arrow/exploding arrow": "Fire_Arrow",
  strafe: "Strafe",
  inferno: "Inferno",
  combustion: "Combustion",
  "inferno/fire wall": "Inferno",
  "combustion/fire ball": "Combustion",
  firestorm: "Firestorm",
  nova: "Nova",
  "charged bolt": "Charged_Bolt",
  "chain lightning": "Chain_Lightning",
  lightning: "Lightning",
  "thunder storm": "Thunder_Storm",
  "teleport thunder storm": "Thunder_Storm",
  "teleport thunder storm (passive)": "Thunder_Storm",
  enchantress: "Enchant_Fire",

  jab: "Jab",
  fend: "Fend",
  "lightning fury": "Lightning_Fury",
  "lightning strike": "Lightning_Strike",
  "lightning bolt": "Lightning_Bolt",
  "lightning bolt/fury": "Lightning_Bolt",
  "power strike": "Power_Strike",
  "charged strike": "Charged_Strike",
  "plague javelin": "Plague_Javelin",
  "poison javelin": "Poison_Javelin",
  "poison/plague javelin": "Plague_Javelin",
  "lightning strike/charged strike": "Lightning_Strike",
  "lightning/chain lightning": "Chain_Lightning",
  "chain lightning/lightning sentry": "Chain_Lightning",
  valkyrie: "Valkyrie",
  decoy: "Decoy",
  "summon zon": "Valkyrie",

  werebear: "Werebear",
  werewolf: "Werewolf",
  maul: "Maul",
  fury: "Fury",
  "fire claws": "Fire_Claws",
  rabies: "Rabies",
  "feral rage": "Feral_Rage",
  tornado: "Tornado",
  twister: "Twister",
  hurricane: "Hurricane",
  "arctic blast": "Arctic_Blast",
  "arctic blast/hurricane": "Arctic_Blast",
  "wind - tornado/twister": "Tornado",
  volcano: "Volcano",
  "molten boulder": "Molten_Boulder",
  fissure: "Fissure",
  armageddon: "Armageddon",
  "poison creeper": "Poison_Creeper",
  "poison creeper/rabies": "Rabies",
  "carrion vine": "Carrion_Vine",
  "solar creeper": "Solar_Creeper",
  "oak sage": "Oak_Sage",
  "heart of wolverine": "Heart_of_Wolverine",
  "spirit of barbs": "Spirit_of_Barbs",
  "summon dire wolf": "Summon_Dire_Wolf",
  "summon spirit wolf": "Summon_Spirit_Wolf",
  "summon grizzly": "Summon_Grizzly",
  "bear - maul": "Maul",
  "bear - shockwave": "Shock_Wave",
  "wolf - rabies": "Rabies",
  "wolf - fury": "Fury",
  "wolf - fire claws": "Fire_Claws",

  teeth: "Teeth",
  "bone spear": "Bone_Spear",
  "bone spirit": "Bone_Spirit",
  "bone spear/spirit": "Bone_Spear",
  "bone wall": "Bone_Wall",
  "bone armor": "Bone_Armor",
  "bone prison": "Bone_Prison",
  "corpse explosion": "Corpse_Explosion",
  desecrate: "Desecrate",
  "desecrate ": "Desecrate",
  "poison strike": "Poison_Strike",
  "poison strike ": "Poison_Strike",
  "poison nova": "Poison_Nova",
  "dark pact": "Dark_Pact",
  "lower resist": "Lower_Resist",
  confuse: "Confuse",
  decrepify: "Decrepify",
  "iron maiden": "Iron_Maiden",
  "amplify damage": "Amplify_Damage",
  weaken: "Weaken",
  terror: "Terror",
  "dim vision": "Dim_Vision",
  life_tap: "Life_Tap",
  attract: "Attract",
  revive: "Revive",
  "clay golem": "Clay_Golem",
  "clay golems": "Clay_Golem",
  "blood golem": "Blood_Golem",
  "blood golems": "Blood_Golem",
  "iron golem": "Iron_Golem",
  "iron golems": "Iron_Golem",
  "fire golem": "Fire_Golem",
  "fire golems": "Fire_Golem",
  "raise skeleton": "Raise_Skeleton",
  "raise skeletal mage": "Raise_Skeletal_Mage",
  "physical skele summon": "Raise_Skeleton",
  "physical skele summon (warriors + archers)": "Raise_Skeleton",
  "green goblin": "Raise_Skeleton",
  "green goblin (demon machine merc + physical skeles)": "Raise_Skeleton",
  "pure phys revive (eternity + st - moon lords)": "Revive",
  "pure ele revive (eternity + st - gloams/souls)": "Revive",
  "elemental summoner (mage skeles + ele revives)": "Raise_Skeletal_Mage",

  "blade sentinel": "Blade_Sentinel",
  "blade sentinel/fury": "Blade_Sentinel",
  "blade fury": "Blade_Fury",
  "blade fury/sentinel": "Blade_Fury",
  "blade dance": "Blade_Sentinel",
  "blade shield": "Blade_Shield",
  "blades of ice": "Blades_of_Ice",
  "death sentry": "Death_Sentry",
  "lightning sentry": "Lightning_Sentry",
  "lightning sentry/chain": "Lightning_Sentry",
  "chain lightning sentry": "Chain_Lightning_Sentry",
  "charged bolt sentry": "Charged_Bolt_Sentry",
  "fire blast": "Fire_Blast",
  "shock web": "Shock_Web",
  "wake of fire": "Wake_of_Fire",
  "wake of inferno": "Wake_of_Inferno",
  "wake of fire/inferno": "Wake_of_Fire",
  "wake of inferno/fire": "Wake_of_Inferno",
  "phoenix strike": "Phoenix_Strike",
  "claws of thunder": "Claws_of_Thunder",
  "cobra strike": "Cobra_Strike",
  "tiger strike": "Tiger_Strike",
  "dragon tail": "Dragon_Tail",
  "dragon talon": "Dragon_Talon",
  "dragon claw": "Dragon_Claw",
  "dragon flight": "Dragon_Flight",
  "dragon tail/talon": "Dragon_Tail",
  "dragon tail/dragon talon": "Dragon_Tail",
  "mind blast": "Mind_Blast",
  "mind blast/psychic hammer": "Mind_Blast",
  "psychic hammer": "Psychic_Hammer",
  "cloak of shadows": "Cloak_of_Shadows",
  "shadow master": "Shadow_Master",
  "shadow warrior": "Shadow_Warrior",

  frenzy: "Frenzy",
  whirlwind: "Whirlwind",
  "whirlwind (2-h)": "Whirlwind",
  "whirlwind (2x 1-h)": "Whirlwind",
  "fire whirlwind (2x flamebellow)": "Whirlwind",
  "magic whirlwind (2x asylum)": "Whirlwind",
  concentrate: "Concentrate",
  berserk: "Berserk",
  bash: "Bash",
  "double throw": "Double_Throw",
  "double swing": "Double_Swing",
  "split throw": "Double_Throw",
  "leap attack": "Leap_Attack",
  leap: "Leap",
  "war cry": "War_Cry",
  "war cry/support": "War_Cry",
  shout: "Shout",
  howl: "Howl",
  "battle orders": "Battle_Orders",
  "battle cry": "Battle_Cry",

  sacrifice: "Sacrifice",
  "holy shock sacrifice": "Holy_Shock",
  "holy shock sacrifice (native aura)": "Holy_Shock",
  "holy fire sacrifice (native aura)": "Holy_Fire",
  "holy freeze sacrifice (native aura)": "Holy_Freeze",
  "sanctuary sacrifice (native aura) (redeemer)": "Sanctuary",
  "sanctuary sacrifice": "Sanctuary",
  "physical sacrifice": "Sacrifice",
  "physical sacrifice (1-h) (schaeffer's)": "Sacrifice",
  "physical sacrifice (2-h) (leoric's)": "Sacrifice",
  "thorns sacrifice (silence + bramble)": "Thorns",
};

// Known skill filenames on disk (derived from pd2-tools/web/public/icons).
// Kept as a Set so `titleCase(name).png` can be checked without filesystem
// access at runtime.
const KNOWN: Set<string> = new Set([
  "Amplify_Damage","Arctic_Blast","Armageddon","Attract","Bash","Battle_Command","Battle_Cry","Battle_Orders",
  "Berserk","Blade_Fury","Blade_Sentinel","Blade_Shield","Blades_of_Ice","Blaze","Blessed_Aim","Blessed_Hammer",
  "Blizzard","Blood_Golem","Blood_Warp","Bone_Armor","Bone_Prison","Bone_Spear","Bone_Spirit","Bone_Wall",
  "Burst_of_Speed","Carrion_Vine","Chain_Lightning","Chain_Lightning_Sentry","Charge","Charged_Bolt",
  "Charged_Bolt_Sentry","Charged_Strike","Chilling_Armor","Claw_Mastery","Claws_of_Thunder","Clay_Golem",
  "Cleansing","Cloak_of_Shadows","Cobra_Strike","Cold_Arrow","Cold_Enchant","Cold_Mastery","Combat_Reflexes",
  "Combustion","Concentrate","Concentration","Confuse","Conviction","Corpse_Explosion","Critical_Strike",
  "Curse_Mastery","Cyclone_Armor","Dark_Pact","Death_Sentry","Decoy","Decrepify","Deep_Wounds","Defiance",
  "Desecrate","Dim_Vision","Dodge","Double_Swing","Double_Throw","Dragon_Claw","Dragon_Flight","Dragon_Tail",
  "Dragon_Talon","Enchant_Fire","Energy_Shield","Evade","Exploding_Arrow","Fade","Fanaticism","Fend",
  "Feral_Rage","Find_Item","Find_Potion","Fire_Arrow","Fire_Ball","Fire_Blast","Fire_Bolt","Fire_Claws",
  "Fire_Golem","Fire_Mastery","Fire_Wall","Firestorm","Fissure","Fist_of_the_Heavens","Fists_of_Fire",
  "Freezing_Arrow","Frenzy","Frost_Nova","Frozen_Orb","Fury","General_Mastery","Glacial_Spike",
  "Golem_Mastery","Grim_Ward","Guided_Arrow","Gust","Heart_of_Wolverine","Holy_Bolt","Holy_Fire",
  "Holy_Freeze","Holy_Light","Holy_Nova","Holy_Shield","Holy_Shock","Holy_Sword","Howl","Hunger","Hurricane",
  "Hydra","Ice_Arrow","Ice_Barrage","Ice_Blast","Ice_Bolt","Immolation_Arrow","Increased_Speed","Inferno",
  "Inner_Sight","Iron_Golem","Iron_Maiden","Iron_Skin","Jab","Javelin_and_Spear_Mastery","Joust","Leap",
  "Leap_Attack","Lesser_Hydra","Life_Tap","Lightning","Lightning_Bolt","Lightning_Fury","Lightning_Mastery",
  "Lightning_Sentry","Lightning_Strike","Lower_Resist","Lycanthropy","Magic_Arrow","Maul","Meditation",
  "Meteor","Might","Mind_Blast","Molten_Boulder","Multiple_Shot","Natural_Resistance","Nova","Oak_Sage",
  "Penetrate","Phoenix_Strike","Pierce","Plague_Javelin","Poison_Creeper","Poison_Javelin","Poison_Nova",
  "Poison_Strike","Pole_Arm_and_Spear_Mastery","Power_Strike","Prayer","Psychic_Hammer","Rabies",
  "Raise_Skeletal_Mage","Raise_Skeleton","Raise_Skeleton_Archer","Raven","Redemption","Resist_Cold",
  "Resist_Fire","Resist_Lightning","Revive","Sacrifice","Salvation","Sanctuary","Shadow_Master",
  "Shadow_Warrior","Shiver_Armor","Shock_Wave","Shock_Web","Shout","Skeleton_Mastery","Slow_Movement",
  "Smite","Solar_Creeper","Spirit_of_Barbs","Static_Field","Strafe","Stun","Summon_Dire_Wolf",
  "Summon_Grizzly","Summon_Spirit_Wolf","Taunt","Teeth","Telekinesis","Teleport","Terror","Thorns",
  "Throwing_Mastery","Thunder_Storm","Tiger_Strike","Tornado","Twister","Valkyrie","Vengeance","Venom",
  "Vigor","Volcano","Wake_of_Fire","Wake_of_Inferno","War_Cry","Warmth","Weaken","Weapon_Block",
  "Werebear","Werewolf","Whirlwind","Zeal",
]);

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function stripParens(raw: string): string {
  return raw.replace(/\([^)]*\)/g, "").trim();
}

function toFilename(name: string): string {
  return name.replace(/\s+/g, "_");
}

function titleCase(parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((p) => (p.length <= 2 ? p.toUpperCase() : p[0].toUpperCase() + p.slice(1)))
    .join("_");
}

function stripTrailingS(word: string): string {
  // Conservative de-plural: only strip a trailing "s" if the singular form
  // leaves a reasonable word. Prevents "Bas" / "Gas" from being broken.
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

export function skillIconFor(buildName: string): string | null {
  const norm = normalize(buildName);
  const noParens = normalize(stripParens(buildName));

  // Try alias table first (handles compound names "foh/holy bolt")
  if (ALIASES[norm]) return `/icons/skills/${ALIASES[norm]}.png`;
  if (ALIASES[noParens]) return `/icons/skills/${ALIASES[noParens]}.png`;

  // Try direct match on the stripped name
  const asFile = toFilename(
    noParens.replace(/[/,].*$/, "").trim() // first "/"- or ","-separated segment
  );
  const parts = asFile.split("_").filter(Boolean);
  const titled = titleCase(parts);
  if (KNOWN.has(titled)) return `/icons/skills/${titled}.png`;

  // De-plural fallback: "Fire Golems" → "Fire Golem" → Fire_Golem.png
  if (parts.length >= 2) {
    const lastSingular = stripTrailingS(parts[parts.length - 1]);
    const depluralized = titleCase([...parts.slice(0, -1), lastSingular]);
    if (depluralized !== titled && KNOWN.has(depluralized)) {
      return `/icons/skills/${depluralized}.png`;
    }
  }

  // Last fallback: match first word
  const first = parts[0];
  if (first) {
    const firstTitle = first[0].toUpperCase() + first.slice(1);
    if (KNOWN.has(firstTitle)) return `/icons/skills/${firstTitle}.png`;
  }
  return null;
}
