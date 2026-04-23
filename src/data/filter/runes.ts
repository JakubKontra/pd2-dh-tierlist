export type RuneDef = {
  number: number;          // 1..33
  code: string;            // r01..r33
  stackedCode: string;     // r01s..r33s
  name: string;            // "El", "Eld", ... "Zod"
};

export const RUNE_NAMES = [
  "El","Eld","Tir","Nef","Eth","Ith","Tal","Ral","Ort","Thul",
  "Amn","Sol","Shael","Dol","Hel","Io","Lum","Ko","Fal","Lem",
  "Pul","Um","Mal","Ist","Gul","Vex","Ohm","Lo","Sur","Ber",
  "Jah","Cham","Zod",
];

export const RUNES: RuneDef[] = RUNE_NAMES.map((name, i) => {
  const n = i + 1;
  const pad = n.toString().padStart(2, "0");
  return {
    number: n,
    code: `r${pad}`,
    stackedCode: `r${pad}s`,
    name,
  };
});

export const RUNES_BY_CODE: Record<string, RuneDef> = Object.fromEntries(
  RUNES.flatMap((r) => [[r.code, r], [r.stackedCode, r]])
);
