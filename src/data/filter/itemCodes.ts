// PD2 Item codes - 3-4 char codes used in filter conditions.
// Source: https://wiki.projectdiablo2.com/wiki/Item_Codes
//
// Each entry: [code, name, tier?]
// Tier is "norm" | "exc" | "elt" for armor/weapons with exceptional/elite variants.

export type ItemTier = "norm" | "exc" | "elt";

export type ItemCodeDef = {
  code: string;
  name: string;
  category: ItemCategory;
  subcategory?: string;
  tier?: ItemTier;
};

export type ItemCategory =
  | "armor"
  | "weapon"
  | "circlet"
  | "class-helm"
  | "class-shield"
  | "jewelry"
  | "charm"
  | "quiver"
  | "rune"
  | "gem"
  | "potion"
  | "throwing-potion"
  | "scroll"
  | "tome"
  | "misc"
  | "quest"
  | "map"
  | "arena"
  | "map-modifier"
  | "general-purpose"
  | "uber-related";

// --- Armor (Helms, Chests, Shields, Gloves, Boots, Belts) ---
// Normal / Exceptional / Elite triplets taken from the wiki tables
const ARMOR: ReadonlyArray<readonly [string, string, ItemCategory, string, ItemTier]> = [
  // Helms
  ["cap","Cap","armor","helm","norm"],      ["xap","War Hat","armor","helm","exc"],         ["uap","Shako","armor","helm","elt"],
  ["skp","Skull Cap","armor","helm","norm"],["xkp","Sallet","armor","helm","exc"],          ["ukp","Hydraskull","armor","helm","elt"],
  ["hlm","Helm","armor","helm","norm"],     ["xlm","Casque","armor","helm","exc"],          ["ulm","Armet","armor","helm","elt"],
  ["fhl","Full Helm","armor","helm","norm"],["xhl","Basinet","armor","helm","exc"],         ["uhl","Giant Conch","armor","helm","elt"],
  ["msk","Mask","armor","helm","norm"],     ["xsk","Death Mask","armor","helm","exc"],      ["usk","Demonhead","armor","helm","elt"],
  ["bhm","Bone Helm","armor","helm","norm"],["xh9","Grim Helm","armor","helm","exc"],       ["uh9","Bone Visage","armor","helm","elt"],
  ["ghm","Great Helm","armor","helm","norm"],["xhm","Winged Helm","armor","helm","exc"],    ["uhm","Spired Helm","armor","helm","elt"],
  ["crn","Crown","armor","helm","norm"],    ["xrn","Grand Crown","armor","helm","exc"],     ["urn","Corona","armor","helm","elt"],
  // Circlets
  ["ci0","Circlet","circlet","circlet","norm"],
  ["ci1","Coronet","circlet","circlet","norm"],
  ["ci2","Tiara","circlet","circlet","exc"],
  ["ci3","Diadem","circlet","circlet","elt"],
  // Chests
  ["qui","Quilted Armor","armor","chest","norm"],       ["xui","Ghost Armor","armor","chest","exc"],        ["uui","Dusk Shroud","armor","chest","elt"],
  ["lea","Leather Armor","armor","chest","norm"],       ["xea","Serpentskin Armor","armor","chest","exc"],  ["uea","Wyrmhide","armor","chest","elt"],
  ["hla","Hard Leather Armor","armor","chest","norm"],  ["xla","Demonhide Armor","armor","chest","exc"],    ["ula","Scarab Husk","armor","chest","elt"],
  ["stu","Studded Leather","armor","chest","norm"],     ["xtu","Trellised Armor","armor","chest","exc"],    ["utu","Wire Fleece","armor","chest","elt"],
  ["rng","Ring Mail","armor","chest","norm"],           ["xng","Linked Mail","armor","chest","exc"],        ["ung","Diamond Mail","armor","chest","elt"],
  ["scl","Scale Mail","armor","chest","norm"],          ["xcl","Tigulated Mail","armor","chest","exc"],     ["ucl","Loricated Mail","armor","chest","elt"],
  ["chn","Chain Mail","armor","chest","norm"],          ["xhn","Mesh Armor","armor","chest","exc"],         ["uhn","Boneweave","armor","chest","elt"],
  ["brs","Breast Plate","armor","chest","norm"],        ["xrs","Cuirass","armor","chest","exc"],            ["urs","Great Hauberk","armor","chest","elt"],
  ["spl","Splint Mail","armor","chest","norm"],         ["xpl","Russet Armor","armor","chest","exc"],       ["upl","Balrog Skin","armor","chest","elt"],
  ["plt","Plate Mail","armor","chest","norm"],          ["xlt","Templar Coat","armor","chest","exc"],       ["ult","Hellforge Plate","armor","chest","elt"],
  ["fld","Field Plate","armor","chest","norm"],         ["xld","Sharktooth Armor","armor","chest","exc"],   ["uld","Kraken Shell","armor","chest","elt"],
  ["gth","Gothic Plate","armor","chest","norm"],        ["xth","Embossed Plate","armor","chest","exc"],     ["uth","Lacquered Plate","armor","chest","elt"],
  ["ltp","Light Plate","armor","chest","norm"],         ["xtp","Mage Plate","armor","chest","exc"],         ["utp","Archon Plate","armor","chest","elt"],
  ["ful","Full Plate Mail","armor","chest","norm"],     ["xul","Chaos Armor","armor","chest","exc"],        ["uul","Shadow Plate","armor","chest","elt"],
  ["aar","Ancient Armor","armor","chest","norm"],       ["xar","Ornate Plate","armor","chest","exc"],       ["uar","Sacred Armor","armor","chest","elt"],
  // Shields
  ["buc","Buckler","armor","shield","norm"],            ["xuc","Defender","armor","shield","exc"],          ["uuc","Heater","armor","shield","elt"],
  ["sml","Small Shield","armor","shield","norm"],       ["xml","Round Shield","armor","shield","exc"],      ["uml","Luna","armor","shield","elt"],
  ["lrg","Large Shield","armor","shield","norm"],       ["xrg","Scutum","armor","shield","exc"],            ["urg","Hyperion","armor","shield","elt"],
  ["spk","Spiked Shield","armor","shield","norm"],      ["xpk","Barbed Shield","armor","shield","exc"],     ["upk","Blade Barrier","armor","shield","elt"],
  ["kit","Kite Shield","armor","shield","norm"],        ["xit","Dragon Shield","armor","shield","exc"],     ["uit","Monarch","armor","shield","elt"],
  ["bsh","Bone Shield","armor","shield","norm"],        ["xsh","Grim Shield","armor","shield","exc"],       ["ush","Troll Nest","armor","shield","elt"],
  ["tow","Tower Shield","armor","shield","norm"],       ["xow","Pavise","armor","shield","exc"],            ["uow","Aegis","armor","shield","elt"],
  ["gts","Gothic Shield","armor","shield","norm"],      ["xts","Ancient Shield","armor","shield","exc"],    ["uts","Ward","armor","shield","elt"],
  // Gloves
  ["lgl","Leather Gloves","armor","gloves","norm"],     ["xlg","Demonhide Gloves","armor","gloves","exc"],  ["ulg","Bramble Mitts","armor","gloves","elt"],
  ["vgl","Heavy Gloves","armor","gloves","norm"],       ["xvg","Sharkskin Gloves","armor","gloves","exc"],  ["uvg","Vampirebone Gloves","armor","gloves","elt"],
  ["mgl","Chain Gloves","armor","gloves","norm"],       ["xmg","Heavy Bracers","armor","gloves","exc"],     ["umg","Vambraces","armor","gloves","elt"],
  ["tgl","Light Gauntlets","armor","gloves","norm"],    ["xtg","Battle Gauntlets","armor","gloves","exc"],  ["utg","Crusader Gauntlets","armor","gloves","elt"],
  ["hgl","Gauntlets","armor","gloves","norm"],          ["xhg","War Gauntlets","armor","gloves","exc"],     ["uhg","Ogre Gauntlets","armor","gloves","elt"],
  // Boots
  ["lbt","Boots","armor","boots","norm"],               ["xlb","Demonhide Boots","armor","boots","exc"],    ["ulb","Wyrmhide Boots","armor","boots","elt"],
  ["vbt","Heavy Boots","armor","boots","norm"],         ["xvb","Sharkskin Boots","armor","boots","exc"],    ["uvb","Scarabshell Boots","armor","boots","elt"],
  ["mbt","Chain Boots","armor","boots","norm"],         ["xmb","Mesh Boots","armor","boots","exc"],         ["umb","Boneweave Boots","armor","boots","elt"],
  ["tbt","Light Plated Boots","armor","boots","norm"],  ["xtb","Battle Boots","armor","boots","exc"],       ["utb","Mirrored Boots","armor","boots","elt"],
  ["hbt","Greaves","armor","boots","norm"],             ["xhb","War Boots","armor","boots","exc"],          ["uhb","Myrmidon Greaves","armor","boots","elt"],
  // Belts
  ["lbl","Sash","armor","belt","norm"],                 ["zlb","Demonhide Sash","armor","belt","exc"],      ["ulc","Spiderweb Sash","armor","belt","elt"],
  ["vbl","Light Belt","armor","belt","norm"],           ["zvb","Sharkskin Belt","armor","belt","exc"],      ["uvc","Vampirefang Belt","armor","belt","elt"],
  ["mbl","Belt","armor","belt","norm"],                 ["zmb","Mesh Belt","armor","belt","exc"],           ["umc","Mithril Coil","armor","belt","elt"],
  ["tbl","Heavy Belt","armor","belt","norm"],           ["ztb","Battle Belt","armor","belt","exc"],         ["utc","Troll Belt","armor","belt","elt"],
  ["hbl","Plated Belt","armor","belt","norm"],          ["zhb","War Belt","armor","belt","exc"],            ["uhc","Colossus Girdle","armor","belt","elt"],
] as const;

