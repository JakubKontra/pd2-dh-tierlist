import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilters, type RetestedFilter } from "../store/filters";
import { useCompare } from "../store/compare";
import { CLASSES, type ClassName } from "../data/types";

const CLASS_CODE: Record<ClassName, string> = {
  Amazon: "ama",
  Assassin: "asn",
  Barbarian: "bar",
  Druid: "dru",
  Necromancer: "nec",
  Paladin: "pal",
  Sorceress: "sor",
  Unknown: "unk",
};

function codeToClass(code: string): ClassName | "All" | null {
  if (code === "all") return "All";
  const found = (CLASSES as readonly ClassName[]).find(
    (c) => CLASS_CODE[c] === code.toLowerCase()
  );
  return found ?? null;
}

function classToCode(c: ClassName | "All"): string {
  return c === "All" ? "all" : CLASS_CODE[c];
}

function parseRetested(v: string | null): RetestedFilter {
  if (v === "1" || v === "rt") return "retested";
  if (v === "0" || v === "notrt") return "not-retested";
  return "all";
}

function retestedCode(f: RetestedFilter): string | null {
  if (f === "retested") return "1";
  if (f === "not-retested") return "0";
  return null;
}

export function useUrlSync() {
  const [params, setParams] = useSearchParams();
  const hydrated = useRef(false);

  const {
    classFilter,
    search,
    applyHandicap,
    retestedFilter,
    setClassFilter,
    setSearch,
    setApplyHandicap,
    setRetestedFilter,
  } = useFilters();
  const pinned = useCompare((s) => s.pinned);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const c = params.get("c");
    if (c) {
      const resolved = codeToClass(c);
      if (resolved) setClassFilter(resolved);
    }
    const s = params.get("s");
    if (s) setSearch(s);
    const h = params.get("h");
    if (h === "0") setApplyHandicap(false);
    if (h === "1") setApplyHandicap(true);
    const rt = params.get("rt");
    if (rt) setRetestedFilter(parseRetested(rt));

    const pins = params.get("pins");
    if (pins) {
      const ids = pins
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, 3);
      if (ids.length > 0) {
        useCompare.setState({ pinned: ids });
      }
    }
  }, [params, setClassFilter, setSearch, setApplyHandicap, setRetestedFilter]);

  useEffect(() => {
    if (!hydrated.current) return;
    const next = new URLSearchParams(params);

    const cCode = classToCode(classFilter);
    if (cCode === "all") next.delete("c");
    else next.set("c", cCode);

    if (search.trim()) next.set("s", search.trim());
    else next.delete("s");

    if (!applyHandicap) next.set("h", "0");
    else next.delete("h");

    const rtCode = retestedCode(retestedFilter);
    if (rtCode) next.set("rt", rtCode);
    else next.delete("rt");

    if (pinned.length) next.set("pins", pinned.join(","));
    else next.delete("pins");

    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true });
    }
  }, [
    classFilter,
    search,
    applyHandicap,
    retestedFilter,
    pinned,
    params,
    setParams,
  ]);
}
