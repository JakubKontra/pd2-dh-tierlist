import type { NotificationSpec, Output, OutputPart } from "./types";

// Parses the output portion of an ItemDisplay rule.
// Input: everything after the `]:` marker, up to and including an optional trailing `//` comment.
// Returns the Output AST plus the inline comment (if any).
//
// The rule format:
//    <name-and-description-mix> [// inline comment]
// where `name` is everything outside `{...}`, `description` is inside `{...}`.
// `%KEYWORD%` tokens are recognized (colors, notifications, values, CONTINUE, NL, CL, CS).

export function parseOutput(raw: string): { output: Output; inlineComment?: string } {
  // Split off inline comment first (// that is NOT inside a keyword)
  let body = raw;
  let inlineComment: string | undefined;
  const commentIdx = findTopLevelComment(raw);
  if (commentIdx !== -1) {
    inlineComment = raw.slice(commentIdx + 2);
    body = raw.slice(0, commentIdx);
  }
  // Strip surrounding whitespace (spaces first, then tabs) per wiki:
  // "Whitespace surrounding the Output of each rule gets removed prior to evaluation
  // (spaces first, followed by tabs)".
  body = body.replace(/^ +/, "").replace(/^\t+/, "").replace(/ +$/, "").replace(/\t+$/, "");

  const name: OutputPart[] = [];
  const description: OutputPart[] = [];
  let hasDescription = false;
  const notifications: NotificationSpec[] = [];
  let continueFlag = false;
  let priceColor: string | undefined;

  let i = 0;
  const n = body.length;
  let textBuf = "";
  const current = (): OutputPart[] => (hasDescription && inBraces ? description : name);
  let inBraces = false;

  const flushText = (target: OutputPart[]) => {
    if (textBuf !== "") {
      target.push({ kind: "text", value: textBuf });
      textBuf = "";
    }
  };

  while (i < n) {
    const ch = body[i];

    // Start / end of description braces
    if (ch === "{" && !inBraces) {
      flushText(name);
      inBraces = true;
      hasDescription = true;
      i++;
      continue;
    }
    if (ch === "}" && inBraces) {
      flushText(description);
      inBraces = false;
      i++;
      continue;
    }

    // Keyword %…%
    if (ch === "%") {
      const end = body.indexOf("%", i + 1);
      if (end === -1) {
        // unterminated keyword - treat as literal text
        textBuf += ch;
        i++;
        continue;
      }
      flushText(current());
      const raw = body.slice(i, end + 1); // includes surrounding %
      const inner = body.slice(i + 1, end); // e.g. "MAP-84", "RED", "CONTINUE"
      const upper = inner.toUpperCase();

      // Semantic parse
      if (upper === "CONTINUE") {
        continueFlag = true;
      } else if (matchNotification(upper, notifications)) {
        // recorded in notifications list, but ALSO leave the keyword token visible
        // so serialize is faithful. Notifications are additive per wiki (second pass).
        current().push({ kind: "keyword", raw });
      } else {
        current().push({ kind: "keyword", raw });
      }
      i = end + 1;
      continue;
    }

    textBuf += ch;
    i++;
  }
  flushText(current());

  // Trailing space + color on the NAME side is the price color for SHOP items (wiki)
  // Heuristic: if the LAST non-whitespace name part is a color keyword preceded by text,
  // we can flag it. Not strictly necessary for round-trip fidelity, so we leave it absent.
  const lastName = [...name].reverse().find((p) => p.kind !== "text" || p.value.trim() !== "");
  if (lastName?.kind === "keyword") {
    const kw = lastName.raw.slice(1, -1).toUpperCase();
    if (isColorKeyword(kw)) priceColor = kw;
  }

  return {
    output: {
      name: stripTrailingWhitespace(name),
      description,
      hasDescription,
      continue: continueFlag,
      notifications,
      priceColor,
    },
    inlineComment: inlineComment?.trimStart(),
  };
}

function findTopLevelComment(body: string): number {
  // Find `//` not inside a `%…%` keyword.
  let inKeyword = false;
  for (let i = 0; i < body.length - 1; i++) {
    const ch = body[i];
    if (ch === "%") inKeyword = !inKeyword;
    else if (!inKeyword && ch === "/" && body[i + 1] === "/") return i;
  }
  return -1;
}

function matchNotification(upper: string, sink: NotificationSpec[]): boolean {
  let m: RegExpMatchArray | null;
  if ((m = upper.match(/^BORDER-([0-9A-F]{1,2})$/))) {
    sink.push({ kind: "border", colorHex: m[1] });
    return true;
  }
  if ((m = upper.match(/^MAP(?:-([0-9A-F]{1,2}))?$/))) {
    sink.push({ kind: "map", colorHex: m[1] });
    return true;
  }
  if ((m = upper.match(/^DOT-([0-9A-F]{1,2})$/))) {
    sink.push({ kind: "dot", colorHex: m[1] });
    return true;
  }
  if ((m = upper.match(/^PX-([0-9A-F]{1,2})$/))) {
    sink.push({ kind: "px", colorHex: m[1] });
    return true;
  }
  if ((m = upper.match(/^SOUNDID-(\d+)$/))) {
    sink.push({ kind: "sound", soundId: Number(m[1]) });
    return true;
  }
  if ((m = upper.match(/^NOTIFY-([0-9A-F]|DEAD)$/))) {
    sink.push({ kind: "notify", colorCode: m[1] });
    return true;
  }
  if ((m = upper.match(/^TIER-(\d+)$/))) {
    sink.push({ kind: "tier", level: Number(m[1]) });
    return true;
  }
  return false;
}

const COLOR_KW = new Set([
  "WHITE","GRAY","BLUE","YELLOW","GOLD","GREEN","DARK_GREEN","TAN","BLACK","PURPLE","RED","ORANGE","CORAL","SAGE","TEAL","LIGHT_GRAY",
]);
function isColorKeyword(upper: string): boolean {
  return COLOR_KW.has(upper);
}

function stripTrailingWhitespace(parts: OutputPart[]): OutputPart[] {
  const copy = [...parts];
  while (copy.length > 0) {
    const last = copy[copy.length - 1];
    if (last.kind === "text") {
      const trimmed = last.value.replace(/\s+$/, "");
      if (trimmed === "") {
        copy.pop();
        continue;
      }
      copy[copy.length - 1] = { kind: "text", value: trimmed };
      break;
    }
    break;
  }
  return copy;
}
