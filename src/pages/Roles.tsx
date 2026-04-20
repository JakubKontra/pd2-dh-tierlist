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
import type { Build, ClassName } from "../data/types";

type Role = "mapping" | "starter" | "bossing";

const AFFINITY_DECAY = 0.08;

function roleAffinityScore(
  normMpm: number,
  cls: ClassName,
  role: Role
): number {
  const rs = roleScoreFor(cls)?.[role] ?? 7;
  const multiplier = Math.max(0, 1 - (rs - 1) * AFFINITY_DECAY);
  return normMpm * multiplier;
}

const ROLES: { key: Role; title: string; blurb: string }[] = [
  {
    key: "mapping",
    title: "Mapping",
    blurb: "Best for T3 farming & mf runs",
  },
  {
    key: "starter",
    title: "League Starter",
    blurb: "Best from scratch, no gear",
  },
  {
    key: "bossing",
    title: "Bossing",
    blurb: "Best for Uber/boss kills",
  },
];

const MAX_PER_COLUMN = 30;

export function Roles() {
  const { data, loading, error, refetch } = useTierlist();
  const { classFilter, search, retestedFilter } = useFilters();

  const filtered = useMemo<Build[]>(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.builds.filter((b) => {
      if (classFilter !== "All" && b.className !== classFilter) return false;
      if (q && !b.displayName.toLowerCase().includes(q)) return false;
      if (retestedFilter === "retested" && b.retested !== true) return false;
      if (retestedFilter === "not-retested" && b.retested === true) return false;
      if (b.className === "Unknown") return false;
      return true;
    });
  }, [data, classFilter, search, retestedFilter]);

  const columns = useMemo(() => {
    const allClasses = allClassRoleScores();
    return ROLES.map((r) => {
      const scored = filtered.map((b) => ({
        build: b,
        score: roleAffinityScore(b.avgNormalizedMpm, b.className, r.key),
      }));
      scored.sort((a, b) => b.score - a.score);
      const topClasses = [...allClasses]
        .sort((a, b) => a.score[r.key] - b.score[r.key])
        .slice(0, 3)
        .map((c) => c.className);
      return {
        ...r,
        entries: scored.slice(0, MAX_PER_COLUMN),
        topClasses,
      };
    });
  }, [filtered]);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <div className="mb-4">
        <h1 className="heading-gold text-3xl sm:text-4xl mb-1">By Role</h1>
        <p className="text-stone-400 text-sm">
          Ranked by a blended <span className="text-d2-gold">role score</span> —
          normalized MPM scaled by each class's affinity for the role (8% decay
          per rank step, per Dark Humility's class scoring). Raw MPM shown in
          grey, role score in gold. Filters apply to all three columns.
        </p>
      </div>
      <FilterBar total={data.builds.length} visible={filtered.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {columns.map((col) => (
          <RoleColumn
            key={col.key}
            title={col.title}
            blurb={col.blurb}
            topClasses={col.topClasses}
            entries={col.entries}
            role={col.key}
          />
        ))}
      </div>
    </div>
  );
}

interface ScoredEntry {
  build: Build;
  score: number;
}

function RoleColumn({
  title,
  blurb,
  topClasses,
  entries,
  role,
}: {
  title: string;
  blurb: string;
  topClasses: ClassName[];
  entries: ScoredEntry[];
  role: Role;
}) {
  return (
    <section className="panel p-3">
      <header className="mb-3 pb-2 border-b border-border/60">
        <div className="flex items-center justify-between mb-1">
          <h2 className="heading-gold text-xl">{title}</h2>
          <span className="text-[10px] uppercase tracking-widest text-stone-500">
            {entries.length} builds
          </span>
        </div>
        <p className="text-xs text-stone-500 mb-2">{blurb}</p>
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
            <BuildRow
              key={e.build.id}
              rank={i + 1}
              build={e.build}
              score={e.score}
              role={role}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function BuildRow({
  rank,
  build,
  score,
  role,
}: {
  rank: number;
  build: Build;
  score: number;
  role: Role;
}) {
  const classRoleScore = roleScoreFor(build.className)?.[role] ?? null;
  const tooltip =
    classRoleScore !== null
      ? `Role score ${score.toFixed(0)} = ${build.avgNormalizedMpm.toFixed(0)} MPM × ${(score / Math.max(build.avgNormalizedMpm, 1)).toFixed(2)} (${build.className} mapping rank #${classRoleScore})`
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
        {classRoleScore !== null && (
          <span
            className="text-[10px] font-mono text-stone-600 tabular-nums"
            title={`${build.className} ${role} rank: #${classRoleScore} of 7`}
          >
            #{classRoleScore}
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