// Class-restricted helms (druid / barbarian)
const CLASS_HELMS: ReadonlyArray<readonly [string, string, ItemCategory, string, ItemTier]> = [
  ["dr1","Wolf Head","class-helm","druid","norm"],       ["dr6","Alpha Helm","class-helm","druid","exc"],       ["drb","Blood Spirit","class-helm","druid","elt"],
  ["dr2","Hawk Helm","class-helm","druid","norm"],       ["dr7","Griffon Headress","class-helm","druid","exc"], ["drc","Sun Spirit","class-helm","druid","elt"],
  ["dr3","Antlers","class-helm","druid","norm"],         ["dr8","Hunter's Guise","class-helm","druid","exc"],   ["drd","Earth Spirit","class-helm","druid","elt"],
  ["dr4","Falcon Mask","class-helm","druid","norm"],     ["dr9","Sacred Feathers","class-helm","druid","exc"],  ["dre","Sky Spirit","class-helm","druid","elt"],
  ["dr5","Spirit Mask","class-helm","druid","norm"],     ["dra","Totemic Mask","class-helm","druid","exc"],     ["drf","Dream Spirit","class-helm","druid","elt"],
  ["ba1","Jawbone Cap","class-helm","barbarian","norm"], ["ba6","Jawbone Visor","class-helm","barbarian","exc"],["bab","Carnage Helm","class-helm","barbarian","elt"],
  ["ba2","Fanged Helm","class-helm","barbarian","norm"], ["ba7","Lion Helm","class-helm","barbarian","exc"],    ["bac","Fury Visor","class-helm","barbarian","elt"],
  ["ba3","Horned Helm","class-helm","barbarian","norm"], ["ba8","Rage Mask","class-helm","barbarian","exc"],    ["bad","Destroyer Helm","class-helm","barbarian","elt"],
  ["ba4","Assault Helmet","class-helm","barbarian","norm"],["ba9","Savage Helmet","class-helm","barbarian","exc"],["bae","Conqueror Crown","class-helm","barbarian","elt"],
  ["ba5","Avenger Guard","class-helm","barbarian","norm"],["baa","Slayer Guard","class-helm","barbarian","exc"],["baf","Guardian Crown","class-helm","barbarian","elt"],
] as const;

