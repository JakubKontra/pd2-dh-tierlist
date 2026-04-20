import { useState } from "react";

export function ShareButton({
  label = "Share",
  title = "Copy link to clipboard",
}: {
  label?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — fallback: prompt */
      window.prompt("Copy link:", window.location.href);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-2 py-1 text-[11px] uppercase tracking-wider font-mono rounded-sm border border-d2-unique/60 text-d2-unique hover:border-d2-gold hover:text-d2-gold transition-colors inline-flex items-center gap-1.5"
    >
      <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M11 2a2 2 0 100 4 2 2 0 000-4zM5 6a2 2 0 100 4 2 2 0 000-4zm6 4a2 2 0 100 4 2 2 0 000-4zM7 8.5l3-2m0 3l-3-2" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      {copied ? "Copied!" : label}
    </button>
  );
}
