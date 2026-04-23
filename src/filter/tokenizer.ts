// Tokenizer for the CONTENT of `ItemDisplay[...]` brackets.

export type Token =
  | { type: "ident"; value: string; pos: number }
  | { type: "number"; value: number; pos: number }
  | { type: "op"; value: "=" | "<" | ">" | "~" | "+" | "-" | ","; pos: number }
  | { type: "lparen"; pos: number }
  | { type: "rparen"; pos: number }
  | { type: "and"; pos: number }
  | { type: "or"; pos: number }
  | { type: "not"; pos: number }
  | { type: "eof"; pos: number };

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];

    if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
      i++;
      continue;
    }

    if (ch === "(") { tokens.push({ type: "lparen", pos: i }); i++; continue; }
    if (ch === ")") { tokens.push({ type: "rparen", pos: i }); i++; continue; }
    if (ch === "!") { tokens.push({ type: "not", pos: i }); i++; continue; }

    if (ch === "=" || ch === "<" || ch === ">" || ch === "~" || ch === "+" || ch === "-" || ch === ",") {
      // Be careful: '-' could be unary for negative numbers OR a range separator in BETWEEN.
      // Let the parser decide. We still emit '-' as an op token.
      tokens.push({ type: "op", value: ch, pos: i });
      i++;
      continue;
    }

    // Number (no leading sign here; parser stitches unary minus)
    if (ch >= "0" && ch <= "9") {
      const start = i;
      while (i < n && input[i] >= "0" && input[i] <= "9") i++;
      tokens.push({ type: "number", value: Number(input.slice(start, i)), pos: start });
      continue;
    }

    // Identifier: letters, digits, underscore. Keywords AND/OR are matched here.
    if (isIdentStart(ch)) {
      const start = i;
      while (i < n && isIdentContinue(input[i])) i++;
      const raw = input.slice(start, i);
      const upper = raw.toUpperCase();
      if (upper === "AND") tokens.push({ type: "and", pos: start });
      else if (upper === "OR") tokens.push({ type: "or", pos: start });
      else tokens.push({ type: "ident", value: raw, pos: start });
      continue;
    }

    // Unknown character - emit a single-char ident so diagnostics can flag it.
    tokens.push({ type: "ident", value: ch, pos: i });
    i++;
  }

  tokens.push({ type: "eof", pos: n });
  return tokens;
}

function isIdentStart(ch: string): boolean {
  return (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z") || ch === "_";
}

function isIdentContinue(ch: string): boolean {
  return isIdentStart(ch) || (ch >= "0" && ch <= "9");
}
