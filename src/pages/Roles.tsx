import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTierlist } from "../data/fetchSheet";
import { useFilters } from "../store/filters";
import { ErrorState, LoadingState } from "../components/LoadState";
import { ClassBadge } from "../components/ClassBadge";
import { ClassIcon } from "../components/ClassIcon";
import { FilterBar } from "../components/FilterBar";
import { tierColorVar } from "../data/tiering";
import { allClassRoleScores, roleScoreFor } from "../data/classScores";
import type { Build, ClassName, Season } from "../data/types";

const AFFINITY_DECAY = 0.08;

function mappingAffinityScore(normMpm: number, cls: ClassName): number {
  const rs = roleScoreFor(cls)?.mapping ?? 7;
  const multiplier = Math.max(0, 1 - (rs - 1) * AFFINITY_DECAY);
  return normMpm * multiplier;
}

const MAX_MAPPING = 30;
const BUILDS_PER_CLASS_IN_CURATED = 3;

export function Roles() {
  const { data, loading, error, refetch } = useTierlist();
  const { classFilter, search, retestedFilter, seasonFilter } = useFilters();

  const availableSeasons = useMemo<Set<Season>>(() => {
    const set = new Set<Season>();
    if (!data) return set;
    for (const b of data.builds) if (b.season) set.add(b.season);
    return set;
  }, [data]);

  const filtered = useMemo<Build[]>(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.builds.filter((b) => {
      if (classFilter !== "All" && b.className !== classFilter) return false;
      if (q && !b.displayName.toLowerCase().includes(q)) return false;
      if (retestedFilter === "retested" && b.retested !== true) return false;
      if (retestedFilter === "not-retested" && b.retested === true) return false;
      if (seasonFilter !== "all" && b.season !== seasonFilter) return false;
      if (b.className === "Unknown") return false;
      return true;
    });
  }, [data, classFilter, search, retestedFilter, seasonFilter]);

  const mappingEntries = useMemo(() => {
    const scored = filtered.map((b) => ({
      build: b,
      score: mappingAffinityScore(b.avgNormalizedMpm, b.className),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, MAX_MAPPING);
  }, [filtered]);

  const mappingTopClasses = useMemo(
    () =>
      [...allClassRoleScores()]
        .sort((a, b) => a.score.mapping - b.score.mapping)
        .slice(0, 3)
        .map((c) => c.className),
    []
  );

  const curatedStarter = useMemo(
    () => buildCuratedRoleColumn(filtered, "starter"),
    [filtered]
  );
  const curatedBossing = useMemo(
    () => buildCuratedRoleColumn(filtered, "bossing"),
    [filtered]
  );

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <div className="mb-4">
        <h1 className="heading-gold text-3xl sm:text-4xl mb-1">By Role</h1>
        <p className="text-stone-400 text-sm">
          Mapping is ranked by{" "}
          <span className="text-d2-gold">blended role score</span> — derived
          from actual MPM data. Starter and Bossing reflect{" "}
          <span className="text-d2-gold">Dark Humility's class curation</span>
          {" "}and are NOT derived from MPM (MPM is a mapping metric — it does
          not measure starter viability or single-target boss performance).
        </p>
      </div>
      <FilterBar
        total={data.builds.length}
        visible={filtered.length}
        availableSeasons={availableSeasons}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MappingColumn
          entries={mappingEntries}
          topClasses={mappingTopClasses}
        />
        <CuratedColumn
          title="League Starter"
          blurb="Best from scratch, no gear"
          role="starter"
          groups={curatedStarter}
        />
        <CuratedColumn
          title="Bossing"
          blurb="Best for Uber/boss kills"
          role="bossing"
          groups={curatedBossing}
        />
      </div>
    </div>
  );
}

// ========= MAPPING (data-derived) =========

interface MappingEntry {
  build: Build;
  score: number;
}

function MappingColumn({
  entries,
  topClasses,
}: {
  entries: MappingEntry[];
  topClasses: ClassName[];
}) {
  return (
    <section className="panel p-3">
      <header className="mb-3 pb-2 border-b border-border/60">
        <div className="flex items-center justify-between mb-1">
          <h2 className="heading-gold text-xl">Mapping</h2>
          <span className="text-[10px] uppercase tracking-widest text-d2-gold">
            data-driven
          </span>
        </div>
        <p className="text-xs text-stone-500 mb-2">
          Best for T3 farming & mf runs
        </p>
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <span className="text-stone-500 uppercase tracking-wider text-[10px] mr-1">
            Top classes:
          </span>
          {topClasses.map((c, i) => (
            <span key={c} className="inline-flex items-center gap-1">
              <ClassIcon cls={c} size={12} />
              <span className="text-stone-300">{c}</span>
              {i < topClasses.length - 1 && (
                <span className="text-stone-700 mx-1">→</span>
              )}
            </span>
          ))}
        </div>
      </header>

      {entries.length === 0 ? (
        <p className="text-stone-600 italic text-sm p-3">
          no builds match the current filters
        </p>
      ) : (
        <ol className="space-y-0.5">
          {entries.map((e, i) => (
            <MappingRow key={e.build.id} rank={i + 1} entry={e} />
          ))}
        </ol>
      )}
    </section>
  );
}

