import type { MapImmunities } from "../../data/lateGame/types";

const COLS = [
  { key: "fire", label: "Fire", color: "#ff6a3a" },
  { key: "cold", label: "Cold", color: "#7ad2ff" },
  { key: "lightning", label: "Lightning", color: "#ffd84a" },
  { key: "poison", label: "Poison", color: "#7fd65a" },
  { key: "physical", label: "Physical", color: "#d8c8a8" },
  { key: "magic", label: "Magic", color: "#b388ff" },
] as const;

export function MapImmunityTable({ data }: { data: MapImmunities }) {
  if (data.tiers.length === 0) return null;
  return (
    <section className="panel p-4">
      <h4 className="font-display text-base uppercase tracking-wider text-d2-gold mb-3">
        S13 Map Tiers &amp; Immunities
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.tiers.map((tier) => (
          <div key={tier.label}>
            <header className="text-xs uppercase tracking-widest text-d2-unique mb-1.5 pb-1 border-b border-border">
              {tier.label}
            </header>
            <ul className="space-y-0.5">
              {tier.maps.map((m) => (
                <li
                  key={m.name}
                  className="grid items-center gap-1.5 py-0.5 text-xs"
                  style={{ gridTemplateColumns: "1fr auto" }}
                >
                  <span className="text-stone-300 truncate" title={m.name}>
                    {m.name}
                  </span>
                  <span className="flex gap-1">
                    {COLS.map((c) => {
                      const present = m[c.key] === "yes";
                      return (
                        <span
                          key={c.key}
                          className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold"
                          style={{
                            backgroundColor: present ? c.color : "transparent",
                            color: present ? "#0a0805" : "#3a2e20",
                            border: present
                              ? `1px solid ${c.color}`
                              : "1px solid var(--color-border)",
                          }}
                          title={`${c.label} immune`}
                          aria-label={present ? `${c.label} immune` : undefined}
                        >
                          {c.label[0]}
                        </span>
                      );
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data.footnote && (
        <p className="text-xs text-stone-500 mt-3 italic">{data.footnote}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-stone-500">
        {COLS.map((c) => (
          <span key={c.key} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: c.color }}
            />
            {c.label}
          </span>
        ))}
      </div>
    </section>
  );
}