// Class shields (paladin / necromancer)
const CLASS_SHIELDS: ReadonlyArray<readonly [string, string, ItemCategory, string, ItemTier]> = [
  ["pa1","Targe","class-shield","paladin","norm"],              ["pa6","Akaran Targe","class-shield","paladin","exc"],      ["pab","Sacred Targe","class-shield","paladin","elt"],
  ["pa2","Rondache","class-shield","paladin","norm"],           ["pa7","Akaran Rondache","class-shield","paladin","exc"],   ["pac","Sacred Rondache","class-shield","paladin","elt"],
  ["pa3","Heraldic Shield","class-shield","paladin","norm"],    ["pa8","Protector Shield","class-shield","paladin","exc"],  ["pad","Kurast Shield","class-shield","paladin","elt"],
  ["pa4","Aerin Shield","class-shield","paladin","norm"],       ["pa9","Gilded Shield","class-shield","paladin","exc"],     ["pae","Zakarum Shield","class-shield","paladin","elt"],
  ["pa5","Crown Shield","class-shield","paladin","norm"],       ["paa","Royal Shield","class-shield","paladin","exc"],      ["paf","Vortex Shield","class-shield","paladin","elt"],
  ["ne1","Preserved Head","class-shield","necromancer","norm"], ["ne6","Mummified Trophy","class-shield","necromancer","exc"],["neb","Minion Skull","class-shield","necromancer","elt"],
  ["ne2","Zombie Head","class-shield","necromancer","norm"],    ["ne7","Fetish Trophy","class-shield","necromancer","exc"],  ["neg","Hellspawn Skull","class-shield","necromancer","elt"],
  ["ne3","Unraveller Head","class-shield","necromancer","norm"],["ne8","Sexton Trophy","class-shield","necromancer","exc"],  ["ned","Overseer Skull","class-shield","necromancer","elt"],
  ["ne4","Gargoyle Head","class-shield","necromancer","norm"],  ["ne9","Cantor Trophy","class-shield","necromancer","exc"],  ["nee","Succubus Skull","class-shield","necromancer","elt"],
  ["ne5","Demon Head","class-shield","necromancer","norm"],     ["nea","Hierophant Trophy","class-shield","necromancer","exc"],["nef","Bloodlord Skull","class-shield","necromancer","elt"],
] as const;