function MappingRow({ rank, entry }: { rank: number; entry: MappingEntry }) {
  const { build, score } = entry;
  const classRank = roleScoreFor(build.className)?.mapping ?? null;
  const multiplier = score / Math.max(build.avgNormalizedMpm, 1);
  const tooltip =
    classRank !== null
      ? `Role score ${score.toFixed(0)} = ${build.avgNormalizedMpm.toFixed(0)} MPM × ${multiplier.toFixed(2)} (${build.className} mapping rank #${classRank})`
      : `Role score ${score.toFixed(0)}`;

  return (
    <li>
      <Link
        to={`/build/${build.id}`}
        className="flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-panel-hi transition-colors"
      >
        <span className="text-stone-600 font-mono text-xs w-5 text-right tabular-nums">
          {rank}
        </span>
        <ClassBadge cls={build.className} />
        <span className="flex-1 truncate text-stone-200 text-sm">
          {build.displayName}
        </span>
        {classRank !== null && (
          <span
            className="text-[10px] font-mono text-stone-600 tabular-nums"
            title={`${build.className} mapping rank: #${classRank} of 7`}
          >
            #{classRank}
          </span>
        )}
        <span
          className="font-mono text-[10px] px-1 rounded-sm shrink-0"
          style={{
            color: "#0a0805",
            backgroundColor: tierColorVar(build.tierAdjusted),
          }}
        >
          {build.tierAdjusted}
        </span>
        <span
          className="font-mono text-stone-400 text-[11px] tabular-nums w-10 text-right"
          title="Raw normalized MPM"
        >
          {Math.round(build.avgNormalizedMpm)}
        </span>
        <span
          className="font-mono text-d2-gold text-sm tabular-nums w-12 text-right"
          title={tooltip}
        >
          {Math.round(score)}
        </span>
      </Link>
    </li>
  );
}

// ========= STARTER / BOSSING (DH's curation, NOT MPM-derived) =========

interface ClassGroup {
  className: ClassName;
  rank: number;
  builds: Build[];
}

function buildCuratedRoleColumn(
  filtered: Build[],
  role: "starter" | "bossing"
): ClassGroup[] {
  const byClass = new Map<ClassName, Build[]>();
  for (const b of filtered) {
    const arr = byClass.get(b.className) ?? [];
    arr.push(b);
    byClass.set(b.className, arr);
  }

  const scores = allClassRoleScores();
  const groups: ClassGroup[] = scores
    .map((s) => {
      const classBuilds = byClass.get(s.className) ?? [];
      classBuilds.sort((a, b) => b.avgNormalizedMpm - a.avgNormalizedMpm);
      return {
        className: s.className,
        rank: s.score[role],
        builds: classBuilds.slice(0, BUILDS_PER_CLASS_IN_CURATED),
      };
    })
    .sort((a, b) => a.rank - b.rank);

  return groups;
}

function CuratedColumn({
  title,
  blurb,
  role,
  groups,
}: {
  title: string;
  blurb: string;
  role: "starter" | "bossing";
  groups: ClassGroup[];
}) {
  return (
    <section className="panel p-3">
      <header className="mb-3 pb-2 border-b border-border/60">
        <div className="flex items-center justify-between mb-1">
          <h2 className="heading-gold text-xl">{title}</h2>
          <span
            className="text-[10px] uppercase tracking-widest text-d2-unique"
            title="Class ranking is Dark Humility's curation — not derived from MPM data"
          >
            curated
          </span>
        </div>
        <p className="text-xs text-stone-500 mb-2">{blurb}</p>
        <p className="text-[11px] text-stone-600 italic">
          Classes ranked by Dark Humility's {role} ranking. Builds shown are
          top-MPM picks within each class — they are NOT individually ranked
          for {role}.
        </p>
      </header>

      {groups.every((g) => g.builds.length === 0) ? (
        <p className="text-stone-600 italic text-sm p-3">
          no builds match the current filters
        </p>
      ) : (
        <ol className="space-y-3">
          {groups.map((g) => (
            <ClassGroupRow key={g.className} group={g} role={role} />
          ))}
        </ol>
      )}
    </section>
  );
}

function ClassGroupRow({
  group,
  role,
}: {
  group: ClassGroup;
  role: "starter" | "bossing";
}) {
  if (group.builds.length === 0) {
    return (
      <li className="flex items-center gap-2 opacity-40">
        <span
          className="font-mono text-xs text-stone-600 w-5 text-right tabular-nums"
          title={`Rank #${group.rank} of 7`}
        >
          #{group.rank}
        </span>
        <ClassIcon cls={group.className} size={14} />
        <span className="text-stone-500 text-sm">{group.className}</span>
        <span className="text-[10px] text-stone-600 italic ml-2">
          no builds in current filter
        </span>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          className="font-display text-lg text-d2-gold w-6 text-right"
          title={`${role} rank #${group.rank} of 7 (Dark Humility's curation)`}
        >
          #{group.rank}
        </span>
        <ClassIcon cls={group.className} size={16} />
        <span className="text-stone-100 font-medium">{group.className}</span>
      </div>
      <div className="flex flex-wrap gap-1 pl-8">
        {group.builds.map((b) => (
          <Link
            key={b.id}
            to={`/build/${b.id}`}
            className="inline-flex items-center gap-1.5 px-1.5 py-0.5 panel-hi rounded-sm hover:border-d2-gold transition-colors"
            title={`${b.displayName} — ${Math.round(b.avgNormalizedMpm)} MPM (mapping, not ${role})`}
          >
            <span
              className="font-mono text-[9px] px-1 rounded-sm shrink-0"
              style={{
                color: "#0a0805",
                backgroundColor: tierColorVar(b.tierAdjusted),
              }}
            >
              {b.tierAdjusted}
            </span>
            <span className="text-xs text-stone-200 truncate max-w-[180px]">
              {b.displayName}
            </span>
          </Link>
        ))}
      </div>
    </li>
  );
}
