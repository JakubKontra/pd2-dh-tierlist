import { useMemo, useState } from "react";
import type { NotificationSpec, Output, OutputPart } from "../../filter/types";
import { COLORS } from "../../data/filter/colors";
import { OUTPUT_KEYWORDS } from "../../data/filter/outputKeywords";
import { NOTIF_KINDS } from "../../data/filter/notificationKeywords";

type Props = {
  output: Output;
  onChange: (next: Output) => void;
};

export function OutputEditor({ output, onChange }: Props) {
  const [target, setTarget] = useState<"name" | "desc">("name");
  const current = target === "name" ? output.name : output.description;
  const updateCurrent = (next: OutputPart[]) => {
    if (target === "name") onChange({ ...output, name: next });
    else onChange({ ...output, description: next, hasDescription: true });
  };

  const insertText = (text: string) => {
    updateCurrent([...current, { kind: "text", value: text }]);
  };
  const insertKeyword = (raw: string) => {
    updateCurrent([...current, { kind: "keyword", raw }]);
  };

  const counts = useMemo(() => {
    const nameLen = textLen(output.name);
    const descLen = textLen(output.description);
    return { nameLen, descLen };
  }, [output.name, output.description]);

  return (
    <div className="panel p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="heading-gold text-sm uppercase tracking-widest">Output</h3>
        <div className="flex items-center border border-border">
          <button
            className={`px-2 py-0.5 text-xs ${target === "name" ? "bg-d2-gold text-bg" : "text-stone-400 hover:text-d2-gold"}`}
            onClick={() => setTarget("name")}
          >
            Name ({counts.nameLen}/56)
          </button>
          <button
            className={`px-2 py-0.5 text-xs ${target === "desc" ? "bg-d2-gold text-bg" : "text-stone-400 hover:text-d2-gold"}`}
            onClick={() => {
              setTarget("desc");
              if (!output.hasDescription) onChange({ ...output, hasDescription: true });
            }}
          >
            Description ({counts.descLen}/500)
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 text-xs min-h-[2rem] border border-border p-2 bg-panel-hi">
        {current.length === 0 ? (
          <span className="text-stone-600 italic">(empty)</span>
        ) : (
          current.map((p, i) => (
            <Chip
              key={i}
              part={p}
              onChange={(next) => {
                const copy = [...current];
                copy[i] = next;
                updateCurrent(copy);
              }}
              onDelete={() => updateCurrent(current.filter((_, idx) => idx !== i))}
            />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <InsertTextButton onInsert={insertText} />
        <KeywordMenu onInsert={insertKeyword} />
        <ColorMenu onInsert={insertKeyword} />
      </div>

      <NotificationSettings output={output} onChange={onChange} />
    </div>
  );
}

function Chip({
  part,
  onChange,
  onDelete,
}: {
  part: OutputPart;
  onChange: (next: OutputPart) => void;
  onDelete: () => void;
}) {
  if (part.kind === "text") {
    return (
      <span className="inline-flex items-center gap-1 bg-panel border border-border px-1">
        <input
          value={part.value}
          onChange={(e) => onChange({ kind: "text", value: e.target.value })}
          className="bg-transparent text-d2-normal font-mono px-1 py-0.5 outline-none"
          size={Math.max(part.value.length + 2, 4)}
        />
        <button onClick={onDelete} className="text-stone-500 hover:text-d2-red">×</button>
      </span>
    );
  }
  const keyword = part.raw.slice(1, -1);
  const color = COLORS.find((c) => c.keyword === keyword.toUpperCase());
  return (
    <span
      className="inline-flex items-center gap-1 border border-border px-1"
      style={color ? { borderColor: color.hex, color: color.hex } : undefined}
    >
      <span className="font-mono text-xs">{part.raw}</span>
      <button onClick={onDelete} className="text-stone-500 hover:text-d2-red">×</button>
    </span>
  );
}

function InsertTextButton({ onInsert }: { onInsert: (text: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex items-center gap-1">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="literal text"
        className="bg-panel-hi border border-border px-2 py-1 text-xs font-mono"
        onKeyDown={(e) => {
          if (e.key === "Enter" && value) {
            onInsert(value);
            setValue("");
          }
        }}
      />
      <button
        onClick={() => {
          if (value) {
            onInsert(value);
            setValue("");
          }
        }}
        className="text-xs px-2 py-1 border border-border hover:border-d2-gold"
      >
        + Text
      </button>
    </div>
  );
}

function KeywordMenu({ onInsert }: { onInsert: (raw: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-2 py-1 border border-border hover:border-d2-gold"
      >
        + Keyword ▾
      </button>
      {open && (
        <div
          className="absolute z-20 top-full left-0 mt-1 w-72 max-h-64 overflow-y-auto panel scrollbar-thin"
          onBlur={() => setOpen(false)}
        >
          {OUTPUT_KEYWORDS.map((k) => (
            <button
              key={k.keyword}
              onClick={() => {
                onInsert(`%${k.keyword}%`);
                setOpen(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-panel-hi"
            >
              <span className="font-mono text-d2-gold">%{k.keyword}%</span>{" "}
              <span className="text-stone-400">{k.label}</span>
              <div className="text-stone-600 text-[10px]">{k.category}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorMenu({ onInsert }: { onInsert: (raw: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-2 py-1 border border-border hover:border-d2-gold"
      >
        + Color ▾
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 w-56 panel scrollbar-thin grid grid-cols-2 gap-1 p-1">
          {COLORS.map((c) => (
            <button
              key={c.keyword}
              onClick={() => {
                onInsert(`%${c.keyword}%`);
                setOpen(false);
              }}
              className="text-left px-2 py-1 text-xs hover:bg-panel-hi flex items-center gap-2"
              style={{ color: c.hex }}
            >
              <span className="inline-block w-3 h-3 border border-border" style={{ background: c.hex }} />
              <span className="font-mono">{c.keyword}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationSettings({
  output,
  onChange,
}: {
  output: Output;
  onChange: (next: Output) => void;
}) {
  const addNotif = (spec: NotificationSpec, raw: string) => {
    onChange({
      ...output,
      notifications: [...output.notifications, spec],
      name: [...output.name, { kind: "keyword", raw }],
    });
  };

  return (
    <div className="border-t border-border pt-2 flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={output.continue}
          onChange={(e) => {
            if (e.target.checked) {
              onChange({
                ...output,
                continue: true,
                name: [...output.name, { kind: "keyword", raw: "%CONTINUE%" }],
              });
            } else {
              onChange({
                ...output,
                continue: false,
                name: output.name.filter(
                  (p) => !(p.kind === "keyword" && p.raw.toUpperCase() === "%CONTINUE%")
                ),
              });
            }
          }}
        />
        %CONTINUE%
      </label>
      <label className="flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={output.hasDescription}
          onChange={(e) => onChange({ ...output, hasDescription: e.target.checked })}
        />
        has description {'{…}'}
      </label>
      <NotifInsert onInsert={addNotif} />
    </div>
  );
}

function NotifInsert({
  onInsert,
}: {
  onInsert: (spec: NotificationSpec, raw: string) => void;
}) {
  const [kind, setKind] = useState<(typeof NOTIF_KINDS)[number]["kind"]>("MAP");
  const [hex, setHex] = useState("84");
  const [num, setNum] = useState("0");

  const insert = () => {
    const raw =
      kind === "MAP" && !hex
        ? "%MAP%"
        : kind === "SOUNDID"
        ? `%SOUNDID-${num}%`
        : kind === "NOTIFY"
        ? `%NOTIFY-${hex}%`
        : kind === "TIER"
        ? `%TIER-${num}%`
        : `%${kind}-${hex}%`;
    let spec: NotificationSpec;
    switch (kind) {
      case "BORDER": spec = { kind: "border", colorHex: hex }; break;
      case "MAP":    spec = { kind: "map",    colorHex: hex || undefined }; break;
      case "DOT":    spec = { kind: "dot",    colorHex: hex }; break;
      case "PX":     spec = { kind: "px",     colorHex: hex }; break;
      case "SOUNDID": spec = { kind: "sound", soundId: Number(num) }; break;
      case "NOTIFY": spec = { kind: "notify", colorCode: hex }; break;
      case "TIER":   spec = { kind: "tier",   level: Number(num) }; break;
    }
    onInsert(spec, raw);
  };

  return (
    <div className="flex items-center gap-1">
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value as typeof kind)}
        className="bg-panel-hi border border-border px-1 py-0.5 text-xs"
      >
        {NOTIF_KINDS.map((k) => (
          <option key={k.kind} value={k.kind}>{k.label}</option>
        ))}
      </select>
      {(kind === "BORDER" || kind === "MAP" || kind === "DOT" || kind === "PX" || kind === "NOTIFY") && (
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value.toUpperCase())}
          placeholder="XX"
          className="bg-panel-hi border border-border px-1 py-0.5 w-12 font-mono text-xs"
        />
      )}
      {(kind === "SOUNDID" || kind === "TIER") && (
        <input
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder="0"
          className="bg-panel-hi border border-border px-1 py-0.5 w-16 font-mono text-xs"
        />
      )}
      <button onClick={insert} className="text-xs px-2 py-1 border border-border hover:border-d2-gold">
        + Notification
      </button>
    </div>
  );
}

function textLen(parts: OutputPart[]): number {
  let n = 0;
  for (const p of parts) n += p.kind === "text" ? p.value.length : p.raw.length;
  return n;
}