// Weapons: axes, maces, swords, daggers, throwing, javelins, spears, polearms, bows, crossbows, staves, wands, scepters
const WEAPONS: ReadonlyArray<readonly [string, string, ItemCategory, string, ItemTier]> = [
  // Axes
  ["hax","Hand Axe","weapon","axe","norm"], ["9ha","Hatchet","weapon","axe","exc"], ["7ha","Tomahawk","weapon","axe","elt"],
  ["axe","Axe","weapon","axe","norm"], ["9ax","Cleaver","weapon","axe","exc"], ["7ax","Small Crescent","weapon","axe","elt"],
  ["2ax","Double Axe","weapon","axe","norm"], ["92a","Twin Axe","weapon","axe","exc"], ["72a","Ettin Axe","weapon","axe","elt"],
  ["mpi","Military Pick","weapon","axe","norm"], ["9mp","Crowbill","weapon","axe","exc"], ["7mp","War Spike","weapon","axe","elt"],
  ["wax","War Axe","weapon","axe","norm"], ["9wa","Naga","weapon","axe","exc"], ["7wa","Berserker Axe","weapon","axe","elt"],
  ["lax","Large Axe","weapon","axe","norm"], ["9la","Military Axe","weapon","axe","exc"], ["7la","Feral Axe","weapon","axe","elt"],
  ["bax","Broad Axe","weapon","axe","norm"], ["9ba","Bearded Axe","weapon","axe","exc"], ["7ba","Silver-edged Axe","weapon","axe","elt"],
  ["btx","Battle Axe","weapon","axe","norm"], ["9bt","Tabar","weapon","axe","exc"], ["7bt","Decapitator","weapon","axe","elt"],
  ["gax","Great Axe","weapon","axe","norm"], ["9ga","Gothic Axe","weapon","axe","exc"], ["7ga","Champion Axe","weapon","axe","elt"],
  ["gix","Giant Axe","weapon","axe","norm"], ["9gi","Ancient Axe","weapon","axe","exc"], ["7gi","Glorious Axe","weapon","axe","elt"],
  // Maces
  ["clb","Club","weapon","mace","norm"], ["9cl","Cudgel","weapon","mace","exc"], ["7cl","Truncheon","weapon","mace","elt"],
  ["spc","Spiked Club","weapon","mace","norm"], ["9sp","Barbed Club","weapon","mace","exc"], ["7sp","Tyrant Club","weapon","mace","elt"],
  ["mac","Mace","weapon","mace","norm"], ["9ma","Flanged Mace","weapon","mace","exc"], ["7ma","Reinforced Mace","weapon","mace","elt"],
  ["mst","Morning Star","weapon","mace","norm"], ["9mt","Jagged Star","weapon","mace","exc"], ["7mt","Devil Star","weapon","mace","elt"],
  ["fla","Flail","weapon","mace","norm"], ["9fl","Knout","weapon","mace","exc"], ["7fl","Scourge","weapon","mace","elt"],
  ["whm","War Hammer","weapon","mace","norm"], ["9wh","Battle Hammer","weapon","mace","exc"], ["7wh","Legendary Mallet","weapon","mace","elt"],
  ["mau","Maul","weapon","mace","norm"], ["9m9","War Club","weapon","mace","exc"], ["7m7","Ogre Maul","weapon","mace","elt"],
  ["gma","Great Maul","weapon","mace","norm"], ["9gm","Martel de Fer","weapon","mace","exc"], ["7gm","Thunder Maul","weapon","mace","elt"],
  // Swords
  ["ssd","Short Sword","weapon","sword","norm"], ["9ss","Gladius","weapon","sword","exc"], ["7ss","Falcata","weapon","sword","elt"],
  ["scm","Scimitar","weapon","sword","norm"], ["9sm","Cutlass","weapon","sword","exc"], ["7sm","Ataghan","weapon","sword","elt"],
  ["sbr","Sabre","weapon","sword","norm"], ["9sb","Shamshir","weapon","sword","exc"], ["7sb","Elegant Blade","weapon","sword","elt"],
  ["flc","Falchion","weapon","sword","norm"], ["9fc","Tulwar","weapon","sword","exc"], ["7fc","Hydra Edge","weapon","sword","elt"],
  ["crs","Crystal Sword","weapon","sword","norm"], ["9cr","Dimensional Blade","weapon","sword","exc"], ["7cr","Phase Blade","weapon","sword","elt"],
  ["bsd","Broad Sword","weapon","sword","norm"], ["9bs","Battle Sword","weapon","sword","exc"], ["7bs","Conquest Sword","weapon","sword","elt"],
  ["lsd","Long Sword","weapon","sword","norm"], ["9ls","Rune Sword","weapon","sword","exc"], ["7ls","Cryptic Sword","weapon","sword","elt"],
  ["wsd","War Sword","weapon","sword","norm"], ["9wd","Ancient Sword","weapon","sword","exc"], ["7wd","Mythical Sword","weapon","sword","elt"],
  ["2hs","Two-handed Sword","weapon","sword","norm"], ["92h","Espandon","weapon","sword","exc"], ["72h","Legend Sword","weapon","sword","elt"],
  ["clm","Claymore","weapon","sword","norm"], ["9cm","Dacian Falx","weapon","sword","exc"], ["7cm","Highland Blade","weapon","sword","elt"],
  ["gis","Giant Sword","weapon","sword","norm"], ["9gs","Tusk Sword","weapon","sword","exc"], ["7gs","Balrog Blade","weapon","sword","elt"],
  ["bsw","Bastard Sword","weapon","sword","norm"], ["9b9","Gothic Sword","weapon","sword","exc"], ["7b7","Champion Sword","weapon","sword","elt"],
  ["flb","Flamberge","weapon","sword","norm"], ["9fb","Zweihander","weapon","sword","exc"], ["7fb","Colossus Sword","weapon","sword","elt"],
  ["gsd","Great Sword","weapon","sword","norm"], ["9gd","Executioner Sword","weapon","sword","exc"], ["7gd","Colossus Blade","weapon","sword","elt"],
  // Daggers
  ["dgr","Dagger","weapon","dagger","norm"], ["9dg","Poignard","weapon","dagger","exc"], ["7dg","Bone Knife","weapon","dagger","elt"],
  ["dir","Dirk","weapon","dagger","norm"], ["9di","Rondel","weapon","dagger","exc"], ["7di","Mithril Point","weapon","dagger","elt"],
  ["kri","Kris","weapon","dagger","norm"], ["9kr","Cinquedeas","weapon","dagger","exc"], ["7kr","Fanged Knife","weapon","dagger","elt"],
  ["bld","Blade","weapon","dagger","norm"], ["9bl","Stiletto","weapon","dagger","exc"], ["7bl","Legend Spike","weapon","dagger","elt"],
  // Throwing knives / axes
  ["tkf","Throwing Knife","weapon","throwing","norm"], ["9tk","Battle Dart","weapon","throwing","exc"], ["7tk","Flying Knife","weapon","throwing","elt"],
  ["tax","Throwing Axe","weapon","throwing","norm"],   ["9ta","Francisca","weapon","throwing","exc"],  ["7ta","Flying Axe","weapon","throwing","elt"],
  ["bkf","Balanced Knife","weapon","throwing","norm"], ["9bk","War Dart","weapon","throwing","exc"],   ["7bk","Winged Knife","weapon","throwing","elt"],
  ["bal","Balanced Axe","weapon","throwing","norm"],   ["9b8","Hurlbat","weapon","throwing","exc"],    ["7b8","Winged Axe","weapon","throwing","elt"],
  // Javelins
  ["jav","Javelin","weapon","javelin","norm"], ["9ja","War Javelin","weapon","javelin","exc"], ["7ja","Hyperion Javelin","weapon","javelin","elt"],
  ["pil","Pilum","weapon","javelin","norm"],   ["9pi","Great Pilum","weapon","javelin","exc"], ["7pi","Stygian Pilum","weapon","javelin","elt"],
  ["ssp","Short Spear","weapon","javelin","norm"], ["9s9","Simbilan","weapon","javelin","exc"], ["7s7","Balrog Spear","weapon","javelin","elt"],
  ["glv","Glaive","weapon","javelin","norm"],  ["9gl","Spiculum","weapon","javelin","exc"],    ["7gl","Ghost Glaive","weapon","javelin","elt"],
  ["tsp","Throwing Spear","weapon","javelin","norm"], ["9ts","Harpoon","weapon","javelin","exc"], ["7ts","Winged Harpoon","weapon","javelin","elt"],
  // Spears
  ["spr","Spear","weapon","spear","norm"], ["9sr","War Spear","weapon","spear","exc"], ["7sr","Hyperion Spear","weapon","spear","elt"],
  ["tri","Trident","weapon","spear","norm"], ["9tr","Fuscina","weapon","spear","exc"],  ["7tr","Stygian Pike","weapon","spear","elt"],
  ["brn","Brandistock","weapon","spear","norm"], ["9br","War Fork","weapon","spear","exc"], ["7br","Mancatcher","weapon","spear","elt"],
  ["spt","Spetum","weapon","spear","norm"], ["9st","Yari","weapon","spear","exc"],       ["7st","Ghost Spear","weapon","spear","elt"],
  ["pik","Pike","weapon","spear","norm"], ["9p9","Lance","weapon","spear","exc"],         ["7p7","War Pike","weapon","spear","elt"],
  // Polearms
  ["bar","Bardiche","weapon","polearm","norm"], ["9b7","Lochaber Axe","weapon","polearm","exc"], ["7o7","Ogre Axe","weapon","polearm","elt"],
  ["vou","Voulge","weapon","polearm","norm"], ["9vo","Bill","weapon","polearm","exc"],          ["7vo","Colossus Voulge","weapon","polearm","elt"],
  ["scy","Scythe","weapon","polearm","norm"], ["9s8","Battle Scythe","weapon","polearm","exc"], ["7s8","Thresher","weapon","polearm","elt"],
  ["pax","Poleaxe","weapon","polearm","norm"], ["9pa","Partizan","weapon","polearm","exc"],     ["7pa","Cryptic Axe","weapon","polearm","elt"],
  ["hal","Halberd","weapon","polearm","norm"], ["9h9","Bec-de-Corbin","weapon","polearm","exc"],["7h7","Great Poleaxe","weapon","polearm","elt"],
  ["wsc","War Scythe","weapon","polearm","norm"], ["9wc","Grim Scythe","weapon","polearm","exc"],["7wc","Giant Thresher","weapon","polearm","elt"],
  // Bows
  ["sbw","Short Bow","weapon","bow","norm"], ["8sb","Edge Bow","weapon","bow","exc"],      ["6sb","Spider Bow","weapon","bow","elt"],
  ["hbw","Hunter's Bow","weapon","bow","norm"], ["8hb","Razor Bow","weapon","bow","exc"],  ["6hb","Blade Bow","weapon","bow","elt"],
  ["lbw","Long Bow","weapon","bow","norm"],  ["8lb","Cedar Bow","weapon","bow","exc"],     ["6lb","Shadow Bow","weapon","bow","elt"],
  ["cbw","Composite Bow","weapon","bow","norm"], ["8cb","Double Bow","weapon","bow","exc"],["6cb","Great Bow","weapon","bow","elt"],
  ["sbb","Short Battle Bow","weapon","bow","norm"], ["8s8","Short Siege Bow","weapon","bow","exc"], ["6s7","Diamond Bow","weapon","bow","elt"],
  ["lbb","Long Battle Bow","weapon","bow","norm"], ["8l8","Large Siege Bow","weapon","bow","exc"], ["6l7","Crusader Bow","weapon","bow","elt"],
  ["swb","Short War Bow","weapon","bow","norm"], ["8sw","Rune Bow","weapon","bow","exc"],  ["6sw","Ward Bow","weapon","bow","elt"],
  ["lwb","Long War Bow","weapon","bow","norm"], ["8lw","Gothic Bow","weapon","bow","exc"], ["6lw","Hydra Bow","weapon","bow","elt"],
  // Crossbows
  ["lxb","Light Crossbow","weapon","xbow","norm"], ["8lx","Arbalest","weapon","xbow","exc"], ["6lx","Pellet Bow","weapon","xbow","elt"],
  ["mxb","Crossbow","weapon","xbow","norm"], ["8mx","Siege Crossbow","weapon","xbow","exc"], ["6mx","Gorgon Crossbow","weapon","xbow","elt"],
  ["hxb","Heavy Crossbow","weapon","xbow","norm"], ["8hx","Ballista","weapon","xbow","exc"], ["6hx","Colossus Crossbow","weapon","xbow","elt"],
  ["rxb","Repeating Crossbow","weapon","xbow","norm"], ["8rx","Chu-Ko-Nu","weapon","xbow","exc"], ["6rx","Demon Crossbow","weapon","xbow","elt"],
  // Staves
  ["sst","Short Staff","weapon","staff","norm"], ["8ss","Jo Staff","weapon","staff","exc"], ["6ss","Walking Stick","weapon","staff","elt"],
  ["lst","Long Staff","weapon","staff","norm"],  ["8ls","Quarterstaff","weapon","staff","exc"], ["6ls","Stalagmite","weapon","staff","elt"],
  ["cst","Gnarled Staff","weapon","staff","norm"], ["8cs","Cedar Staff","weapon","staff","exc"], ["6cs","Elder Staff","weapon","staff","elt"],
  ["bst","Battle Staff","weapon","staff","norm"], ["8bs","Gothic Staff","weapon","staff","exc"], ["6bs","Shillelagh","weapon","staff","elt"],
  ["wst","War Staff","weapon","staff","norm"],    ["8ws","Rune Staff","weapon","staff","exc"],   ["6ws","Archon Staff","weapon","staff","elt"],
  // Wands
  ["wnd","Wand","weapon","wand","norm"], ["9wn","Burnt Wand","weapon","wand","exc"],       ["7wn","Polished Wand","weapon","wand","elt"],
  ["ywn","Yew Wand","weapon","wand","norm"], ["9yw","Petrified Wand","weapon","wand","exc"], ["7yw","Ghost Wand","weapon","wand","elt"],
  ["bwn","Bone Wand","weapon","wand","norm"], ["9bw","Tomb Wand","weapon","wand","exc"],   ["7bw","Lich Wand","weapon","wand","elt"],
  ["gwn","Grim Wand","weapon","wand","norm"], ["9gw","Grave Wand","weapon","wand","exc"],  ["7gw","Unearthed Wand","weapon","wand","elt"],
  // Scepters
  ["scp","Scepter","weapon","scepter","norm"], ["9sc","Rune Scepter","weapon","scepter","exc"], ["7sc","Mighty Scepter","weapon","scepter","elt"],
  ["gsc","Grand Scepter","weapon","scepter","norm"], ["9qs","Holy Water Sprinkler","weapon","scepter","exc"], ["7qs","Seraph Rod","weapon","scepter","elt"],
  ["wsp","War Scepter","weapon","scepter","norm"], ["9ws","Divine Scepter","weapon","scepter","exc"], ["7ws","Caduceus","weapon","scepter","elt"],
  // Assassin claws
  ["ktr","Katar","weapon","claw","norm"],      ["9ar","Quhab","weapon","claw","exc"],           ["7ar","Suwayyah","weapon","claw","elt"],
  ["wrb","Wrist Blade","weapon","claw","norm"],["9wb","Wrist Spike","weapon","claw","exc"],     ["7wb","Wrist Sword","weapon","claw","elt"],
  ["axf","Hatchet Hands","weapon","claw","norm"],["9xf","Fascia","weapon","claw","exc"],         ["7xf","War Fist","weapon","claw","elt"],
  ["ces","Cestus","weapon","claw","norm"],     ["9cs","Hand Scythe","weapon","claw","exc"],     ["7cs","Battle Cestus","weapon","claw","elt"],
  ["clw","Claws","weapon","claw","norm"],      ["9lw","Greater Claws","weapon","claw","exc"],   ["7lw","Feral Claws","weapon","claw","elt"],
  ["btl","Blade Talons","weapon","claw","norm"],["9tw","Greater Talons","weapon","claw","exc"], ["7tw","Runic Talons","weapon","claw","elt"],
  ["skr","Scissors Katar","weapon","claw","norm"],["9qr","Scissors Quhab","weapon","claw","exc"],["7qr","Scissors Suwayyah","weapon","claw","elt"],
  // Sorc orbs
  ["ob1","Eagle Orb","weapon","orb","norm"], ["ob6","Glowing Orb","weapon","orb","exc"],    ["obb","Heavenly Stone","weapon","orb","elt"],
  ["ob2","Sacred Globe","weapon","orb","norm"], ["ob7","Crystalline Globe","weapon","orb","exc"], ["obc","Eldritch Orb","weapon","orb","elt"],
  ["ob3","Smoked Sphere","weapon","orb","norm"], ["ob8","Cloudy Sphere","weapon","orb","exc"],    ["obd","Demon Heart","weapon","orb","elt"],
  ["ob4","Clasped Orb","weapon","orb","norm"],   ["ob9","Sparkling Ball","weapon","orb","exc"],   ["obe","Vortex Orb","weapon","orb","elt"],
  ["ob5","Jared's Stone","weapon","orb","norm"], ["oba","Swirling Crystal","weapon","orb","exc"], ["obf","Dimensional Shard","weapon","orb","elt"],
  // Amazon weapons
  ["am1","Stag Bow","weapon","amazon","norm"], ["am6","Ashwood Bow","weapon","amazon","exc"],         ["amb","Matriarchal Bow","weapon","amazon","elt"],
  ["am2","Reflex Bow","weapon","amazon","norm"], ["am7","Ceremonial Bow","weapon","amazon","exc"],    ["amc","Grand Matron Bow","weapon","amazon","elt"],
  ["am3","Maiden Spear","weapon","amazon","norm"], ["am8","Ceremonial Spear","weapon","amazon","exc"], ["amd","Matriarchal Spear","weapon","amazon","elt"],
  ["am4","Maiden Pike","weapon","amazon","norm"], ["am9","Ceremonial Pike","weapon","amazon","exc"],   ["ame","Matriarchal Pike","weapon","amazon","elt"],
  ["am5","Maiden Javelin","weapon","amazon","norm"], ["ama","Ceremonial Javelin","weapon","amazon","exc"], ["amf","Matriarchal Javelin","weapon","amazon","elt"],
] as const;

