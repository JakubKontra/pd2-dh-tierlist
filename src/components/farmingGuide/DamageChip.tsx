const PALETTE: Record<string, { bg: string; fg: string }> = {
  Fire: { bg: "#ff6a3a", fg: "#1a0a05" },
  Cold: { bg: "#7ad2ff", fg: "#061320" },
  Lightning: { bg: "#ffd84a", fg: "#1f1a00" },
  Poison: { bg: "#7fd65a", fg: "#0a1a05" },
  Physical: { bg: "#d8c8a8", fg: "#0a0805" },
  Magic: { bg: "#b388ff", fg: "#0a0620" },
  Multi: { bg: "#a59263", fg: "#0a0805" },
  Any: { bg: "#5a4530", fg: "#e6d6b6" },
  "Find Item": { bg: "#5f9e46", fg: "#0a1a05" },
  Depends: { bg: "#3a2e20", fg: "#d8c8a8" },
};

export function DamageChip({ label }: { label: string }) {
  const p = PALETTE[label] ?? PALETTE.Any;
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider leading-none"
      style={{ backgroundColor: p.bg, color: p.fg }}
    >
      {label}
    </span>
  );
}
