import { useMemo } from "react";
import type {
  ConditionAtom,
  ConditionNode,
  ValueExpr,
  ValueOp,
} from "../../filter/types";
import { classifyConditionCode, infoCodeMeta } from "../../data/filter";
import { CodePicker } from "./CodePicker";
import {
  BOOLEAN_OPTIONS,
  VALUE_LHS_OPTIONS,
  ANY_OPTION_GROUPS,
} from "./codeOptions";

type Props = {
  node: ConditionNode | null;
  onChange: (next: ConditionNode | null) => void;
};

export function ConditionTreeEditor({ node, onChange }: Props) {
  if (!node) {
    return (
      <div className="panel p-3 text-xs text-stone-500 flex items-center justify-between">
        <span className="italic">No conditions (rule matches every item)</span>
        <div className="flex gap-1">
          <button
            onClick={() => onChange(emptyBoolAtomNode())}
            className="px-2 py-0.5 border border-border hover:border-d2-gold"
          >
            + Condition
          </button>
          <button
            onClick={() => onChange({ kind: "and", children: [emptyBoolAtomNode()] })}
            className="px-2 py-0.5 border border-border hover:border-d2-gold"
          >
            + Group
          </button>
        </div>
      </div>
    );
  }
  return <NodeEditor node={node} onChange={onChange} onDelete={() => onChange(null)} depth={0} />;
}