// Misc items: quivers, jewelry, charms, scrolls, tomes, keys, ears, quest, gems+runes covered separately
const MISC: ReadonlyArray<readonly [string, string, ItemCategory, string]> = [
  // Quivers
  ["aqv","Blunt Arrows","quiver","arrow"], ["aqv2","Sharp Arrows","quiver","arrow"], ["aqv3","Razor Arrows","quiver","arrow"],
  ["cqv","Light Bolts","quiver","bolt"],   ["cqv2","Heavy Bolts","quiver","bolt"],   ["cqv3","War Bolts","quiver","bolt"],
  // Jewelry
  ["rin","Ring","jewelry","ring"],
  ["amu","Amulet","jewelry","amulet"],
  ["ram","The Third Eye (amulet variant)","jewelry","amulet"],
  // Charms / jewel
  ["cm1","Small Charm","charm","charm"],
  ["cm2","Large Charm","charm","charm"],
  ["cm3","Grand Charm","charm","charm"],
  ["cm1p","Small Charm (PvP)","charm","charm"],
  ["cm2p","Large Charm (PvP)","charm","charm"],
  ["cm3p","Grand Charm (PvP)","charm","charm"],
  ["jew","Jewel","charm","jewel"],
  // Scrolls & tomes
  ["tsc","Scroll of Town Portal","scroll","town-portal"],
  ["isc","Scroll of Identify","scroll","identify"],
  ["tbk","Tome of Town Portal","tome","town-portal"],
  ["ibk","Tome of Identify","tome","identify"],
  // Keys / ears / standard
  ["key","Key","misc","key"],
  ["leg","Wirt's Leg","misc","oddity"],
  ["ear","Player Ear","misc","oddity"],
  ["std","Standard of Heroes","misc","oddity"],
  // Special equipment
  ["rar","Cage of the Unsullied (Boneweave variant)","armor","chest"],
  ["rbe","Band of Skulls (Troll Belt variant)","armor","belt"],
] as const;

