import type { ClassName } from "../../data/types";
import { classColor } from "../ClassBadge";

interface Props {
  name: string;
  cls: ClassName;
  className?: string;
  title?: string;
}

export function SkillName({ name, cls, className = "", title }: Props) {
  return (
    <span
      className={`font-semibold ${className}`}
      style={{ color: classColor(cls) }}
      title={title ?? `${name} · ${cls}`}
    >
      {name}
    </span>
  );
}
