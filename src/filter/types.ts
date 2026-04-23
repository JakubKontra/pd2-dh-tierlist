// AST types for PD2 loot filter files.
// Reference: https://wiki.projectdiablo2.com/wiki/Item_Filtering

export type Span = { line: number; col: number; length: number };

export type FilterFile = {
  strictnessLevels: StrictnessLevel[];
  aliases: Alias[];
  formulas: Formula[];
  rules: Rule[];
  // Preserved for round-trip fidelity & comment retention
  rawLines: string[];
};

export type StrictnessLevel = {
  id: string;
  name: string;
  sourceLine: number;
};

export type Alias = {
  id: string;
  key: string;          // e.g. RWBASES
  value: string;        // e.g. (NMAG !INF !RW SOCK=0)
  sourceLine: number;
};

export type Formula = {
  id: string;
  key: string;          // e.g. _A
  expression: string;   // raw formula body (not parsed into an expression tree here)
  sourceLine: number;
};

export type Rule = {
  id: string;
  enabled: boolean;               // false = commented out with leading //
  conditions: ConditionNode | null;
  output: Output;
  inlineComment?: string;         // trailing // comment on the ItemDisplay line
  leadingComments: string[];      // stand-alone comment lines immediately above
  sourceLine: number;
};

export type ConditionNode =
  | { kind: "and"; children: ConditionNode[] }
  | { kind: "or"; children: ConditionNode[] }
  | { kind: "not"; child: ConditionNode }
  | { kind: "atom"; atom: ConditionAtom };

export type ConditionAtom =
  | BooleanAtom
  | ValueAtom
  | MultiAtom
  | FormulaAtom
  | UnknownAtom;

export type BooleanAtom = {
  type: "boolean";
  code: string;              // e.g. ETH, MAG, RARE, SHOP, HELM
};

export type ValueAtom = {
  type: "value";
  lhs: ValueExpr;
  op: ValueOp;
  rhs: number;
  rhsHigh?: number;          // used when op === "~"
};

export type ValueOp = "=" | "<" | ">" | "~";

export type MultiAtom = {
  type: "multi";
  stat: number;              // 83, 97, 107, 151, 188, 191, 195..202, 204, 359, 427, 453
  layer: number;             // class_id, skill_id, (skill_id*64)+level, etc.
  op: Exclude<ValueOp, "~">;
  value: number;
};

export type FormulaAtom = {
  type: "formula";
  key: string;               // FORMULA_X (reference to a Formula def)
};

export type UnknownAtom = {
  type: "unknown";
  raw: string;               // preserved verbatim; validator will flag it
};

export type ValueExpr =
  | { kind: "code"; code: string }             // CLVL, ILVL, SOCKETS, STAT60, ALLATTRIB…
  | { kind: "sum"; terms: ValueExpr[] };       // FRES+CRES+LRES+PRES, STAT60+STAT62

export type Output = {
  name: OutputPart[];
  description: OutputPart[];
  hasDescription: boolean;   // even `{}` with no content is distinct from no braces
  continue: boolean;
  notifications: NotificationSpec[];
  priceColor?: string;       // trailing color keyword after name (for SHOP items)
};

export type OutputPart =
  | { kind: "text"; value: string }
  | { kind: "keyword"; raw: string };          // full token incl. %…% — serialized as-is

export type NotificationSpec =
  | { kind: "border"; colorHex: string }       // %BORDER-XX%
  | { kind: "map"; colorHex?: string }         // %MAP-XX% or %MAP%
  | { kind: "dot"; colorHex: string }          // %DOT-XX%
  | { kind: "px"; colorHex: string }           // %PX-XX%
  | { kind: "sound"; soundId: number }         // %SOUNDID-N%
  | { kind: "notify"; colorCode: string }      // %NOTIFY-X% or %NOTIFY-DEAD%
  | { kind: "tier"; level: number };           // %TIER-N%

// ---- Diagnostics ----

export type Diagnostic = {
  severity: "error" | "warning" | "info";
  message: string;
  line: number;              // 1-based
  col?: number;
  length?: number;
  ruleId?: string;
  code?: string;             // diagnostic code (e.g. "unknown-token", "invalid-operator")
};

export type ParseResult = {
  file: FilterFile;
  diagnostics: Diagnostic[];
};

// ---- Evaluator (preview) ----

export type SampleItem = {
  code: string;
  displayName: string;
  rarity: "nmag" | "mag" | "rare" | "uni" | "set" | "craft";
  tier?: "norm" | "exc" | "elt";
  ilvl?: number;
  alvl?: number;
  sockets?: number;
  eth?: boolean;
  identified?: boolean;
  runeword?: boolean;
  runeNum?: number;
  gemLevel?: number;
  gemType?: number;
  stats?: Record<string, number>;
  category?: string;
};

export type ResolvedDisplay = {
  hidden: boolean;
  name: string;
  description?: string;
  notifications: NotificationSpec[];
  matchedRuleIds: string[];
};