// Potions
const POTIONS: ReadonlyArray<readonly [string, string, ItemCategory, string]> = [
  ["rvl","Full Rejuvenation Potion","potion","rejuv"],
  ["rvs","Rejuvenation Potion","potion","rejuv"],
  ["yps","Antidote Potion","potion","utility"],
  ["wms","Thawing Potion","potion","utility"],
  ["vps","Stamina Potion","potion","utility"],
  ["hp1","Minor Healing Potion","potion","heal"],
  ["hp2","Lesser Healing Potion","potion","heal"],
  ["hp3","Healing Potion","potion","heal"],
  ["hp4","Greater Healing Potion","potion","heal"],
  ["hp5","Super Healing Potion","potion","heal"],
  ["mp1","Minor Mana Potion","potion","mana"],
  ["mp2","Lesser Mana Potion","potion","mana"],
  ["mp3","Mana Potion","potion","mana"],
  ["mp4","Greater Mana Potion","potion","mana"],
  ["mp5","Super Mana Potion","potion","mana"],
  // Throwing potions (new PD2)
  ["tpfs","Fulminating Potion","throwing-potion","fire"], ["tpfm","Exploding Potion","throwing-potion","fire"], ["tpfl","Oil Potion","throwing-potion","fire"],
  ["tpgs","Strangling Potion","throwing-potion","poison"], ["tpgm","Choking Potion","throwing-potion","poison"], ["tpgl","Rancid Potion","throwing-potion","poison"],
  ["tpcs","Chilling Potion","throwing-potion","cold"],     ["tpcm","Frost Potion","throwing-potion","cold"],     ["tpcl","Freezing Potion","throwing-potion","cold"],
  ["tpls","Charged Potion","throwing-potion","lightning"], ["tplm","Static Potion","throwing-potion","lightning"],["tpll","Shock Potion","throwing-potion","lightning"],
] as const;

