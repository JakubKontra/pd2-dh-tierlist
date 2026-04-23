import { MERC_GUIDE_SHEET_URL, useMercGuide } from "../data/mercGuide/fetchSheet";
import { ErrorState, LoadingState } from "../components/LoadState";
import { PageHero } from "../components/PageHero";
import { RelatedGuides } from "../components/RelatedGuides";
import { MercBuildTable } from "../components/mercGuide/MercBuildTable";
import { StatPriorityGrid } from "../components/mercGuide/StatPriorityGrid";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl uppercase tracking-widest text-d2-gold mt-10 mb-4 pb-1 border-b border-border/60">
      {children}
    </h2>
  );
}

export function MercGuide() {
  const { data, loading, error, refetch } = useMercGuide();

  if (loading && !data) return <LoadingState message="Summoning merc guide…" />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <PageHero
        title="Ultimate Solo Farm Mercenary Guide"
        subtitle={<>Dark Humility — Offensive / Defensive / Starter merc setups per build</>}
        note={
          <>
            Merc types and key items per build, plus stat priorities per act ·{" "}
            <a
              href={MERC_GUIDE_SHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="text-d2-unique hover:underline"
            >
              view source sheet ↗
            </a>
          </>
        }
      />
      <RelatedGuides current="mercenary-guide" />

      <SectionHeading>Merc Setups by Build</SectionHeading>
      <MercBuildTable rows={data.builds} />

      <SectionHeading>Stat Prioritization (by Merc Act)</SectionHeading>
      <StatPriorityGrid priorities={data.priorities} />

      <div className="pt-6 mt-8 border-t border-border/50 text-[10px] text-stone-500 text-center font-mono">
        pd2-tierlist · data by Dark Humility · pulled {new Date(data.fetchedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
