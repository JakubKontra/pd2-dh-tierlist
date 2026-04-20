import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTierlist } from "../data/fetchSheet";
import { ErrorState, LoadingState } from "../components/LoadState";
import { CLASSES, TIERS, type Build, type ClassName, type Tier } from "../data/types";
import { tierColorVar } from "../data/tiering";
import { classColor, ClassBadge } from "../components/ClassBadge";
import { useFilters } from "../store/filters";

export function Stats() {
  const { data, loading, error, refetch } = useTierlist();
  const { applyHandicap } = useFilters();

  const stats = useMemo(() => {
    if (!data) return null;
    return computeStats(data.builds, applyHandicap);
  }, [data, applyHandicap]);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data || !stats) return null;

  return (
    <div>
      <h1 className="heading-gold text-3xl sm:text-4xl mb-1">Statistics</h1>
      <p className="text-stone-400 text-sm mb-6">
        Aggregate view of {data.builds.length} tested builds. Toggle "Apply
        handicap" on the tierlist page to switch between raw-data and
        final-display tier placement; the scatter & class averages reflect raw
        normalized MPM either way.
      </p>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Tier distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.tierDist}>
              <CartesianGrid stroke="#3a2e20" strokeDasharray="2 2" />
              <XAxis dataKey="tier" stroke="#8a7a5a" fontSize={11} />
              <YAxis stroke="#8a7a5a" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#1f1712",
                  border: "1px solid #5a4530",
                  borderRadius: 2,
                }}
                cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {stats.tierDist.map((d) => (
                  <Cell key={d.tier} fill={tierColorVar(d.tier)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Class average — normalized MPM">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.classAvg} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke="#3a2e20" strokeDasharray="2 2" />
              <XAxis type="number" stroke="#8a7a5a" fontSize={11} />
              <YAxis
                type="category"
                dataKey="className"
                stroke="#8a7a5a"
                fontSize={11}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "#1f1712",
                  border: "1px solid #5a4530",
                }}
                cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}
              />
              <Bar dataKey="avg" radius={[0, 2, 2, 0]}>
                {stats.classAvg.map((d) => (
                  <Cell key={d.className} fill={classColor(d.className)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top 10 builds (normalized MPM)" className="lg:col-span-2">
          <ol className="grid sm:grid-cols-2 gap-1">
            {stats.topBuilds.map((b, i) => (
              <li key={b.id}>
                <Link
                  to={`/build/${b.id}`}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-panel-hi rounded-sm"
                >
                  <span className="text-stone-600 font-mono text-xs w-6 text-right">
                    {i + 1}.
                  </span>
                  <ClassBadge cls={b.className} />
                  <span className="flex-1 truncate text-stone-200 text-sm">
                    {b.displayName}
                  </span>
                  <span
                    className="font-mono text-xs px-1.5 rounded-sm"
                    style={{
                      color: "#0a0805",
                      background: tierColorVar(b.tierAdjusted),
                    }}
                  >
                    {b.tierAdjusted}
                  </span>
                  <span className="font-mono text-d2-gold text-sm tabular-nums w-14 text-right">
                    {b.avgNormalizedMpm.toFixed(0)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Density vs MPM by class" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="#3a2e20" strokeDasharray="2 2" />
              <XAxis
                type="number"
                dataKey="density"
                name="Density"
                stroke="#8a7a5a"
                fontSize={11}
                domain={[80, 160]}
                label={{
                  value: "Map density (%)",
                  position: "bottom",
                  offset: -5,
                  fill: "#8a7a5a",
                }}
              />
              <YAxis
                type="number"
                dataKey="mpm"
                name="MPM"
                stroke="#8a7a5a"
                fontSize={11}
                label={{
                  value: "MPM",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#8a7a5a",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1f1712",
                  border: "1px solid #5a4530",
                }}
                cursor={{ strokeDasharray: "3 3" }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const p = payload[0].payload as ScatterPoint;
                  return (
                    <div className="panel p-2 text-xs">
                      <div className="text-stone-200">{p.buildName}</div>
                      <div className="text-stone-400">
                        {p.mapName} • {p.mpm} MPM @ {p.density}% density
                      </div>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {CLASSES.map((cls) => (
                <Scatter
                  key={cls}
                  name={cls}
                  data={stats.scatter.filter((p) => p.className === cls)}
                  fill={classColor(cls)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Map testing frequency">
          <ul className="text-sm space-y-1">
            {stats.mapFreq.map((m) => (
              <li key={m.map} className="flex items-center gap-3">
                <span className="text-stone-200 w-40 truncate" title={m.map}>
                  {m.map}
                </span>
                <div className="flex-1 h-3 bg-panel-hi rounded-sm overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${(m.count / stats.mapFreq[0].count) * 100}%`,
                      background: "linear-gradient(90deg, #a37a2a, #d4af37)",
                    }}
                  />
                </div>
                <span className="text-d2-gold font-mono text-xs tabular-nums w-8 text-right">
                  {m.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Dark Humility's class role scoring">
          <p className="text-xs text-stone-500 mb-2">
            Lower = better (1 is best, 7 is worst). From the sheet's class
            summary table.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-stone-500">
                <th className="text-left pb-1">Class</th>
                <th className="text-right pb-1">Mapping</th>
                <th className="text-right pb-1">Starter</th>
                <th className="text-right pb-1">Bossing</th>
                <th className="text-right pb-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.classScores.map((row) => (
                <tr key={row.className} className="border-t border-border/50">
                  <td className="py-1 flex items-center gap-2">
                    <ClassBadge cls={row.className} />
                    <span className="text-stone-200">{row.className}</span>
                  </td>
                  <Score v={row.mapping} />
                  <Score v={row.starter} />
                  <Score v={row.bossing} />
                  <td className="py-1 text-right font-mono text-d2-gold">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function Score({ v }: { v: number }) {
  const color = v <= 2 ? "#9acd32" : v <= 4 ? "#ffff33" : "#cc7777";
  return (
    <td className="py-1 text-right font-mono" style={{ color }}>
      {v}
    </td>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel p-4 ${className}`}>
      <h3 className="text-sm uppercase tracking-widest text-d2-unique mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface ClassScoreRow {
  className: ClassName;
  mapping: number;
  starter: number;
  bossing: number;
  total: number;
}

interface ScatterPoint {
  density: number;
  mpm: number;
  className: ClassName;
  buildName: string;
  mapName: string;
}

function computeStats(builds: Build[], useHandicap: boolean) {
  const tierDist: { tier: Tier; count: number }[] = TIERS.map((t) => ({
    tier: t,
    count: 0,
  }));
  for (const b of builds) {
    const t = useHandicap ? b.tierAdjusted : b.tierRaw;
    const row = tierDist.find((r) => r.tier === t);
    if (row) row.count++;
  }

  const classAvg = CLASSES.map((cls) => {
    const subset = builds.filter((b) => b.className === cls);
    const avg =
      subset.length === 0
        ? 0
        : subset.reduce((a, b) => a + b.avgNormalizedMpm, 0) / subset.length;
    return { className: cls, avg: +avg.toFixed(1), count: subset.length };
  }).sort((a, b) => b.avg - a.avg);

  const topBuilds = [...builds]
    .sort((a, b) => b.avgNormalizedMpm - a.avgNormalizedMpm)
    .slice(0, 10);

  const scatter: ScatterPoint[] = [];
  for (const b of builds) {
    if (b.className === "Unknown") continue;
    for (const m of b.maps) {
      scatter.push({
        density: m.density,
        mpm: m.mpm,
        className: b.className,
        buildName: b.displayName,
        mapName: m.name,
      });
    }
  }

  const freq = new Map<string, number>();
  for (const b of builds) {
    for (const m of b.maps) {
      freq.set(m.name, (freq.get(m.name) ?? 0) + 1);
    }
  }
  const mapFreq = Array.from(freq.entries())
    .map(([map, count]) => ({ map, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const classScores: ClassScoreRow[] = (
    [
      { className: "Sorceress", mapping: 1, starter: 7, bossing: 2, total: 10 },
      { className: "Druid", mapping: 3, starter: 3, bossing: 5, total: 11 },
      { className: "Assassin", mapping: 6, starter: 1, bossing: 4, total: 11 },
      { className: "Barbarian", mapping: 2, starter: 4, bossing: 6, total: 12 },
      { className: "Amazon", mapping: 5, starter: 2, bossing: 7, total: 14 },
      { className: "Necromancer", mapping: 4, starter: 6, bossing: 1, total: 11 },
      { className: "Paladin", mapping: 7, starter: 5, bossing: 3, total: 15 },
    ] satisfies ClassScoreRow[]
  )
    .slice()
    .sort((a, b) => a.total - b.total);

  return { tierDist, classAvg, topBuilds, scatter, mapFreq, classScores };
}
