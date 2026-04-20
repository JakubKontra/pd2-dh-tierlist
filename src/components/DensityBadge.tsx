import type { DensityProfile } from "../data/types";

interface Props {
  profile: DensityProfile;
  stdDev: number;
  variant?: "dot" | "full";
}

const META: Record<
  DensityProfile,
  { label: string; short: string; color: string; title: string }
> = {
  consistent: {
    label: "Consistent",
    short: "≡",
    color: "#7cb342",
    title: "Low variance across maps — performs similarly regardless of density",
  },
  neutral: {
    label: "Normal",
    short: "·",
    color: "#6a6a6a",
    title: "Average density sensitivity",
  },
  "density-dependent": {
    label: "Dens. dep.",
    short: "↯",
    color: "#e0a030",
    title:
      "High variance across maps — this build needs high density to shine",
  },
};

export function DensityBadge({ profile, stdDev, variant = "full" }: Props) {
  if (profile === "neutral") return null;
  const m = META[profile];
  const tooltip = `${m.label} — std dev ${stdDev.toFixed(1)}. ${m.title}`;

  if (variant === "dot") {
    return (
      <span
        title={tooltip}
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: m.color }}
        aria-label={m.label}
      />
    );
  }

  return (
    <span
      title={tooltip}
      className="px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider rounded-sm border inline-flex items-center gap-1"
      style={{ color: m.color, borderColor: m.color }}
    >
      <span>{m.short}</span>
      <span>{m.label}</span>
    </span>
  );
}
