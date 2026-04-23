import { useEffect, useMemo, useRef, useState } from "react";

export type CodeOption = {
  code: string;
  label: string;
  group: string;
  description?: string;
};

type Props = {
  value: string;
  onChange: (code: string) => void;
  options: CodeOption[];
  placeholder?: string;
  autoFocus?: boolean;
};

export function CodePicker({ value, onChange, options, placeholder = "Code...", autoFocus }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external `value` prop to internal `query` state during render.
  if (value !== lastValue) {
    setLastValue(value);
    setQuery(value);
  }

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 150);
    const starts: CodeOption[] = [];
    const contains: CodeOption[] = [];
    for (const o of options) {
      const code = o.code.toLowerCase();
      const label = o.label.toLowerCase();
      if (code.startsWith(q) || label.startsWith(q)) starts.push(o);
      else if (code.includes(q) || label.includes(q) || o.description?.toLowerCase().includes(q)) contains.push(o);
      if (starts.length + contains.length > 200) break;
    }
    return [...starts, ...contains].slice(0, 150);
  }, [options, query]);

  const commit = (code: string) => {
    onChange(code);
    setQuery(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Commit raw text on blur so users can type unknown codes and they'll still be saved
          if (query !== value) onChange(query);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filtered[0]) {
            e.preventDefault();
            commit(filtered[0].code);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        className="bg-panel-hi border border-border px-2 py-1 font-mono text-xs w-32 focus:outline-none focus:border-d2-gold"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-20 top-full left-0 mt-1 w-72 max-h-64 overflow-y-auto panel scrollbar-thin">
          {filtered.map((o) => (
            <button
              key={o.code + o.group}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                commit(o.code);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-panel-hi"
            >
              <span className="font-mono text-d2-gold">{o.code}</span>
              <span className="text-stone-400 ml-2">{o.label}</span>
              <div className="text-stone-600 text-[10px]">{o.group}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
