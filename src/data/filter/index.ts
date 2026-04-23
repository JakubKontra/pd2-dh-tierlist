// Barrel export + unified token classifier for the validator and parser.

import { ITEM_CODES_SET } from "./itemCodes";
import { ITEM_GROUPS_SET } from "./itemGroups";
import { MUTABLE_CODES_SET } from "./mutableCodes";
import { INFO_CODES_SET, INFO_CODES_BY_CODE } from "./infoCodes";
import { NAMED_STATS_SET, NAMED_STATS_BY_CODE } from "./namedStats";
import { RUNES_BY_CODE } from "./runes";
import { GEMS_BY_CODE } from "./gems";
import { COLOR_KEYWORDS } from "./colors";
import { OUTPUT_KEYWORDS_SET } from "./outputKeywords";
import { MAX_STAT_ID } from "./numberedStats";
import { SKILLS_BY_ID, CLSK_CLASSES, SKILL_TABS, MULTI_STAT_LAYERS } from "./skills";

export * from "./itemCodes";
export * from "./itemGroups";
export * from "./mutableCodes";
export * from "./infoCodes";
export * from "./namedStats";
export * from "./numberedStats";
export * from "./skills";
export * from "./mapIds";
export * from "./affixIds";
export * from "./corruptionIds";
export * from "./colors";
export * from "./outputKeywords";
export * from "./notificationKeywords";
export * from "./runes";
export * from "./gems";

// "Virtual" codes not in any catalog but used in filter syntax.
const VIRTUAL_CODES = new Set(["ALLSK"]);

export type TokenKind =
  | "item"
  | "item-group"
  | "mutable"
  | "info"
  | "named-stat"
  | "rune"
  | "gem"
  | "numbered-stat"
  | "skill"
  | "multi"
  | "class-skill"
  | "skill-tab"
  | "oskill"
  | "charge-skill"
  | "virtual"
  | "unknown";

export function classifyConditionCode(code: string): TokenKind {
  const upper = code.toUpperCase();
  if (ITEM_CODES_SET.has(code)) return "item";         // item codes are lower-case in wiki
  if (ITEM_GROUPS_SET.has(upper)) return "item-group";
  if (MUTABLE_CODES_SET.has(upper)) return "mutable";
  if (INFO_CODES_SET.has(upper)) return "info";
  if (NAMED_STATS_SET.has(upper)) return "named-stat";
  if (RUNES_BY_CODE[code]) return "rune";
  if (GEMS_BY_CODE[code]) return "gem";
  if (VIRTUAL_CODES.has(upper)) return "virtual";
  if (/^STAT\d+$/i.test(code)) return "numbered-stat";
  if (/^SK\d+$/i.test(code)) return "skill";
  if (/^CLSK\d+$/i.test(code)) return "class-skill";
  if (/^TABSK\d+$/i.test(code)) return "skill-tab";
  if (/^OS\d+$/i.test(code)) return "oskill";
  if (/^CHSK\d+$/i.test(code)) return "charge-skill";
  return "unknown";
}

export function isKnownConditionCode(code: string): boolean {
  return classifyConditionCode(code) !== "unknown";
}

export function isKnownOutputKeyword(keyword: string): boolean {
  // Keywords are usually uppercase; color keywords, NAME, CONTINUE, STAT###, SK###, etc.
  const upper = keyword.toUpperCase();
  if (COLOR_KEYWORDS.has(upper)) return true;
  if (OUTPUT_KEYWORDS_SET.has(upper)) return true;
  if (NAMED_STATS_SET.has(upper)) return true;
  if (/^(BORDER|MAP|DOT|PX)(-[0-9A-F]{1,2})?$/.test(upper)) return true;
  if (/^SOUNDID-\d+$/.test(upper)) return true;
  if (/^NOTIFY(-[0-9A-F]|-DEAD)?$/.test(upper)) return true;
  if (/^TIER-\d+$/.test(upper)) return true;
  if (/^STAT\d+$/.test(upper)) return true;
  if (/^SK\d+$/.test(upper)) return true;
  return false;
}

export function isValidStatId(id: number): boolean {
  return Number.isInteger(id) && id >= 0 && id <= MAX_STAT_ID;
}

export function isKnownSkillId(id: number): boolean {
  return SKILLS_BY_ID[id] !== undefined;
}

export function isKnownClsk(id: number): boolean {
  return CLSK_CLASSES[id] !== undefined;
}

export function isKnownTabsk(id: number): boolean {
  return SKILL_TABS[id] !== undefined;
}

export function isKnownMultiStat(id: number): boolean {
  return MULTI_STAT_LAYERS[id] !== undefined;
}

export function infoCodeMeta(code: string) {
  return INFO_CODES_BY_CODE[code.toUpperCase()];
}

export function namedStatMeta(code: string) {
  return NAMED_STATS_BY_CODE[code.toUpperCase()];
}
