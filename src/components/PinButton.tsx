import { MAX_PINS, useCompare } from "../store/compare";

interface Props {
  buildId: string;
  size?: "sm" | "md";
  stopPropagation?: boolean;
}

export function PinButton({ buildId, size = "sm", stopPropagation = true }: Props) {
  const pinned = useCompare((s) => s.pinned);
  const togglePin = useCompare((s) => s.togglePin);
  const isPinned = pinned.includes(buildId);
  const full = !isPinned && pinned.length >= MAX_PINS;

  const px =
    size === "md"
      ? "px-2.5 py-1 text-sm gap-1.5"
      : "px-1.5 py-0.5 text-[11px] gap-1";

  return (
    <button
      type="button"
      onClick={(e) => {
        if (stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (full) return;
        togglePin(buildId);
      }}
      disabled={full}
      title={
        isPinned
          ? "Remove from compare"
          : full
            ? `Compare slots full (${MAX_PINS})`
            : "Pin to compare"
      }
      aria-pressed={isPinned}
      className={`${px} font-mono rounded-sm border transition-colors inline-flex items-center shrink-0`}
      style={{
        color: isPinned ? "#0a0805" : full ? "#5a4530" : "#d4af37",
        backgroundColor: isPinned ? "#d4af37" : "rgba(0,0,0,0.4)",
        borderColor: isPinned ? "#d4af37" : full ? "#3a2e20" : "#5a4530",
        cursor: full ? "not-allowed" : "pointer",
      }}
    >
      <PinIcon filled={isPinned} />
      <span className="hidden sm:inline uppercase tracking-wider">
        {isPinned ? "Pinned" : "Compare"}
      </span>
    </button>
  );
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 1l2 4.5 4.5.4-3.4 3 1 4.5L8 11l-4.1 2.4 1-4.5L1.5 5.9l4.5-.4L8 1z" />
    </svg>
  );
}
