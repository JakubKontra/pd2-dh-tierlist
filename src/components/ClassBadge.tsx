import type { ClassName } from "../data/types";
import { ClassIcon } from "./ClassIcon";

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

export function classColor(cls: ClassName): string {
  return CLASS_COLOR[cls];
}

export function ClassBadge({ cls, size = "sm" }: { cls: ClassName; size?: "sm" | "md" }) {
  const isMd = size === "md";
  const iconSize = isMd ? 18 : 13;
  const box = isMd ? "px-1.5 py-0.5" : "px-1 py-0.5";
  return (
    <span
      className={`${box} rounded-sm border inline-flex items-center gap-1 leading-none`}
      style={{
        color: CLASS_COLOR[cls],
        borderColor: CLASS_COLOR[cls],
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
      title={cls}
      aria-label={cls}
    >
      <ClassIcon cls={cls} size={iconSize} />
      {isMd && (
        <span className="font-mono uppercase tracking-wider text-[11px]">
          {cls}
        </span>
      )}
    </span>
  );
}
