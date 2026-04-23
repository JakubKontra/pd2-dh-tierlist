import { useRef, useState } from "react";
import { useFilterStore } from "../../store/filter";

export function ImportPanel() {
  const replaceRawText = useFilterStore((s) => s.replaceRawText);
  const clear = useFilterStore((s) => s.clear);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paste, setPaste] = useState("");
  const [lastLoadedName, setLastLoadedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      replaceRawText(text);
      setLastLoadedName(f.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read file");
    }
  };

  const applyPaste = () => {
    setError(null);
    if (paste.trim() === "") {
      setError("Nothing to import");
      return;
    }
    replaceRawText(paste);
    setLastLoadedName("pasted");
  };

  return (
    <section className="panel p-4 flex flex-col gap-3">
      <header>
        <h3 className="heading-gold text-sm uppercase tracking-widest">Import</h3>
        <p className="text-xs text-stone-500 mt-1">
          Load an existing <code>.filter</code> file or paste raw filter text.
          Existing draft will be replaced.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-stone-400">From file</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-panel-hi border border-border hover:border-d2-gold transition-colors"
          >
            Choose .filter file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".filter,.txt"
            onChange={onFileChange}
            className="hidden"
          />
          {lastLoadedName && (
            <span className="text-xs text-stone-500">loaded: {lastLoadedName}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-stone-400">From clipboard / paste</label>
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          spellCheck={false}
          placeholder="Paste filter contents here..."
          className="w-full h-32 bg-panel-hi border border-border px-2 py-1 font-mono text-xs resize-y focus:outline-none focus:border-d2-gold"
        />
        <div className="flex items-center justify-between">
          <button
            onClick={applyPaste}
            className="px-3 py-1.5 text-sm bg-panel-hi border border-border hover:border-d2-gold transition-colors"
          >
            Import pasted text
          </button>
          <button
            onClick={() => {
              if (window.confirm("Clear the current filter draft?")) clear();
            }}
            className="text-xs text-stone-500 hover:text-d2-red"
          >
            Clear current draft
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-d2-red">{error}</p>}
    </section>
  );
}