// Quest items
const QUEST: ReadonlyArray<readonly [string, string, ItemCategory, string]> = [
  ["bks","Scroll of Inifuss","quest","act1"],
  ["bkd","Key to the Cairn Stones","quest","act1"],
  ["tr1","Horadric Scroll","quest","act2"],
  ["ass","Book of Skill","quest","act2"],
  ["box","Horadric Cube","quest","act2"],
  ["j34","Jade Figurine","quest","act3"],
  ["g34","Golden Bird","quest","act3"],
  ["xyz","Potion of Life","quest","act3"],
  ["bbb","Lam Esen's Tome","quest","act3"],
  ["qbr","Khalim's Brain","quest","act3"],
  ["qey","Khalim's Eye","quest","act3"],
  ["qhr","Khalim's Heart","quest","act3"],
  ["mss","Mephisto's Soulstone","quest","act3"],
  ["ice","Malah's Potion","quest","act5"],
  ["tr2","Scroll of Resistance","quest","act5"],
  ["hdm","Horadric Malus","quest","equipment"],
  ["msf","Staff of Kings","quest","equipment"],
  ["vip","Viper Amulet","quest","equipment"],
  ["hst","Horadric Staff","quest","equipment"],
  ["g33","Gidbinn","quest","equipment"],
  ["qf1","Khalim's Flail","quest","equipment"],
  ["qf2","Khalim's Will","quest","equipment"],
  ["hfh","Hell Forge Hammer","quest","equipment"],
  ["tes","Twisted Essence of Suffering","quest","token"],
  ["ceh","Charged Essence of Hatred","quest","token"],
  ["bet","Burning Essence of Terror","quest","token"],
  ["fed","Festering Essence of Destruction","quest","token"],
  ["toa","Token of Absolution","quest","reset"],
  ["pk1","Key of Terror","quest","mini-uber"],
  ["pk2","Key of Hate","quest","mini-uber"],
  ["pk3","Key of Destruction","quest","mini-uber"],
  ["dhn","Diablo's Horn","quest","uber"],
  ["bey","Baal's Eye","quest","uber"],
  ["mbr","Mephisto's Brain","quest","uber"],
] as const;

