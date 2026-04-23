import type {
  ConditionAtom,
  ConditionNode,
  Diagnostic,
  ValueExpr,
  ValueOp,
} from "./types";
import { tokenize, type Token } from "./tokenizer";

export function parseConditions(
  input: string,
  line: number,
  diagnostics: Diagnostic[]
): ConditionNode | null {
  const trimmed = input.trim();
  if (trimmed === "") return null;

  const tokens = tokenize(input);
  const p = new Parser(tokens, line, input, diagnostics);
  const node = p.parseOr();
  if (!p.atEnd()) {
    p.diag(`Unexpected token after condition`, p.peek().pos);
  }
  return node;
}

class Parser {
  i = 0;
  tokens: Token[];
  line: number;
  src: string;
  diagnostics: Diagnostic[];

  constructor(tokens: Token[], line: number, src: string, diagnostics: Diagnostic[]) {
    this.tokens = tokens;
    this.line = line;
    this.src = src;
    this.diagnostics = diagnostics;
  }

  peek(n = 0): Token { return this.tokens[this.i + n]; }
  advance(): Token { return this.tokens[this.i++]; }
  atEnd(): boolean { return this.peek().type === "eof"; }

  diag(message: string, col: number, length = 1) {
    this.diagnostics.push({ severity: "error", message, line: this.line, col, length, code: "parse" });
  }

  parseOr(): ConditionNode | null {
    const first = this.parseAnd();
    if (!first) return null;
    const children: ConditionNode[] = [first];
    while (this.peek().type === "or") {
      this.advance();
      const next = this.parseAnd();
      if (next) children.push(next);
    }
    if (children.length === 1) return children[0];
    return { kind: "or", children };
  }

  parseAnd(): ConditionNode | null {
    const first = this.parseNot();
    if (!first) return null;
    const children: ConditionNode[] = [first];
    while (true) {
      const t = this.peek();
      if (t.type === "and") {
        this.advance();
        const next = this.parseNot();
        if (next) children.push(next);
        continue;
      }
      // Implicit AND: next token starts another atom (ident / not / lparen).
      if (t.type === "ident" || t.type === "not" || t.type === "lparen") {
        const next = this.parseNot();
        if (next) children.push(next);
        continue;
      }
      break;
    }
    if (children.length === 1) return children[0];
    return { kind: "and", children };
  }

  parseNot(): ConditionNode | null {
    if (this.peek().type === "not") {
      this.advance();
      const child = this.parseNot();
      if (!child) return null;
      return { kind: "not", child };
    }
    return this.parseAtom();
  }

  parseAtom(): ConditionNode | null {
    const t = this.peek();
    if (t.type === "lparen") {
      this.advance();
      const inner = this.parseOr();
      if (this.peek().type === "rparen") this.advance();
      else this.diag("Expected ')'", this.peek().pos);
      return inner;
    }
    if (t.type === "ident") {
      // Disambiguate MULTI / FORMULA / value / boolean
      const name = t.value;
      const upper = name.toUpperCase();
      // MULTI### - stat id is baked into the identifier by the tokenizer
      const multiMatch = upper.match(/^MULTI(\d+)$/);
      if (multiMatch) {
        return this.parseMulti(Number(multiMatch[1]));
      }
      if (upper === "MULTI") {
        return this.parseMulti(null);
      }
      if (upper.startsWith("FORMULA")) {
        this.advance();
        return { kind: "atom", atom: { type: "formula", key: name } };
      }
      return this.parseBoolOrValue();
    }
    // Unexpected
    if (t.type !== "eof") {
      this.diag(`Unexpected token '${tokenLabel(t)}'`, t.pos);
      this.advance();
    }
    return null;
  }

