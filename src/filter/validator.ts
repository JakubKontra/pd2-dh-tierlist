import {
  classifyConditionCode,
  infoCodeMeta,
  isValidStatId,
  PREFIX_MAX,
  SUFFIX_MAX,
  AUTOMOD_MAX,
  isKnownOutputKeyword,
} from "../data/filter";
import type {
  ConditionAtom,
  ConditionNode,
  Diagnostic,
  FilterFile,
  Output,
  OutputPart,
  Rule,
  ValueOp,
} from "./types";

export function validate(file: FilterFile): Diagnostic[] {
  const out: Diagnostic[] = [];

  // Strictness levels cap (12 per wiki, plus implicit "Show All Items" at 0)
  if (file.strictnessLevels.length > 12) {
    out.push({
      severity: "error",
      message: `Up to 12 custom filter strictness levels are allowed (found ${file.strictnessLevels.length})`,
      line: file.strictnessLevels[12]?.sourceLine ?? 1,
      code: "too-many-strictness",
    });
  }

  // Alias key uniqueness
  const aliasKeys = new Set<string>();
  for (const a of file.aliases) {
    if (aliasKeys.has(a.key)) {
      out.push({ severity: "warning", message: `Duplicate alias '${a.key}'`, line: a.sourceLine, code: "duplicate-alias" });
    }
    aliasKeys.add(a.key);
  }

  for (const rule of file.rules) {
    validateRule(rule, out);
  }
  return out;
}

function validateRule(rule: Rule, out: Diagnostic[]) {
  if (rule.conditions) validateConditions(rule.conditions, rule, out);
  validateOutput(rule.output, rule, out);
}

function validateConditions(node: ConditionNode, rule: Rule, out: Diagnostic[]) {
  switch (node.kind) {
    case "and":
    case "or":
      for (const c of node.children) validateConditions(c, rule, out);
      return;
    case "not":
      validateConditions(node.child, rule, out);
      return;
    case "atom":
      validateAtom(node.atom, rule, out);
  }
}

function validateAtom(atom: ConditionAtom, rule: Rule, out: Diagnostic[]) {
  switch (atom.type) {
    case "boolean": {
      const kind = classifyConditionCode(atom.code);
      if (kind === "unknown") {
        out.push({
          severity: "error",
          message: `Unknown code '${atom.code}'`,
          line: rule.sourceLine,
          ruleId: rule.id,
          code: "unknown-code",
        });
      }
      return;
    }
    case "value": {
      const terms = atom.lhs.kind === "code" ? [atom.lhs.code] : atom.lhs.terms.map((t) => (t.kind === "code" ? t.code : ""));
      for (const code of terms) {
        const kind = classifyConditionCode(code);
        if (kind === "unknown") {
          out.push({
            severity: "error",
            message: `Unknown value code '${code}'`,
            line: rule.sourceLine,
            ruleId: rule.id,
            code: "unknown-code",
          });
        }
        if (kind === "numbered-stat") {
          const id = Number(code.slice(4));
          if (!isValidStatId(id)) {
            out.push({ severity: "error", message: `STAT${id} out of range (0..506)`, line: rule.sourceLine, ruleId: rule.id, code: "stat-out-of-range" });
          }
        }
      }
      // Operator restrictions for affix codes
      if (atom.lhs.kind === "code") {
        const info = infoCodeMeta(atom.lhs.code);
        if (info?.validOperators && !info.validOperators.includes(atom.op)) {
          out.push({
            severity: "error",
            message: `Operator '${labelOp(atom.op)}' not allowed with '${info.code}' (allowed: ${info.validOperators.join(", ")})`,
            line: rule.sourceLine,
            ruleId: rule.id,
            code: "invalid-operator",
          });
        }
        if (info?.code === "PREFIX" && atom.rhs > PREFIX_MAX) warnAffixRange("PREFIX", atom.rhs, rule, out);
        if (info?.code === "SUFFIX" && atom.rhs > SUFFIX_MAX) warnAffixRange("SUFFIX", atom.rhs, rule, out);
        if (info?.code === "AUTOMOD" && atom.rhs > AUTOMOD_MAX) warnAffixRange("AUTOMOD", atom.rhs, rule, out);
      }
      return;
    }
    case "multi": {
      if (!isValidStatId(atom.stat)) {
        out.push({ severity: "error", message: `MULTI stat id ${atom.stat} out of range (0..506)`, line: rule.sourceLine, ruleId: rule.id, code: "stat-out-of-range" });
      }
      return;
    }
    case "formula":
      // Could cross-check against known formula keys but parser currently doesn't attach refs to defs.
      return;
    case "unknown":
      out.push({ severity: "error", message: `Unparseable condition near '${atom.raw}'`, line: rule.sourceLine, ruleId: rule.id, code: "unparseable" });
  }
}

function warnAffixRange(kind: string, val: number, rule: Rule, out: Diagnostic[]) {
  out.push({
    severity: "warning",
    message: `${kind} id ${val} exceeds known range`,
    line: rule.sourceLine,
    ruleId: rule.id,
    code: "affix-range",
  });
}

function validateOutput(output: Output, rule: Rule, out: Diagnostic[]) {
  const nameLen = partsTextLength(output.name);
  const descLen = partsTextLength(output.description);
  if (nameLen.display > 56) {
    out.push({ severity: "error", message: `Name exceeds 56 displayed chars (${nameLen.display})`, line: rule.sourceLine, ruleId: rule.id, code: "name-too-long" });
  }
  if (nameLen.internal > 125) {
    out.push({ severity: "error", message: `Name exceeds 125 internal chars (${nameLen.internal}) once color/keyword tokens are counted`, line: rule.sourceLine, ruleId: rule.id, code: "name-too-long-internal" });
  }
  if (descLen.internal > 500) {
    out.push({ severity: "error", message: `Description exceeds 500 chars`, line: rule.sourceLine, ruleId: rule.id, code: "desc-too-long" });
  }
  // Unknown output keywords
  for (const part of [...output.name, ...output.description]) {
    if (part.kind === "keyword") {
      const kw = part.raw.slice(1, -1);
      if (!isKnownOutputKeyword(kw)) {
        out.push({
          severity: "warning",
          message: `Unknown output keyword '%${kw}%'`,
          line: rule.sourceLine,
          ruleId: rule.id,
          code: "unknown-keyword",
        });
      }
    }
  }
}

function partsTextLength(parts: OutputPart[]): { display: number; internal: number } {
  let display = 0;
  let internal = 0;
  for (const p of parts) {
    if (p.kind === "text") {
      display += p.value.length;
      internal += p.value.length;
    } else {
      // Color keywords = 3 internal chars per wiki; %NL% = 2; others variable.
      // Approximation: internal adds at least 2 per keyword.
      internal += Math.max(2, p.raw.length - 2);
    }
  }
  return { display, internal };
}

function labelOp(op: ValueOp): string {
  return op;
}
