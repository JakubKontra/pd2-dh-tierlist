import type {
  ConditionNode,
  FilterFile,
  Output,
  OutputPart,
  Rule,
} from "./types";

export type SerializeOptions = {
  // If true, omit leading comments / blank lines and just emit canonical rules.
  canonical?: boolean;
};

export function serializeFilter(file: FilterFile, opts: SerializeOptions = {}): string {
  const lines: string[] = [];

  for (const lvl of file.strictnessLevels) {
    lines.push(`ItemDisplayFilterName[]: ${lvl.name}`);
  }
  if (file.strictnessLevels.length > 0) lines.push("");

  for (const a of file.aliases) {
    lines.push(`Alias[${a.key}]: ${a.value}`);
  }
  if (file.aliases.length > 0 && !opts.canonical) lines.push("");

  for (const f of file.formulas) {
    lines.push(`Formula[${f.key}]: ${f.expression}`);
  }
  if (file.formulas.length > 0 && !opts.canonical) lines.push("");

  for (const rule of file.rules) {
    if (!opts.canonical) {
      for (const c of rule.leadingComments) lines.push(`// ${c}`);
    }
    lines.push(serializeRule(rule));
  }

  return lines.join("\n");
}

export function serializeRule(rule: Rule): string {
  const conds = rule.conditions ? serializeConditions(rule.conditions) : "";
  const out = serializeOutput(rule.output);
  const prefix = rule.enabled ? "" : "// ";
  const comment = rule.inlineComment ? ` // ${rule.inlineComment}` : "";
  return `${prefix}ItemDisplay[${conds}]:${out ? " " + out : ""}${comment}`;
}

export function serializeConditions(node: ConditionNode): string {
  return serializeNode(node, 0);
}

function serializeNode(node: ConditionNode, depth: number): string {
  switch (node.kind) {
    case "and":
      return node.children.map((c) => parenIfNeeded(c, "and")).join(" ");
    case "or":
      return node.children.map((c) => parenIfNeeded(c, "or")).join(" OR ");
    case "not": {
      // ! binds tight; wrap non-atom children in parens
      const inner = node.child;
      if (inner.kind === "atom") return `!${serializeNode(inner, depth + 1)}`;
      return `!(${serializeNode(inner, depth + 1)})`;
    }
    case "atom":
      return serializeAtom(node);
  }
}

function parenIfNeeded(child: ConditionNode, parentKind: "and" | "or"): string {
  if (parentKind === "and" && child.kind === "or") {
    return `(${serializeNode(child, 0)})`;
  }
  return serializeNode(child, 0);
}

function serializeAtom(node: Extract<ConditionNode, { kind: "atom" }>): string {
  const a = node.atom;
  switch (a.type) {
    case "boolean": return a.code;
    case "formula": return a.key;
    case "unknown": return a.raw;
    case "multi":   return `MULTI${a.stat},${a.layer}${a.op}${a.value}`;
    case "value": {
      const lhs = a.lhs.kind === "code" ? a.lhs.code : a.lhs.terms.map((t) => (t.kind === "code" ? t.code : "")).join("+");
      if (a.op === "~" && a.rhsHigh !== undefined) return `${lhs}~${a.rhs}-${a.rhsHigh}`;
      return `${lhs}${a.op}${a.rhs}`;
    }
  }
}

export function serializeOutput(output: Output): string {
  const name = renderParts(output.name);
  const desc = output.hasDescription ? `{${renderParts(output.description)}}` : "";
  return `${name}${desc}`;
}

function renderParts(parts: OutputPart[]): string {
  return parts.map((p) => (p.kind === "text" ? p.value : p.raw)).join("");
}
