import { useState, type RefObject } from "react";
import { toPng } from "html-to-image";

interface Props {
  targetRef: RefObject<HTMLElement | null>;
  filename?: string;
  label?: string;
}

export function ExportPngButton({
  targetRef,
  filename = "pd2-tierlist.png",
  label = "Save PNG",
}: Props) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    const node = targetRef.current;
    if (!node || busy) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0a0805",
        style: { padding: "16px" },
        filter: (el) => {
          if (!(el instanceof HTMLElement)) return true;
          return !el.dataset.exportIgnore;
        },
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (e) {
      console.error("PNG export failed", e);
      alert("Couldn't export PNG. Try a different browser or shrink the view.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      title="Download current view as PNG"
      data-export-ignore
      className="px-2 py-1 text-[11px] uppercase tracking-wider font-mono rounded-sm border border-d2-unique/60 text-d2-unique hover:border-d2-gold hover:text-d2-gold transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M8 2v9m0 0l-3-3m3 3l3-3M3 13h10" />
      </svg>
      {busy ? "Rendering…" : label}
    </button>
  );
}
