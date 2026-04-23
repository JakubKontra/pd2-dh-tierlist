import { useState } from "react";
import { useFilterStore } from "../../store/filter";

export function ExportPanel() {
  const exportText = useFilterStore((s) => s.exportText);
  const rawText = useFilterStore((s) => s.rawText);
  const [filename, setFilename] = useState("loot.filter");
  const [copied, setCopied] = useState(false);
  const [encoding, setEncoding] = useState<"utf8" | "ansi">("utf8");

  const handleDownload = () => {
    const text = exportText();
    const blob =
      encoding === "ansi"
        ? toAnsiBlob(text)
        : new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "loot.filter";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="panel p-4 flex flex-col gap-3">
      <header>
        <h3 className="heading-gold text-sm uppercase tracking-widest">Export</h3>
        <p className="text-xs text-stone-500 mt-1">
          Download or copy the current filter. Save to{" "}
          <code>ProjectD2/filters/local/</code> to use it in-game.
        </p>
      </header>

      <label className="flex flex-col gap-1 text-xs text-stone-400">
        Filename
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="bg-panel-hi border border-border px-2 py-1 font-mono text-sm focus:outline-none focus:border-d2-gold"
        />
      </label>

      <fieldset className="flex flex-col gap-1 text-xs text-stone-400">
        <legend className="mb-1">Encoding</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="encoding"
            checked={encoding === "utf8"}
            onChange={() => setEncoding("utf8")}
          />
          UTF-8 <span className="text-stone-600">(default)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="encoding"
            checked={encoding === "ansi"}
            onChange={() => setEncoding("ansi")}
          />
          ANSI (Latin-1) <span className="text-stone-600">- required for certain special chars in-game</span>
        </label>
      </fieldset>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          disabled={rawText.trim() === ""}
          className="px-3 py-1.5 text-sm bg-panel-hi border border-border hover:border-d2-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Download
        </button>
        <button
          onClick={handleCopy}
          disabled={rawText.trim() === ""}
          className="px-3 py-1.5 text-sm bg-panel-hi border border-border hover:border-d2-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? "Copied ✓" : "Copy to clipboard"}
        </button>
      </div>
    </section>
  );
}

// Best-effort ANSI (Windows-1252 / Latin-1) encoding. Characters outside 0..255
// fall back to '?' - PD2's ANSI text support is itself limited to Basic Latin +
// Latin-1 Supplement per the wiki.
function toAnsiBlob(text: string): Blob {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    bytes[i] = code <= 0xff ? code : 0x3f; // '?'
  }
  return new Blob([bytes], { type: "text/plain" });
}
