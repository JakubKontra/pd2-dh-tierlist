import type { ClassName } from "../data/types";
import { classColor } from "./ClassBadge";

interface Props {
  cls: ClassName;
  size?: number;
  color?: string;
}

export function ClassIcon({ cls, size = 14, color: colorProp }: Props) {
  const color = colorProp ?? classColor(cls);
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    "aria-hidden": true as const,
  };

  switch (cls) {
    case "Amazon":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={2} strokeLinecap="round" fill="none">
            <path d="M6 26L26 6" />
            <path d="M4 8c4 6 16 18 20 16" />
            <circle cx="6" cy="26" r="1.5" fill={color} />
            <path d="M26 6l-3 1 1-3z" fill={color} stroke="none" />
          </g>
        </svg>
      );
    case "Assassin":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={2} strokeLinecap="round" fill="none">
            <path d="M4 6L28 26" />
            <path d="M28 6L4 26" />
            <path d="M4 6l5 1-1-5z" fill={color} stroke="none" />
            <path d="M28 6l-5 1 1-5z" fill={color} stroke="none" />
            <path d="M4 26l5-1-1 5z" fill={color} stroke="none" />
            <path d="M28 26l-5-1 1 5z" fill={color} stroke="none" />
          </g>
        </svg>
      );
    case "Barbarian":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none">
            <path d="M16 4l-3 4h-3l2 4 4 2 4-2 2-4h-3z" fill={color} />
            <path d="M8 14c0 6 4 10 8 12 4-2 8-6 8-12" />
            <path d="M13 19l3 3 3-3" />
          </g>
        </svg>
      );
    case "Druid":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none">
            <path d="M6 10l4-4 4 3 2-2 2 2 4-3 4 4-2 4 2 3-4 2-2 5h-8l-2-5-4-2 2-3z" />
            <circle cx="12" cy="14" r="1.2" fill={color} stroke="none" />
            <circle cx="20" cy="14" r="1.2" fill={color} stroke="none" />
            <path d="M14 20c1 1 3 1 4 0" />
          </g>
        </svg>
      );
    case "Necromancer":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none">
            <path d="M9 14c0-5 3-8 7-8s7 3 7 8c0 3-1 5-3 6v3h-8v-3c-2-1-3-3-3-6z" />
            <circle cx="13" cy="14" r="1.4" fill={color} stroke="none" />
            <circle cx="19" cy="14" r="1.4" fill={color} stroke="none" />
            <path d="M15 19l1 1 1-1" />
            <path d="M11 26h10" />
            <path d="M13 24v4M16 24v4M19 24v4" />
          </g>
        </svg>
      );
    case "Paladin":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none">
            <path d="M16 4l10 3v8c0 6-4 11-10 14-6-3-10-8-10-14V7z" />
            <path d="M16 10v12" />
            <path d="M10 14h12" />
          </g>
        </svg>
      );
    case "Sorceress":
      return (
        <svg {...common}>
          <g stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none">
            <circle cx="16" cy="16" r="6" />
            <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6 6l3 3M23 23l3 3M6 26l3-3M23 9l3-3" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "Unknown":
    default:
      return (
        <svg {...common}>
          <path
            d="M16 4L28 16L16 28L4 16Z"
            fill="none"
            stroke={color}
            strokeWidth={1.8}
          />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="14"
            fill={color}
            fontFamily="monospace"
          >
            ?
          </text>
        </svg>
      );
  }
}
