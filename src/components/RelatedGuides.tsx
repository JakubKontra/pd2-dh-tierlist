import { NavLink } from "react-router-dom";

type GuideKey = "tierlist" | "late-game" | "farming-guide" | "mercenary-guide";

const GUIDES: { key: GuideKey; to: string; label: string; blurb: string }[] = [
  {
    key: "tierlist",
    to: "/",
    label: "Full Tierlist",
    blurb: "All tested builds with normalized MPM",
  },
  {
    key: "late-game",
    to: "/late-game",
    label: "Late Game",
    blurb: "Per-class late-game tiers + boss lineups",
  },
  {
    key: "farming-guide",
    to: "/farming-guide",
    label: "Farming Guide",
    blurb: "Starter builds + best farms per act",
  },
  {
    key: "mercenary-guide",
    to: "/mercenary-guide",
    label: "Merc Guide",
    blurb: "Offensive/defensive merc + items per build",
  },
];

export function RelatedGuides({ current }: { current: GuideKey }) {
  const others = GUIDES.filter((g) => g.key !== current);
  return (
    <nav
      className="flex flex-wrap justify-center gap-2 text-xs mb-6"
      aria-label="Related guides"
    >
      <span className="text-stone-500 uppercase tracking-widest text-[10px] self-center mr-1">
        Also see
      </span>
      {others.map((g) => (
        <NavLink
          key={g.key}
          to={g.to}
          className="panel px-3 py-1.5 hover:border-d2-unique transition-colors inline-flex items-baseline gap-2"
        >
          <span className="text-d2-gold font-display uppercase tracking-wider">
            {g.label}
          </span>
          <span className="text-stone-500 hidden sm:inline">— {g.blurb}</span>
        </NavLink>
      ))}
    </nav>
  );
}
