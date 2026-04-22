import { useMemo } from "react";
import { useLateGame, LATE_GAME_SHEET_URL } from "../data/lateGame/fetchSheet";
import { buildClassLookup } from "../data/lateGame/classLookup";
import { ErrorState, LoadingState } from "../components/LoadState";
import { PageHero } from "../components/PageHero";
import { LegendPanel } from "../components/lateGame/LegendPanel";
import { ClassBuildTable } from "../components/lateGame/ClassBuildTable";
import { RankedList } from "../components/lateGame/RankedList";
import { BossLineup } from "../components/lateGame/BossLineup";
import { MapImmunityTable } from "../components/lateGame/MapImmunityTable";
import { MoversPanel } from "../components/lateGame/MoversPanel";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl uppercase tracking-widest text-d2-gold mt-10 mb-4 pb-1 border-b border-border/60">
      {children}
    </h2>
  );
}

export function LateGame() {
  const { data, loading, error, refetch } = useLateGame();
  const classOf = useMemo(
    () => (data ? buildClassLookup(data.classTables) : () => "Unknown" as const),
    [data]
  );

  if (loading && !data) return <LoadingState message="Summoning late-game infographic…" />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  const soloMapTop = data.rankings.find((r) => r.title === "Solo Mapping Top 10");
  const soloOverall = data.rankings.find(
    (r) => r.title === "Solo Top 10 Overall (Starting/Mapping/Bosses)"
  );
  const classPower = data.rankings.find((r) => r.title === "Overall Class Power Ranking");
  const dungeonBuddies = data.rankings.find((r) => r.title === "Top Dungeon Buddies");
  const soloDungeon = data.rankings.find((r) => r.title === "Solo Dungeon Capable");

  const starter = data.bossLineups.find(
    (b) => b.title === "DH's Starter Line-up (Recommended Starter Builds)"
  );
  const overallStarters = data.bossLineups.find((b) => b.title === "Overall Top 10 Starters");
  const uber = data.bossLineups.find((b) => b.title === "DH's Recommended Uber Tristram Builds");
  const uberTop = data.bossLineups.find((b) => b.title === "Overall Top 10 Uber Tristram Builds");
  const dclone = data.bossLineups.find((b) => b.title === "DH's Recommended Dclone Killers");
  const dcloneTop = data.bossLineups.find((b) => b.title === "Overall Top 10 Dclone Killers");
  const rathma = data.bossLineups.find((b) => b.title === "DH's Recommended Rathma Killers");
  const rathmaTop = data.bossLineups.find((b) => b.title === "Overall Top 10 Rathma Killers");
  const lucion = data.bossLineups.find((b) => b.title === "DH's Recommended Lucion Killers");
  const lucionTop = data.bossLineups.find((b) => b.title === "Overall Top 10 Lucion Killers");

  return (
    <div>
      <PageHero
        title="Dark Humility"
        subtitle={
          <>
            Late-Game Mapping Tier List &amp; Infographic — Season 13 Betrayal
          </>
        }
        note={
          <>
            Categorical tiering across per-class builds, boss lineups, and map immunities ·{" "}
            <a
              href={LATE_GAME_SHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="text-d2-unique hover:underline"
            >
              view source sheet ↗
            </a>
          </>
        }
      />

      <LegendPanel lines={data.legend} />

      <SectionHeading>Class Build Tiers</SectionHeading>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {data.classTables.map((t) => (
          <ClassBuildTable key={t.className} table={t} />
        ))}
      </div>

      <SectionHeading>Rankings</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {soloMapTop && (
          <RankedList title={soloMapTop.title} entries={soloMapTop.entries} classOf={classOf} />
        )}
        {soloOverall && (
          <RankedList title={soloOverall.title} entries={soloOverall.entries} classOf={classOf} showTier={false} />
        )}
        {classPower && (
          <RankedList title={classPower.title} entries={classPower.entries} classOf={classOf} showTier={false} />
        )}
        {dungeonBuddies && (
          <RankedList title={dungeonBuddies.title} entries={dungeonBuddies.entries} classOf={classOf} showTier={false} compact />
        )}
        {soloDungeon && (
          <RankedList title={soloDungeon.title} entries={soloDungeon.entries} classOf={classOf} showTier={false} compact />
        )}
      </div>

      <SectionHeading>S12 → S13 Changes</SectionHeading>
      <MoversPanel movers={data.movers} newOnSeason={data.newOnSeason} classOf={classOf} />

      <SectionHeading>Starter Lineups</SectionHeading>
      <div className="space-y-4">
        {starter && <BossLineup lineup={starter} classOf={classOf} />}
        {overallStarters && <BossLineup lineup={overallStarters} classOf={classOf} />}
      </div>

      <SectionHeading>Boss Killer Lineups</SectionHeading>
      <div className="space-y-4">
        {uber && <BossLineup lineup={uber} classOf={classOf} />}
        {uberTop && <BossLineup lineup={uberTop} classOf={classOf} />}
        {dclone && <BossLineup lineup={dclone} classOf={classOf} />}
        {dcloneTop && <BossLineup lineup={dcloneTop} classOf={classOf} />}
        {rathma && <BossLineup lineup={rathma} classOf={classOf} />}
        {rathmaTop && <BossLineup lineup={rathmaTop} classOf={classOf} />}
        {lucion && <BossLineup lineup={lucion} classOf={classOf} />}
        {lucionTop && <BossLineup lineup={lucionTop} classOf={classOf} />}
      </div>

      <SectionHeading>Map Tiers &amp; Immunities</SectionHeading>
      <MapImmunityTable data={data.mapImmunities} />

      <div className="pt-6 mt-8 border-t border-border/50 text-[10px] text-stone-500 text-center font-mono">
        pd2-tierlist · data by Dark Humility · pulled {new Date(data.fetchedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
