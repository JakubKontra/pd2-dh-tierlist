import { useState } from "react";
import { FilterTextEditor } from "../components/filter/FilterTextEditor";
import { ValidationPanel } from "../components/filter/ValidationPanel";
import { ImportPanel } from "../components/filter/ImportPanel";
import { ExportPanel } from "../components/filter/ExportPanel";
import { RuleList } from "../components/filter/RuleList";
import { RuleEditor } from "../components/filter/RuleEditor";
import { MetaEditors } from "../components/filter/MetaEditors";
import { useFilterStore } from "../store/filter";

type Tab = "builder" | "text" | "io";

export function LootFilterCreator() {
  const [tab, setTab] = useState<Tab>("builder");
  const [metaOpen, setMetaOpen] = useState(false);
  const diagnostics = useFilterStore((s) => s.diagnostics);
  const ruleCount = useFilterStore((s) => s.file.rules.length);

  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const warningCount = diagnostics.filter((d) => d.severity === "warning").length;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h1 className="heading-gold text-3xl font-display font-bold">
            Loot Filter Creator
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Build, validate, import & export Project Diablo 2 loot filters.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-stone-500">
            {ruleCount} rule{ruleCount === 1 ? "" : "s"}
          </span>
          {errorCount > 0 && (
            <span className="text-d2-red">
              {errorCount} error{errorCount === 1 ? "" : "s"}
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-d2-rare">
              {warningCount} warning{warningCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </header>

      <nav className="flex gap-1 border-b border-border">
        <TabButton active={tab === "builder"} onClick={() => setTab("builder")}>
          Builder
        </TabButton>
        <TabButton active={tab === "text"} onClick={() => setTab("text")}>
          Text
        </TabButton>
        <TabButton active={tab === "io"} onClick={() => setTab("io")}>
          Import / Export
        </TabButton>
      </nav>

      {tab === "builder" && (
        <details open={metaOpen} onToggle={(e) => setMetaOpen((e.target as HTMLDetailsElement).open)} className="panel">
          <summary className="px-3 py-2 cursor-pointer text-xs uppercase tracking-widest text-stone-400 hover:text-d2-gold">
            Strictness · Aliases · Formulas
          </summary>
          <div className="p-3 border-t border-border">
            <MetaEditors />
          </div>
        </details>
      )}

      <div className={tab === "builder"
        ? "grid gap-4 lg:grid-cols-[320px_1fr_320px]"
        : "grid gap-4 lg:grid-cols-[1fr_320px]"
      }>
        {tab === "builder" && <RuleList />}
        <div className="min-h-[500px]">
          {tab === "builder" && <RuleEditor />}
          {tab === "text" && <FilterTextEditor />}
          {tab === "io" && (
            <div className="grid gap-4 md:grid-cols-2">
              <ImportPanel />
              <ExportPanel />
            </div>
          )}
        </div>
        <ValidationPanel />
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors border-b-2 ${
        active
          ? "text-d2-gold border-d2-gold"
          : "text-stone-400 hover:text-d2-unique border-transparent"
      }`}
    >
      {children}
    </button>
  );
}

