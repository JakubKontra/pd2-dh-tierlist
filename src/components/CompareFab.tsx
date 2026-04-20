import { Link, useLocation } from "react-router-dom";
import { MAX_PINS, useCompare } from "../store/compare";

export function CompareFab() {
  const pinned = useCompare((s) => s.pinned);
  const loc = useLocation();
  if (pinned.length === 0) return null;
  if (loc.pathname === "/compare") return null;

  return (
    <Link
      to="/compare"
      className="fixed bottom-5 right-5 z-50 panel-hi px-4 py-3 flex items-center gap-3 shadow-lg hover:border-d2-gold transition-colors"
      style={{
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.3)",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="#d4af37"
        aria-hidden
      >
        <path d="M8 1l2 4.5 4.5.4-3.4 3 1 4.5L8 11l-4.1 2.4 1-4.5L1.5 5.9l4.5-.4L8 1z" />
      </svg>
      <span className="uppercase tracking-wider text-sm text-d2-gold">
        Compare
      </span>
      <span className="font-mono text-xs text-stone-400 tabular-nums">
        {pinned.length} / {MAX_PINS}
      </span>
    </Link>
  );
}
