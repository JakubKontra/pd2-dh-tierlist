import { useFarmingGuide, FARMING_GUIDE_SHEET_URL } from "../data/farmingGuide/fetchSheet";
import { ErrorState, LoadingState } from "../components/LoadState";
import { PageHero } from "../components/PageHero";
import { RelatedGuides } from "../components/RelatedGuides";
import { ProgressionSteps } from "../components/farmingGuide/ProgressionSteps";
import { StarterBuildsGrid } from "../components/farmingGuide/StarterBuildsGrid";
import { FarmingAreaTable } from "../components/farmingGuide/FarmingAreaTable";
import { LegendSection } from "../components/farmingGuide/LegendSection";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl uppercase tracking-widest text-d2-gold mt-10 mb-4 pb-1 border-b border-border/60">
      {children}
    </h2>
  );
}

export function FarmingGuide() {
  const { data, loading, error, refetch } = useFarmingGuide();

  if (loading && !data) return <LoadingState message="Summoning farming guide…" />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <PageHero
        title="Ultimate Farming Guide"
        subtitle={<>Dark Humility — Solo Progression &amp; Per-Act Farming Reference</>}
        note={
          <>
            Starter builds, best LOD farms per act, and wealth-generation rank ·{" "}
            <a
              href={FARMING_GUIDE_SHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="text-d2-unique hover:underline"
            >
              view source sheet ↗
            </a>
          </>
        }
      />
      <RelatedGuides current="farming-guide" />

      <SectionHeading>Solo Progression</SectionHeading>
      <ProgressionSteps steps={data.progression} />

      <SectionHeading>Starter Builds by Class</SectionHeading>
      <StarterBuildsGrid groups={data.builds} />

      <SectionHeading>Best LOD Farming Areas</SectionHeading>
      <FarmingAreaTable acts={data.acts} />

      <SectionHeading>Column Legend</SectionHeading>
      <LegendSection entries={data.legend} />

      <SectionHeading>Solo Self-Found Progression</SectionHeading>
      <ProgressionSteps steps={data.soloSelfFound} />

      <div className="pt-6 mt-8 border-t border-border/50 text-[10px] text-stone-500 text-center font-mono">
        pd2-tierlist · data by Dark Humility · pulled {new Date(data.fetchedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
