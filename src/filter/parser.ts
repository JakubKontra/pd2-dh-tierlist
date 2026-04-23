import type {
  Alias,
  Diagnostic,
  FilterFile,
  Formula,
  ParseResult,
  Rule,
  StrictnessLevel,
} from "./types";
import { expandAliases } from "./aliasExpander";
import { parseConditions } from "./conditionParser";
import { parseOutput } from "./outputParser";

// Whole-file parser. Reads line-by-line, classifies each line, builds the AST.
// Aliases/formulas/strictness are extracted first so subsequent rule bodies can reference them.
//
// The parser is tolerant: unknown / malformed lines don't abort; they surface as
// diagnostics and the remaining lines are still parsed.

const RULE_RE = /^(\s*)(\/\/\s*)?ItemDisplay\[(.*?)\]:(.*)$/;
const ALIAS_RE = /^\s*Alias\[(.*?)\]:(.*)$/;
const FORMULA_RE = /^\s*Formula\[(.*?)\]:(.*)$/;
const FILTERNAME_RE = /^\s*ItemDisplayFilterName\[\]:(.*)$/;

export function parseFilter(input: string): ParseResult {
  const rawLines = input.split(/\r?\n/);
  const diagnostics: Diagnostic[] = [];

  // First pass: pull out aliases / formulas / strictness so they're available for the rule pass.
  const aliases: Alias[] = [];
  const formulas: Formula[] = [];
  const strictnessLevels: StrictnessLevel[] = [];

  rawLines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("//")) return;

    let m: RegExpMatchArray | null;
    if ((m = line.match(FILTERNAME_RE))) {
      const name = stripComment(m[1]).trim();
      if (name) strictnessLevels.push({ id: `lvl${strictnessLevels.length + 1}`, name, sourceLine: lineNo });
      return;
    }
    if ((m = line.match(ALIAS_RE))) {
      const key = m[1].trim();
      const value = stripComment(m[2]).trim();
      if (key) aliases.push({ id: `alias${aliases.length + 1}`, key, value, sourceLine: lineNo });
      return;
    }
    if ((m = line.match(FORMULA_RE))) {
      const key = m[1].trim();
      const expression = stripComment(m[2]).trim();
      if (key) formulas.push({ id: `formula${formulas.length + 1}`, key, expression, sourceLine: lineNo });
      return;
    }
  });

  // Second pass: parse rules. Also capture leading comments for each rule.
  const rules: Rule[] = [];
  let pendingComments: string[] = [];

  rawLines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const trimmed = line.trim();

    if (trimmed === "") {
      pendingComments = [];
      return;
    }

    // Skip already-handled line types
    if (line.match(FILTERNAME_RE) || line.match(ALIAS_RE) || line.match(FORMULA_RE)) {
      pendingComments = [];
      return;
    }

    // Standalone comment line (not a disabled rule)
    if (trimmed.startsWith("//")) {
      if (!/ItemDisplay\[/.test(trimmed)) {
        pendingComments.push(trimmed.replace(/^\/\/\s?/, ""));
        return;
      }
    }

    const m = line.match(RULE_RE);
    if (!m) {
      // Line doesn't match any known construct. Only diagnose if it clearly isn't whitespace.
      if (trimmed !== "") {
        diagnostics.push({
          severity: "warning",
          message: `Ignored line (not a recognized directive)`,
          line: lineNo,
          code: "ignored-line",
        });
      }
      pendingComments = [];
      return;
    }

    const enabled = !m[2];
    const rawConditions = m[3];
    const rawOutput = m[4];

    const expandedConditions = expandAliases(rawConditions, aliases);
    const conditions = parseConditions(expandedConditions, lineNo, diagnostics);

    const expandedOutput = expandAliases(rawOutput, aliases);
    const { output, inlineComment } = parseOutput(expandedOutput);

    rules.push({
      id: `rule${rules.length + 1}`,
      enabled,
      conditions,
      output,
      inlineComment,
      leadingComments: pendingComments,
      sourceLine: lineNo,
    });
    pendingComments = [];
  });

  const file: FilterFile = {
    strictnessLevels,
    aliases,
    formulas,
    rules,
    rawLines,
  };
  return { file, diagnostics };
}

function stripComment(s: string): string {
  const idx = s.indexOf("//");
  if (idx === -1) return s;
  return s.slice(0, idx);
}
