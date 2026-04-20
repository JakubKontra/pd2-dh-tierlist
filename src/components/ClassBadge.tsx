import type { ClassName } from "../data/types";

const CLASS_COLOR: Record<ClassName, string> = {
  Amazon: "var(--color-class-amazon)",
  Assassin: "var(--color-class-assassin)",
  Barbarian: "var(--color-class-barbarian)",
  Druid: "var(--color-class-druid)",
  Necromancer: "var(--color-class-necromancer)",
  Paladin: "var(--color-class-paladin)",
  Sorceress: "var(--color-class-sorceress)",
  Unknown: "#5a4530",
};

const CLASS_ABBR: Record<ClassName, string> = {
  Amazon: "AMA",
  Assassin: "ASN",
  Barbarian: "BAR",
  Druid: "DRU",
  Necromancer: "NEC",
  Paladin: "PAL",
  Sorceress: "SOR",
  Unknown: "???",
};

export function classColor(cls: ClassName): string {
  return CLASS_COLOR[cls];
}

export function ClassBadge({ cls, size = "sm" }: { cls: ClassName; size?: "sm" | "md" }) {
  const px = size === "md" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]";
  return (
    <span
      className={`${px} font-mono uppercase tracking-wider rounded-sm border`}
      style={{
        color: CLASS_COLOR[cls],
        borderColor: CLASS_COLOR[cls],
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
      title={cls}
    >
      {CLASS_ABBR[cls]}
    </span>
  );
}
