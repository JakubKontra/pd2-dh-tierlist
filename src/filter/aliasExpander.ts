import type { Alias } from "./types";

// Aliases act as simple find-and-replace. We replace longest-key-first to avoid
// one alias eating a substring of another (e.g. FOO vs FOOBAR).
// We only replace whole-word matches (no substring mid-identifier).
export function expandAliases(input: string, aliases: Alias[]): string {
  if (aliases.length === 0) return input;
  const sorted = [...aliases].sort((a, b) => b.key.length - a.key.length);
  let out = input;
  for (const a of sorted) {
    // escape regex meta chars in the key
    const escaped = a.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // match as whole word: boundary = not an identifier character on either side
    const re = new RegExp(`(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`, "g");
    out = out.replace(re, a.value);
  }
  return out;
}
