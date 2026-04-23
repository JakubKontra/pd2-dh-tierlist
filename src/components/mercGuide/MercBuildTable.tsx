import type { MercBuildRow, MercSlot } from "../../data/mercGuide/types";

function MercTypeCell({ slot }: { slot: MercSlot }) {
  if (slot.sameAsOffensive) {
    return (
      <span className="inline-block px-1.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wider text-d2-unique border border-d2-unique/60">
        Same as Off.
      </span>
    );
  }
  if (slot.notApplicable) {
    return <span className="text-stone-600">—</span>;
  }
  if (slot.mercTypes.length === 0) {
    return <span className="text-stone-600">—</span>;
  }
  return (
    <div className="space-y-0.5">
      {slot.mercTypes.map((line, i) => (
        <div key={i} className="text-stone-100 font-semibold text-xs leading-snug">
          {line}
        </div>
      ))}
    </div>
  );
}

function ItemList({ slot }: { slot: MercSlot }) {
  if (slot.sameAsOffensive) {
    return <span className="text-stone-600 text-xs">↖ same</span>;
  }
  if (slot.notApplicable || slot.items.length === 0) {
    return <span className="text-stone-600">—</span>;
  }
  return (
    <ul className="space-y-0.5 text-stone-300 text-xs leading-snug">
      {slot.items.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

export function MercBuildTable({ rows }: { rows: MercBuildRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-panel-hi/40 text-d2-gold font-display uppercase tracking-widest text-[11px]">
            <th
              rowSpan={2}
              className="text-left px-3 py-2 align-bottom border-b border-border w-[160px]"
            >
              Build
            </th>
            <th
              colSpan={2}
              className="text-center px-2 py-2 border-b border-border/60 border-r border-border/40"
            >
              Offensive
            </th>
            <th
              colSpan={2}
              className="text-center px-2 py-2 border-b border-border/60 border-r border-border/40"
            >
              Defensive
            </th>
            <th
              colSpan={2}
              className="text-center px-2 py-2 border-b border-border/60"
            >
              Starter
            </th>
          </tr>
          <tr className="text-d2-unique text-[10px] uppercase tracking-widest">
            <th className="text-left px-2 py-1.5 border-b border-border min-w-[160px]">
              Merc Type
            </th>
            <th className="text-left px-2 py-1.5 border-b border-border border-r border-border/40 min-w-[150px]">
              Key Items
            </th>
            <th className="text-left px-2 py-1.5 border-b border-border min-w-[160px]">
              Merc Type
            </th>
            <th className="text-left px-2 py-1.5 border-b border-border border-r border-border/40 min-w-[150px]">
              Key Items
            </th>
            <th className="text-left px-2 py-1.5 border-b border-border min-w-[180px]">
              Merc Type
            </th>
            <th className="text-left px-2 py-1.5 border-b border-border min-w-[150px]">
              Key Items
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${i}-${row.name}`}
              className="border-b border-border/40 hover:bg-panel-hi/40 align-top"
            >
              <td className="px-3 py-2 text-stone-100 font-display uppercase tracking-wider text-xs">
                {row.name}
              </td>
              <td className="px-2 py-2">
                <MercTypeCell slot={row.offensive} />
              </td>
              <td className="px-2 py-2 border-r border-border/40">
                <ItemList slot={row.offensive} />
              </td>
              <td className="px-2 py-2">
                <MercTypeCell slot={row.defensive} />
              </td>
              <td className="px-2 py-2 border-r border-border/40">
                <ItemList slot={row.defensive} />
              </td>
              <td className="px-2 py-2">
                <MercTypeCell slot={row.starter} />
              </td>
              <td className="px-2 py-2">
                <ItemList slot={row.starter} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
