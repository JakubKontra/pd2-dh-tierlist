import type { Flag } from "../../data/lateGame/types";

const META: Record<Flag, { bg: string; fg: string; glyph: string; label: string }> = {
  strong: { bg: "var(--color-flag-strong)", fg: "#e8ffe8", glyph: "✔✔✔", label: "Excellent" },
  good:   { bg: "var(--color-flag-good)",   fg: "#0a1a0a", glyph: "✔✔",  label: "Good" },
  ok:     { bg: "var(--color-flag-ok)",     fg: "#1a1200", glyph: "✔",   label: "OK" },
  none:   { bg: "var(--color-flag-none)",   fg: "#ffe8e8", glyph: "❌",   label: "Not recommended" },
  empty:  { bg: "transparent",              fg: "#5a5040", glyph: "",    label: "—" },
};

export function FlagCell({ value }: { value: Flag }) {
  const m = META[value];
  return (
    <span
      className="inline-flex items-center justify-center min-w-[36px] px-1.5 py-0.5 rounded-sm text-xs font-semibold leading-none"
      style={{ backgroundColor: m.bg, color: m.fg }}
      title={m.label}
      aria-label={m.label}
    >
      {m.glyph || "—"}
    </span>
  );
}