  parseMulti(prebakedStat: number | null): ConditionNode | null {
    const startPos = this.peek().pos;
    this.advance(); // MULTI or MULTI###
    let stat: number | null = prebakedStat;
    if (stat === null) {
      stat = this.expectNumber();
    }
    if (stat === null) return { kind: "atom", atom: unknownAtom(this.src, startPos) };
    if (!this.consumeOp(",")) this.diag("MULTI expects ','", this.peek().pos);
    const layer = this.expectNumber();
    if (layer === null) return { kind: "atom", atom: unknownAtom(this.src, startPos) };
    const op = this.consumeCompareOp();
    if (op === null) {
      this.diag("MULTI expects comparison op (=, <, >)", this.peek().pos);
      return { kind: "atom", atom: unknownAtom(this.src, startPos) };
    }
    if (op === "~") {
      this.diag("'~' not supported for MULTI", this.peek().pos);
      return { kind: "atom", atom: unknownAtom(this.src, startPos) };
    }
    const value = this.expectNumber();
    if (value === null) return { kind: "atom", atom: unknownAtom(this.src, startPos) };
    return { kind: "atom", atom: { type: "multi", stat, layer, op, value } };
  }

  parseBoolOrValue(): ConditionNode | null {
    // Parse ValueExpr = Term ('+' Term)*
    const first = this.advance(); // consume ident
    const terms: ValueExpr[] = [{ kind: "code", code: first.type === "ident" ? first.value : "" }];
    while (this.peek().type === "op" && (this.peek() as { value: string }).value === "+") {
      this.advance();
      const t = this.peek();
      if (t.type !== "ident") {
        this.diag("Expected identifier after '+'", t.pos);
        break;
      }
      this.advance();
      terms.push({ kind: "code", code: t.value });
    }
    const maybeOp = this.peek();
    if (maybeOp.type === "op" && isCompareOp((maybeOp as { value: string }).value)) {
      const op = (maybeOp as { value: ValueOp }).value;
      this.advance();
      const rhs = this.expectNumber();
      if (rhs === null) {
        return { kind: "atom", atom: { type: "unknown", raw: first.type === "ident" ? first.value : "" } };
      }
      let rhsHigh: number | undefined;
      if (op === "~") {
        if (this.peek().type === "op" && (this.peek() as { value: string }).value === "-") {
          this.advance();
          const hi = this.expectNumber();
          if (hi === null) return { kind: "atom", atom: { type: "unknown", raw: "" } };
          rhsHigh = hi;
        } else {
          this.diag("'~' expects a range like N-M", this.peek().pos);
        }
      }
      const lhs: ValueExpr = terms.length === 1 ? terms[0] : { kind: "sum", terms };
      return { kind: "atom", atom: { type: "value", lhs, op, rhs, rhsHigh } };
    }
    // No op → treat as boolean. If there was a '+' chain, that's invalid as boolean.
    if (terms.length > 1) {
      this.diag("Addition of codes requires a comparison operator", first.pos);
      return { kind: "atom", atom: { type: "unknown", raw: terms.map((t) => (t.kind === "code" ? t.code : "")).join("+") } };
    }
    const code = first.type === "ident" ? first.value : "";
    return { kind: "atom", atom: { type: "boolean", code } };
  }

  consumeCompareOp(): ValueOp | null {
    const t = this.peek();
    if (t.type === "op" && isCompareOp(t.value)) {
      this.advance();
      return t.value as ValueOp;
    }
    return null;
  }

  consumeOp(which: string): boolean {
    const t = this.peek();
    if (t.type === "op" && (t as { value: string }).value === which) {
      this.advance();
      return true;
    }
    return false;
  }

  expectNumber(): number | null {
    // Allow an optional leading '-' for negative numbers via unary '-'
    let sign = 1;
    if (this.peek().type === "op" && (this.peek() as { value: string }).value === "-") {
      sign = -1;
      this.advance();
    }
    const t = this.peek();
    if (t.type === "number") {
      this.advance();
      return sign * t.value;
    }
    this.diag("Expected number", t.pos);
    return null;
  }
}

function isCompareOp(op: string): op is ValueOp {
  return op === "=" || op === "<" || op === ">" || op === "~";
}

function tokenLabel(t: Token): string {
  switch (t.type) {
    case "ident": return t.value;
    case "number": return String(t.value);
    case "op": return t.value;
    case "lparen": return "(";
    case "rparen": return ")";
    case "and": return "AND";
    case "or": return "OR";
    case "not": return "!";
    case "eof": return "<eof>";
  }
}

function unknownAtom(src: string, pos: number): ConditionAtom {
  return { type: "unknown", raw: src.slice(pos) };
}
