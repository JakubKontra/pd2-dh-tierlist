import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTierlist } from "../data/fetchSheet";
import { ErrorState, LoadingState } from "../components/LoadState";
import { MAX_PINS, useCompare } from "../store/compare";
import { ClassBadge, classColor } from "../components/ClassBadge";
import { DensityBadge } from "../components/DensityBadge";
import { ShareButton } from "../components/ShareButton";
import { ExportPngButton } from "../components/ExportPngButton";
import { tierColorVar } from "../data/tiering";
import { roleScoreFor } from "../data/classScores";
import type { Build, MapRun } from "../data/types";

export function Compare() {
  const { data, loading, error, refetch } = useTierlist();
  const pinned = useCompare((s) => s.pinned);
  const togglePin = useCompare((s) => s.togglePin);
  const clear = useCompare((s) => s.clear);
  const exportRef = useRef<HTMLDivElement>(null);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  const builds = pinned
    .map((id) => data.builds.find((b) => b.id === id))
    .filter((b): b is Build => !!b);

  if (builds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto panel p-8 text-center">
        <h1 className="heading-gold text-3xl mb-2">Compare</h1>
        <p className="text-stone-400 mb-4">
          Pin up to {MAX_PINS} builds from the tier list to compare them
          side-by-side.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 panel-hi hover:border-d2-gold text-d2-gold uppercase tracking-wider text-sm"
        >
          Browse tier list →
        </Link>
      </div>
    );
  }

  const allMapNames = collectMapNames(builds);
  const colWidth = builds.length === 1 ? "300px" : builds.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr";
  const gridCols = `160px ${colWidth}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="heading-gold text-3xl sm:text-4xl">Compare</h1>
          <p className="text-stone-400 text-sm">
            {builds.length} / {MAX_PINS} builds pinned
          </p>
        </div>
        <div className="flex items-center gap-2" data-export-ignore>
          <ShareButton title="Copy link to share this comparison" />
          <ExportPngButton
            targetRef={exportRef}
            filename={`pd2-compare-${builds.map((b) => b.id).join("-vs-")}.png`}
          />
          <button
            onClick={clear}
            className="px-3 py-1 text-xs uppercase tracking-wider font-mono rounded-sm border border-d2-red text-d2-red hover:bg-d2-red hover:text-black transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin" ref={exportRef}>
        <div
          className="grid gap-2 min-w-[720px]"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div />
          {builds.map((b) => (
            <div key={b.id} className="panel p-3 relative">
              <button
                onClick={() => togglePin(b.id)}
                title="Unpin"
                className="absolute top-1 right-1 text-stone-500 hover:text-d2-red text-xs font-mono w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
              <div className="flex items-start gap-2 mb-2">
                <div
                  className="flex items-center justify-center rounded-sm font-display text-xl font-bold w-10 h-10 shrink-0"
                  style={{
                    color: "#0a0805",
                    backgroundColor: tierColorVar(b.tierAdjusted),
                  }}
                >
                  {b.tierAdjusted}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/build/${b.id}`}
                    className="block text-stone-100 font-medium hover:text-d2-gold leading-tight truncate"
                  >
                    {b.displayName}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ClassBadge cls={b.className} />
                    {b.retested === true && (
                      <span className="text-[10px] font-mono px-1 rounded-sm border border-lime-700 text-lime-400">
                        RT
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="h-1 rounded-full"
                style={{ backgroundColor: classColor(b.className) }}
              />
            </div>
          ))}

          <RowLabel>Raw tier</RowLabel>
          {builds.map((b) => (
            <RowCell key={b.id}>
              <span className="font-mono text-stone-200">{b.tierRaw}</span>
            </RowCell>
          ))}

          <RowLabel>Handicap</RowLabel>
          {builds.map((b) => (
            <RowCell key={b.id}>
              {b.handicap === 0 ? (
                <span className="text-stone-600">—</span>
              ) : (
                <span
                  className="font-mono text-sm"
                  style={{ color: b.handicap > 0 ? "#f1d37a" : "#cc7777" }}
                >
                  {b.handicap > 0 ? "+" : ""}
                  {Math.round(b.handicap * 3)}/3 tier
                </span>
              )}
            </RowCell>
          ))}

          <SectionHeader>Performance</SectionHeader>
          {padRow(builds.length)}

          <RowLabel>Avg MPM</RowLabel>
          {withBest(
            builds.map((b) => b.avgMpm),
            (v, isBest) => (
              <RowCell>
                <Metric value={v.toFixed(1)} best={isBest} />
              </RowCell>
            )
          )}

          <RowLabel>Norm. MPM (vs 200% dens.)</RowLabel>
          {withBest(
            builds.map((b) => b.avgNormalizedMpm),
            (v, isBest) => (
              <RowCell>
                <Metric value={v.toFixed(1)} best={isBest} />
              </RowCell>
            )
          )}

          <RowLabel>Std dev</RowLabel>
          {builds.map((b) => (
            <RowCell key={b.id}>
              <span className="font-mono text-sm text-stone-300">
                {b.normStdDev.toFixed(1)}
              </span>
            </RowCell>
          ))}

          <RowLabel>Density profile</RowLabel>
          {builds.map((b) => (
            <RowCell key={b.id}>
              {b.densityProfile === "neutral" ? (
                <span className="text-stone-500 text-xs">normal</span>
              ) : (
                <DensityBadge
                  profile={b.densityProfile}
                  stdDev={b.normStdDev}
                />
              )}
            </RowCell>
          ))}

          <SectionHeader>Map runs</SectionHeader>
          {padRow(builds.length)}

          {allMapNames.map((mapName) => (
            <MapRow
              key={mapName}
              mapName={mapName}
              runs={builds.map((b) => findMap(b, mapName))}
            />
          ))}

          <SectionHeader>Class role scoring</SectionHeader>
          {padRow(builds.length)}

          {(["mapping", "starter", "bossing", "total"] as const).map((role) => (
            <RoleRow key={role} role={role} builds={builds} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel-hi px-3 py-2 text-xs uppercase tracking-wider text-stone-400 flex items-center">
      {children}
    </div>
  );
}

function RowCell({ children }: { children: React.ReactNode }) {
  return <div className="panel px-3 py-2 flex items-center">{children}</div>;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full mt-4 mb-1 text-xs uppercase tracking-widest text-d2-unique font-display">
      — {children} —
    </div>
  );
}

