import { useState } from "react";
import { skillIconFor } from "../../data/lateGame/skillIcons";

interface Props {
  buildName: string;
  size?: number;
}

export function SkillIcon({ buildName, size = 20 }: Props) {
  const src = skillIconFor(buildName);
  const [broken, setBroken] = useState(false);
  if (!src || broken) return null;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="inline-block rounded-sm border border-border/50 shrink-0"
      style={{ imageRendering: "pixelated" }}
      onError={() => setBroken(true)}
      aria-hidden
    />
  );
}
