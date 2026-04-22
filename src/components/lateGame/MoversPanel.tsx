import type { MoversSection, NewOnSeason } from "../../data/lateGame/types";
import type { ClassLookup } from "../../data/lateGame/classLookup";
import { SkillIcon } from "./SkillIcon";
import { SkillName } from "./SkillName";
import { TierBadge } from "./TierBadge";

interface Props {
  movers: MoversSection | null;
  newOnSeason: NewOnSeason | null;
  classOf: ClassLookup;
}

export function MoversPanel({ movers, newOnSeason, classOf }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {movers && movers.entries.length > 0 && (
        <section className="panel p-4">
          <h4 className="font-display text-base uppercase tracking-wider text-d2-gold mb-3">
            {movers.title}
          </h4>
          <ol className="space-y-1 text-sm">
            {movers.entries.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-2 py-0.5 border-b border-border/30 last:border-0"
              >
                <span className="text-stone-500 font-mono w-8 shrink-0">{m.rank}</span>
                <SkillIcon buildName={m.name} size={18} />
                <SkillName
                  name={m.name}
                  cls={classOf(m.name)}
                  className="flex-1 min-w-0 truncate"
                />
                <span className="flex items-center gap-1.5 shrink-0">
                  <TierBadge tier={m.from} />
                  <span className="text-stone-500" aria-hidden>→</span>
                  <TierBadge tier={m.to} />
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {newOnSeason && newOnSeason.entries.length > 0 && (
        <section className="panel p-4">
          <h4 className="font-display text-base uppercase tracking-wider text-d2-gold mb-3">
            {newOnSeason.title}
          </h4>
          <ol className="space-y-1 text-sm">
            {newOnSeason.entries.map((e, i) => (
              <li
                key={i}
                className="flex items-center gap-2 py-0.5 border-b border-border/30 last:border-0"
              >
                <span className="text-stone-500 font-mono w-8 shrink-0">{e.rank}</span>
                <SkillIcon buildName={e.name} size={18} />
                <SkillName
                  name={e.name}
                  cls={classOf(e.name)}
                  className="flex-1 min-w-0 truncate"
                />
                {e.tier && (
                  <span className="shrink-0">
                    <TierBadge tier={e.tier} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
