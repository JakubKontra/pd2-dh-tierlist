import { useMemo, useRef } from "react";
import { useTierlist } from "../data/fetchSheet";
import { useFilters } from "../store/filters";
import { TIERS, type Build, type Season, type Tier } from "../data/types";
import { TierRow } from "../components/TierRow";
import { FilterBar } from "../components/FilterBar";
import { ErrorState, LoadingState } from "../components/LoadState";
import { ShareButton } from "../components/ShareButton";
import { ExportPngButton } from "../components/ExportPngButton";

export function Tierlist() {
  const { data, loading, error, refetch } = useTierlist();
  const { classFilter, search, applyHandicap, retestedFilter, seasonFilter } =
    useFilters();
  const exportRef = useRef<HTMLDivElement>(null);

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
      return true;
    });
  }, [data, classFilter, search, retestedFilter, seasonFilter]);

  const byTier = useMemo(() => {
    const map = new Map<Tier, Build[]>();
    for (const t of TIERS) map.set(t, []);
    for (const b of filtered) {
      const t = applyHandicap ? b.tierAdjusted : b.tierRaw;
      map.get(t)!.push(b);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => b.avgNormalizedMpm - a.avgNormalizedMpm);
    }
    return map;
  }, [filtered, applyHandicap]);

  if (loading && !data) return <LoadingState />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div>
      <h1 className="heading-gold text-center mb-3 text-5xl sm:text-[72px] leading-tight">
        Dark Humility Season 13 - Betrayal Tierlist
      </h1>
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-[240px]">
          <p className="text-stone-400 text-sm">
            Build tier list by{" "}
            <span className="text-d2-gold">Dark Humility</span> •{" "}
            {data.builds.length} builds tested • updated live from Google Sheets
          </p>
        </div>
        <div className="flex items-center gap-2" data-export-ignore>
          <ShareButton title="Copy link (preserves your class, search & handicap filters)" />
          <ExportPngButton targetRef={exportRef} filename="pd2-s13-tierlist.png" />
        </div>
      </div>
      <FilterBar
        total={data.builds.length}
        visible={filtered.length}
        availableSeasons={availableSeasons}
      />
      <div ref={exportRef} className="space-y-2">
        {TIERS.map((tier) => (
          <TierRow key={tier} tier={tier} builds={byTier.get(tier) ?? []} />
        ))}
        <div className="pt-3 mt-3 border-t border-border/50 text-[10px] text-stone-500 text-center font-mono">
          pd2-tierlist · data by Dark Humility · pulled {new Date(data.fetchedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
