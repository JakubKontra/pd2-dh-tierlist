import { Link, useParams } from "react-router-dom";
import { useTierlist, SHEET_URL } from "../data/fetchSheet";
import { ErrorState, LoadingState } from "../components/LoadState";
import { ClassBadge } from "../components/ClassBadge";
import { DensityBadge } from "../components/DensityBadge";
import { PinButton } from "../components/PinButton";
import { tierColorVar } from "../data/tiering";

function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function BuildDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useTierlist();

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  const build = data.builds.find((b) => b.id === id);
  if (!build) {
    return (
      <div className="panel p-8 text-center">
        <h2 className="text-d2-red mb-2">Build not found</h2>
        <Link to="/" className="text-d2-gold hover:underline">
          ← back to tier list
        </Link>
      </div>
    );
  }

  const mpms = build.maps.map((m) => m.mpm);
  const norms = build.maps.map((m) => m.normalizedMpm);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-stone-500 text-sm hover:text-d2-gold">
        ← Tier list
      </Link>
      <header className="mt-3 mb-6 flex flex-wrap items-start gap-4">
        <div
          className="flex items-center justify-center rounded-sm font-display text-5xl font-bold w-24 h-24 shrink-0"
          style={{
            color: "#0a0805",
            backgroundColor: tierColorVar(build.tierAdjusted),
            boxShadow: `0 0 24px ${tierColorVar(build.tierAdjusted)}55`,
          }}
        >
          {build.tierAdjusted}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="heading-gold text-3xl sm:text-4xl mb-2">
            {build.displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <ClassBadge cls={build.className} size="md" />
            {build.handicap !== 0 && (
              <span
                className="px-2 py-0.5 font-mono text-xs rounded-sm border"
                style={{
                  color: build.handicap > 0 ? "#f1d37a" : "#cc7777",
                  borderColor: "currentColor",
                }}
              >
                Handicap {build.handicap > 0 ? "+" : ""}
                {Math.round(build.handicap * 3)}/3 tier
              </span>
            )}
            {build.retested === true && (
              <span
                className="px-2 py-0.5 font-mono text-xs rounded-sm border border-lime-700 text-lime-400"
                title="Retested after closed-beta patch notes to verify specific nerf/buff changes"
              >
                β-retest (post-beta)
              </span>
            )}
            <DensityBadge profile={build.densityProfile} stdDev={build.normStdDev} />

            <span className="text-stone-500">
              Raw tier: <span className="text-stone-300">{build.tierRaw}</span>
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <PinButton buildId={build.id} size="md" stopPropagation={false} />
        </div>
      </header>

      <section className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Avg MPM" value={build.avgMpm.toFixed(1)} unit="monsters/min" />
        <Stat
          label="Density-normalized"
          value={build.avgNormalizedMpm.toFixed(1)}
          unit="MPM @ 200% density"
        />
        <Stat
          label="Std Dev (norm)"
          value={stdDev(norms).toFixed(1)}
          unit={`median ${median(mpms).toFixed(0)} mpm`}
        />
      </section>

      <section className="mb-6">
        <h2 className="text-lg uppercase tracking-wider text-d2-unique mb-2">
          Map runs
        </h2>
        <div className="grid gap-2">
          {build.maps.map((m, i) => (
            <div key={i} className="panel p-3 grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
              <div>
                <div className="text-stone-100">{m.name}</div>
                {m.fortified && (
                  <div className="text-xs text-d2-magic">
                    {m.doubleFortified ? "Double fortified (2×f)" : "Fortified (f)"}
                  </div>
                )}
              </div>
              <MetricCell label="MPM" value={m.mpm.toString()} />
              <MetricCell label="Density" value={`${m.density}%`} />
              <MetricCell
                label="Normalized"
                value={m.normalizedMpm.toFixed(0)}
                accent
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-4 text-sm text-stone-400">
        <p>
          Normalized MPM formula:{" "}
          <code className="text-d2-unique">(MPM × 200) / (Density + 100)</code> —
          scales all runs to a 200% density baseline so builds tested on different maps are comparable.
        </p>
        <a
          href={SHEET_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-3 text-d2-gold hover:underline"
        >
          Open in Google Sheet →
        </a>
      </section>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="panel p-3">
      <div className="text-xs uppercase tracking-wider text-stone-500">{label}</div>
      <div className="text-2xl font-display text-d2-gold">{value}</div>
      {unit && <div className="text-xs text-stone-600">{unit}</div>}
    </div>
  );
}

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-right min-w-[70px]">
      <div className="text-[10px] uppercase tracking-wider text-stone-500">
        {label}
      </div>
      <div className={`font-mono ${accent ? "text-d2-gold" : "text-stone-200"}`}>
        {value}
      </div>
    </div>
  );
}
