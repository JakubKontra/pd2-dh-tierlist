import type { RankedEntry } from "../../data/lateGame/types";
import type { ClassLookup } from "../../data/lateGame/classLookup";
import { SkillIcon } from "./SkillIcon";
import { SkillName } from "./SkillName";
import { TierBadge } from "./TierBadge";

interface Props {
  title: string;
  entries: RankedEntry[];
  classOf: ClassLookup;
  showTier?: boolean;
  compact?: boolean;
}

export function RankedList({ title, entries, classOf, showTier = true, compact = false }: Props) {
  return (
    <section className="panel p-4">
      <h4 className="font-display text-base uppercase tracking-wider text-d2-gold mb-2">
        {title}
      </h4>
      <ol className={`space-y-1 ${compact ? "text-xs" : "text-sm"}`}>
        {entries.map((e, i) => (
          <li
            key={i}
            className="flex items-center gap-2 py-0.5 border-b border-border/30 last:border-0"
          >
            <span className="text-stone-500 font-mono w-8 shrink-0">{e.rank}</span>
            <SkillIcon buildName={e.name} size={compact ? 16 : 20} />
            <SkillName
              name={e.name}
              cls={classOf(e.name)}
              className="flex-1 min-w-0 truncate"
            />
            {showTier && e.tier && (
              <span className="shrink-0">
                <TierBadge tier={e.tier} />
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