// PD2-specific maps, arenas, orbs
const PD2_ITEMS: ReadonlyArray<readonly [string, string, ItemCategory, string]> = [
  // Maps (t11..t56, with tier info in name)
  ["t11","Ruins of Viz-Jun Map","map","t2"],
  ["t12","Horazon's Memory Map","map","t1"],
  ["t13","Bastion Keep Map","map","t2"],
  ["t14","Sanatorium Map","map","t3"],
  ["t15","Royal Crypts Map","map","t1"],
  ["t16","Ruined Cistern Map","map","t3"],
  ["t17","Halls of Torture Map","map","t1"],
  ["t21","Phlegethon Map","map","t3"],
  ["t22","Torajan Jungle Map","map","t1"],
  ["t23","Arreat Battlefield Map","map","t1"],
  ["t24","Tomb of Zoltun Kulle Map","map","t2"],
  ["t25","Sewers of Harrogath Map","map","t1"],
  ["t26","Shadows of Westmarch Map","map","t1"],
  ["t27","Demon Road","map","t2"],
  ["t28","Skovos Stronghold","map","t2"],
  ["t31","River of Blood Map","map","t2"],
  ["t32","Throne of Insanity Map","map","t3"],
  ["t33","Lost Temple Map","map","t2"],
  ["t34","Ancestral Trial Map","map","t2"],
  ["t35","Blood Moon Map","map","t3"],
  ["t36","Fall of Caldeum Map","map","t1"],
  ["t37","Pandemonium Citadel Map","map","t3"],
  ["t38","Canyon of Sescheron Map","map","t3"],
  ["t39","Kehjistan Marketplace Map","map","t3"],
  ["t3a","Ashen Plains Map","map","t3"],
  ["t41","Cathedral of Light Map","map","dungeon"],
  ["t42","Plains of Torment Map","map","dungeon"],
  ["t43","Sanctuary of Sin Map","map","dungeon"],
  ["t44","Steppes of Daken-Shar","map","dungeon"],
  ["t51","Zhar's Sanctum Map","map","unique"],
  ["t52","Warlord of Blood Map","map","unique"],
  ["t53","Fallen Gardens Map","map","unique"],
  ["t54","Imperial Palace Map","map","unique"],
  ["t55","Outer Void Map","map","unique"],
  ["t56","City of Ureh","map","unique"],
  ["t61","Desert Duel Arena","arena","pvp"],
  ["t62","Moor Duel Arena","arena","pvp"],
  // Map modifiers
  ["imma","Arcane Orb","map-modifier","upgrade"],
  ["irma","Infused Arcane Orb","map-modifier","upgrade"],
  ["imra","Zakarum Orb","map-modifier","upgrade"],
  ["irra","Infused Zakarum Orb","map-modifier","upgrade"],
  ["upma","Angelic Orb","map-modifier","upgrade"],
  ["urma","Infused Angelic Orb","map-modifier","upgrade"],
  ["rera","Horadrim Orb","map-modifier","reroll"],
  ["rrra","Infused Horadrim Orb","map-modifier","reroll"],
  ["scou","Orb of Destruction","map-modifier","downgrade"],
  ["fort","Orb of Fortification","map-modifier","modifier"],
  ["upmp","Cartographer's Orb","map-modifier","combine"],
  ["scrb","Horadrim Scarab","map-modifier","dungeon"],
  ["iwss","Catalyst Shard","map-modifier","event"],
  // General-purpose PD2 items
  ["wss","Worldstone Shard","general-purpose","corrupt"],
  ["imrn","Demonic Cube","general-purpose","reroll"],
  ["lbox","Larzuk's Puzzlebox","general-purpose","socket"],
  ["lpp","Larzuk's Puzzlepiece","general-purpose","socket"],
  ["lmal","Larzuk's Malus","general-purpose","socket"],
  ["jewf","Jewel Fragments","general-purpose","ingredient"],
  ["cwss","Tainted Worldstone Shard","general-purpose","corrupt"],
  ["rtp","Horadrim Navigator","general-purpose","unlimited-tp"],
  ["rid","Horadrim Almanac","general-purpose","unlimited-id"],
  ["rkey","Skeleton Key","general-purpose","unlimited-key"],
  ["lsvl","Vial of Lightsong","general-purpose","ethereal"],
  ["llmr","Lilith's Mirror","general-purpose","mirror"],
  ["pvpp","Dueling Mana Potion","general-purpose","pvp"],
  ["crfb","Blood Craft Infusion","general-purpose","craft"],
  ["crfc","Caster Craft Infusion","general-purpose","craft"],
  ["crfs","Safety Craft Infusion","general-purpose","craft"],
  ["crfh","Hitpower Craft Infusion","general-purpose","craft"],
  ["crfv","Vampiric Craft Infusion","general-purpose","craft"],
  ["crfu","Bountiful Craft Infusion","general-purpose","craft"],
  ["crfp","Brilliant Craft Infusion","general-purpose","craft"],
  // Uber-related
  ["uba","Relic of the Ancients","uber-related","ubers"],
  ["ubaa","Sigil of Madawc","uber-related","ubers"],
  ["ubab","Sigil of Talic","uber-related","ubers"],
  ["ubac","Sigil of Korlic","uber-related","ubers"],
  ["ubtm","Pandemonium Talisman","uber-related","ubers"],
  ["dcma","Vision of Terror","uber-related","dclone"],
  ["dcso","Prime Evil Soul","uber-related","dclone"],
  ["dcbl","Pure Demonic Essence","uber-related","dclone"],
  ["dcho","Black Soulstone","uber-related","dclone"],
  ["rtma","Voidstone","uber-related","rathma"],
  ["rtmv","Splinter of the Void","uber-related","rathma"],
  ["rtmo","Trang-Oul's Jawbone","uber-related","rathma"],
  ["cm2f","Hellfire Ashes","uber-related","rathma"],
  ["luca","Shadow of Hatred","uber-related","lucion"],
  ["lucb","Demonic Insignia","uber-related","lucion"],
  ["lucc","Talisman of Transgression","uber-related","lucion"],
  ["lucd","Flesh of Malic","uber-related","lucion"],
] as const;

function build(): ItemCodeDef[] {
  const out: ItemCodeDef[] = [];
  for (const [code, name, category, subcategory, tier] of ARMOR) out.push({ code, name, category, subcategory, tier });
  for (const [code, name, category, subcategory, tier] of CLASS_HELMS) out.push({ code, name, category, subcategory, tier });
  for (const [code, name, category, subcategory, tier] of CLASS_SHIELDS) out.push({ code, name, category, subcategory, tier });
  for (const [code, name, category, subcategory, tier] of WEAPONS) out.push({ code, name, category, subcategory, tier });
  for (const [code, name, category, subcategory] of MISC) out.push({ code, name, category, subcategory });
  for (const [code, name, category, subcategory] of POTIONS) out.push({ code, name, category, subcategory });
  for (const [code, name, category, subcategory] of QUEST) out.push({ code, name, category, subcategory });
  for (const [code, name, category, subcategory] of PD2_ITEMS) out.push({ code, name, category, subcategory });
  return out;
}

export const ITEM_CODES: ItemCodeDef[] = build();

export const ITEM_CODES_BY_CODE: Record<string, ItemCodeDef> = Object.fromEntries(
  ITEM_CODES.map((i) => [i.code, i])
);

export const ITEM_CODES_SET = new Set(ITEM_CODES.map((i) => i.code));