function NodeEditor({
  node,
  onChange,
  onDelete,
  depth,
}: {
  node: ConditionNode;
  onChange: (next: ConditionNode) => void;
  onDelete: () => void;
  depth: number;
}) {
  if (node.kind === "atom") {
    return (
      <AtomEditor
        atom={node.atom}
        depth={depth}
        onChange={(atom) => onChange({ kind: "atom", atom })}
        onDelete={onDelete}
        onWrapNot={() => onChange({ kind: "not", child: node })}
        onWrapGroup={(kind) => onChange({ kind, children: [node, emptyBoolAtomNode()] })}
      />
    );
  }
  if (node.kind === "not") {
    return (
      <div className={`panel ${depthBg(depth)} p-2 flex items-center gap-2`}>
        <span className="text-xs text-d2-red font-bold">NOT</span>
        <div className="flex-1">
          <NodeEditor
            node={node.child}
            onChange={(child) => onChange({ kind: "not", child })}
            onDelete={onDelete}
            depth={depth + 1}
          />
        </div>
        <button
          onClick={() => onChange(node.child)}
          className="text-xs px-2 py-0.5 border border-border hover:border-d2-gold"
          title="Unwrap NOT"
        >
          unwrap
        </button>
      </div>
    );
  }
  // and / or group
  return (
    <div className={`panel ${depthBg(depth)} p-2 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <KindToggle
            kind={node.kind}
            onChange={(kind) => onChange({ ...node, kind })}
          />
          <span className="text-xs text-stone-500 italic">
            {node.children.length} item{node.children.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onChange({ ...node, children: [...node.children, emptyBoolAtomNode()] })
            }
            className="text-xs px-2 py-0.5 border border-border hover:border-d2-gold"
          >
            + Condition
          </button>
          <button
            onClick={() =>
              onChange({
                ...node,
                children: [
                  ...node.children,
                  { kind: node.kind === "and" ? "or" : "and", children: [emptyBoolAtomNode()] },
                ],
              })
            }
            className="text-xs px-2 py-0.5 border border-border hover:border-d2-gold"
          >
            + Group
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-2 py-0.5 border border-border hover:border-d2-red"
            title="Delete group"
          >
            ×
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 pl-3 border-l border-border">
        {node.children.map((child, i) => (
          <NodeEditor
            key={i}
            node={child}
            depth={depth + 1}
            onChange={(next) => {
              const children = [...node.children];
              children[i] = next;
              onChange({ ...node, children });
            }}
            onDelete={() => {
              const children = node.children.filter((_, idx) => idx !== i);
              if (children.length === 0) onChange({ ...node, children: [emptyBoolAtomNode()] });
              else onChange({ ...node, children });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function KindToggle({ kind, onChange }: { kind: "and" | "or"; onChange: (kind: "and" | "or") => void }) {
  return (
    <div className="flex border border-border">
      <button
        onClick={() => onChange("and")}
        className={`px-2 py-0.5 text-xs uppercase tracking-widest ${
          kind === "and" ? "bg-d2-gold text-bg" : "text-stone-400 hover:text-d2-gold"
        }`}
      >
        AND
      </button>
      <button
        onClick={() => onChange("or")}
        className={`px-2 py-0.5 text-xs uppercase tracking-widest ${
          kind === "or" ? "bg-d2-gold text-bg" : "text-stone-400 hover:text-d2-gold"
        }`}
      >
        OR
      </button>
    </div>
  );
}

function AtomEditor({
  atom,
  depth,
  onChange,
  onDelete,
  onWrapNot,
  onWrapGroup,
}: {
  atom: ConditionAtom;
  depth: number;
  onChange: (a: ConditionAtom) => void;
  onDelete: () => void;
  onWrapNot: () => void;
  onWrapGroup: (kind: "and" | "or") => void;
}) {
  return (
    <div className={`panel ${depthBg(depth)} p-2 flex flex-wrap items-center gap-2 text-xs`}>
      <AtomTypeToggle atom={atom} onChange={onChange} />
      <AtomBody atom={atom} onChange={onChange} />
      <div className="ml-auto flex items-center gap-1 shrink-0">
        <button onClick={onWrapNot} className="px-2 py-0.5 border border-border hover:border-d2-red" title="Wrap in NOT">NOT</button>
        <button onClick={() => onWrapGroup("and")} className="px-2 py-0.5 border border-border hover:border-d2-gold" title="Wrap in AND group">AND(…)</button>
        <button onClick={() => onWrapGroup("or")} className="px-2 py-0.5 border border-border hover:border-d2-gold" title="Wrap in OR group">OR(…)</button>
        <button onClick={onDelete} className="px-2 py-0.5 border border-border hover:border-d2-red" title="Delete">×</button>
      </div>
    </div>
  );
}

function AtomTypeToggle({ atom, onChange }: { atom: ConditionAtom; onChange: (a: ConditionAtom) => void }) {
  return (
    <select
      value={atom.type}
      onChange={(e) => onChange(convertAtom(atom, e.target.value as ConditionAtom["type"]))}
      className="bg-panel-hi border border-border px-1 py-0.5 text-xs focus:outline-none focus:border-d2-gold"
    >
      <option value="boolean">Code</option>
      <option value="value">Value</option>
      <option value="multi">MULTI</option>
      <option value="formula">Formula</option>
      <option value="unknown">Raw</option>
    </select>
  );
}

function AtomBody({ atom, onChange }: { atom: ConditionAtom; onChange: (a: ConditionAtom) => void }) {
  switch (atom.type) {
    case "boolean":
      return (
        <CodePicker
          value={atom.code}
          onChange={(code) => onChange({ type: "boolean", code })}
          options={BOOLEAN_OPTIONS}
          placeholder="code"
        />
      );
    case "value":
      return <ValueAtomBody atom={atom} onChange={onChange} />;
    case "multi":
      return (
        <>
          <span className="text-stone-500">MULTI</span>
          <input
            type="number"
            value={atom.stat}
            onChange={(e) => onChange({ ...atom, stat: Number(e.target.value) })}
            className="bg-panel-hi border border-border px-1 py-0.5 w-16 font-mono"
          />
          <span className="text-stone-500">,</span>
          <input
            type="number"
            value={atom.layer}
            onChange={(e) => onChange({ ...atom, layer: Number(e.target.value) })}
            className="bg-panel-hi border border-border px-1 py-0.5 w-16 font-mono"
          />
          <OpSelect value={atom.op} onChange={(op) => onChange({ ...atom, op: op as Exclude<ValueOp,"~"> })} allow={["=","<",">"]} />
          <input
            type="number"
            value={atom.value}
            onChange={(e) => onChange({ ...atom, value: Number(e.target.value) })}
            className="bg-panel-hi border border-border px-1 py-0.5 w-20 font-mono"
          />
        </>
      );
    case "formula":
      return (
        <input
          type="text"
          value={atom.key}
          onChange={(e) => onChange({ ...atom, key: e.target.value })}
          className="bg-panel-hi border border-border px-1 py-0.5 font-mono w-40"
          placeholder="FORMULA_X"
        />
      );
    case "unknown":
      return (
        <input
          type="text"
          value={atom.raw}
          onChange={(e) => onChange({ ...atom, raw: e.target.value })}
          className="bg-panel-hi border border-border px-1 py-0.5 font-mono w-64"
          placeholder="raw condition text"
        />
      );
  }
}

function ValueAtomBody({
  atom,
  onChange,
}: {
  atom: Extract<ConditionAtom, { type: "value" }>;
  onChange: (a: ConditionAtom) => void;
}) {
  const mainCode = atom.lhs.kind === "code" ? atom.lhs.code : atom.lhs.terms[0]?.kind === "code" ? atom.lhs.terms[0].code : "";
  const allowedOps = useMemo(() => {
    const info = infoCodeMeta(mainCode);
    return info?.validOperators ?? (["=","<",">","~"] as ValueOp[]);
  }, [mainCode]);

  const lhsTerms = atom.lhs.kind === "sum" ? atom.lhs.terms.map((t) => (t.kind === "code" ? t.code : "")) : [mainCode];
  const setLhs = (codes: string[]) => {
    const next: ValueExpr = codes.length === 1
      ? { kind: "code", code: codes[0] }
      : { kind: "sum", terms: codes.map((c) => ({ kind: "code", code: c })) };
    onChange({ ...atom, lhs: next });
  };

  return (
    <>
      {lhsTerms.map((term, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-stone-500">+</span>}
          <CodePicker
            value={term}
            onChange={(code) => {
              const next = [...lhsTerms];
              next[i] = code;
              setLhs(next);
            }}
            options={VALUE_LHS_OPTIONS}
            placeholder="code"
          />
        </div>
      ))}
      <button
        onClick={() => setLhs([...lhsTerms, ""])}
        className="px-1 text-stone-500 hover:text-d2-gold"
        title="Add summed code (e.g. FRES+CRES…)"
      >
        +
      </button>
      {lhsTerms.length > 1 && (
        <button
          onClick={() => setLhs(lhsTerms.slice(0, -1))}
          className="px-1 text-stone-500 hover:text-d2-red"
          title="Remove last summed code"
        >
          −
        </button>
      )}
      <OpSelect
        value={atom.op}
        onChange={(op) => onChange({ ...atom, op, rhsHigh: op === "~" ? atom.rhsHigh ?? atom.rhs : undefined })}
        allow={allowedOps}
      />
      <input
        type="number"
        value={atom.rhs}
        onChange={(e) => onChange({ ...atom, rhs: Number(e.target.value) })}
        className="bg-panel-hi border border-border px-1 py-0.5 w-20 font-mono"
      />
      {atom.op === "~" && (
        <>
          <span className="text-stone-500">-</span>
          <input
            type="number"
            value={atom.rhsHigh ?? 0}
            onChange={(e) => onChange({ ...atom, rhsHigh: Number(e.target.value) })}
            className="bg-panel-hi border border-border px-1 py-0.5 w-20 font-mono"
          />
        </>
      )}
    </>
  );
}

function OpSelect({ value, onChange, allow }: { value: ValueOp; onChange: (op: ValueOp) => void; allow: ValueOp[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ValueOp)}
      className="bg-panel-hi border border-border px-1 py-0.5 text-xs font-mono"
    >
      {allow.map((op) => (
        <option key={op} value={op}>{op}</option>
      ))}
    </select>
  );
}

function emptyBoolAtomNode(): ConditionNode {
  return { kind: "atom", atom: { type: "boolean", code: "" } };
}

function convertAtom(prev: ConditionAtom, next: ConditionAtom["type"]): ConditionAtom {
  const mainCode = prev.type === "boolean" ? prev.code : prev.type === "value" && prev.lhs.kind === "code" ? prev.lhs.code : "";
  switch (next) {
    case "boolean":
      return { type: "boolean", code: mainCode };
    case "value":
      return {
        type: "value",
        lhs: { kind: "code", code: mainCode || "CLVL" },
        op: "=",
        rhs: 0,
      };
    case "multi":
      return { type: "multi", stat: 83, layer: 0, op: "=", value: 0 };
    case "formula":
      return { type: "formula", key: "FORMULA_" };
    case "unknown":
      return { type: "unknown", raw: "" };
  }
}

function depthBg(depth: number): string {
  return depth % 2 === 0 ? "" : "panel-hi";
}

// Keep unused import lints happy — we may expand CodePicker usage later.
export type { ConditionNode, ConditionAtom };
void ANY_OPTION_GROUPS;
void classifyConditionCode;