function padRow(_n: number) {
  return null;
}

function Metric({ value, best }: { value: string; best: boolean }) {
  return (
    <span
      className={`font-mono text-sm ${best ? "text-d2-gold font-bold" : "text-stone-300"}`}
    >
      {value}
      {best && <span className="ml-1 text-[10px] uppercase">best</span>}
    </span>
  );
}

function withBest(
  values: number[],
  render: (v: number, isBest: boolean) => React.ReactNode
): React.ReactNode[] {
  if (values.length === 0) return [];
  const max = Math.max(...values);
  return values.map((v, i) => (
    <span key={i} style={{ display: "contents" }}>
      {render(v, values.length > 1 && v === max)}
    </span>
  ));
}

function MapRow({
  mapName,
  runs,
}: {
  mapName: string;
  runs: (MapRun | null)[];
}) {
  const normVals = runs
    .map((r) => (r ? r.normalizedMpm : -Infinity))
    .filter((v) => v !== -Infinity);
  const best = normVals.length > 1 ? Math.max(...normVals) : null;

  return (
    <>
      <RowLabel>{mapName}</RowLabel>
      {runs.map((r, i) => (
        <RowCell key={i}>
          {r ? (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-stone-200">{r.mpm}</span>
                <span className="text-[10px] text-stone-500">mpm</span>
                <span className="text-stone-600 mx-1">·</span>
                <span className="font-mono text-stone-400">{r.density}%</span>
                {r.fortified && (
                  <span className="text-[10px] text-d2-magic ml-1">
                    {r.doubleFortified ? "2×f" : "f"}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                norm{" "}
                <span
                  className={
                    best !== null && r.normalizedMpm === best
                      ? "text-d2-gold font-bold"
                      : "text-stone-300"
                  }
                >
                  {r.normalizedMpm.toFixed(0)}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-stone-600 text-xs">not tested</span>
          )}
        </RowCell>
      ))}
    </>
  );
}

function RoleRow({
  role,
  builds,
}: {
  role: "mapping" | "starter" | "bossing" | "total";
  builds: Build[];
}) {
  const scores = builds.map((b) => {
    const s = roleScoreFor(b.className);
    return s ? s[role] : null;
  });
  const valid = scores.filter((s): s is number => s !== null);
  const best = valid.length > 1 ? Math.min(...valid) : null;

  return (
    <>
      <RowLabel>{labelFor(role)}</RowLabel>
      {scores.map((s, i) => (
        <RowCell key={i}>
          {s === null ? (
            <span className="text-stone-600 text-xs">—</span>
          ) : (
            <span
              className={`font-mono text-sm ${s === best ? "text-d2-gold font-bold" : "text-stone-300"}`}
              title={`${s} of 7 (lower = better)`}
            >
              #{s} / 7
              {s === best && (
                <span className="ml-1 text-[10px] uppercase">best</span>
              )}
            </span>
          )}
        </RowCell>
      ))}
    </>
  );
}

function labelFor(role: "mapping" | "starter" | "bossing" | "total"): string {
  return role[0].toUpperCase() + role.slice(1);
}

function collectMapNames(builds: Build[]): string[] {
  const order: string[] = [];
  const seen = new Set<string>();
  for (const b of builds) {
    for (const m of b.maps) {
      if (!seen.has(m.name)) {
        seen.add(m.name);
        order.push(m.name);
      }
    }
  }
  return order;
}

function findMap(b: Build, name: string): MapRun | null {
  return b.maps.find((m) => m.name === name) ?? null;
}

