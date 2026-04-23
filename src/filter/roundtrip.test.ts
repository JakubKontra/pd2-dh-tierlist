import { describe, it, expect } from "vitest";
import { parseFilter } from "./parser";
import { serializeFilter } from "./serializer";

// Round-trip a diverse set of rules. We assert that parse → serialize → parse
// produces an equivalent AST (same rule count, same condition trees, same
// outputs). Exact text identity is NOT guaranteed because we normalize things
// like `NMAG SOCKETS=1` (serialized with implicit AND and no extra whitespace).

const FIXTURES = [
  "ItemDisplay[]: %NAME%",
  "ItemDisplay[]: %NAME%{%NAME%}",
  "ItemDisplay[NMAG SOCKETS~1-2]:",
  "ItemDisplay[RARE FRES+CRES+LRES+PRES>79]: %NAME% %RED%!",
  "ItemDisplay[MAG !ID HELM !(BAR OR DRU OR ELT)]:",
  "ItemDisplay[SOCKETS>0]: %NAME% [%SOCKETS%]%CONTINUE%",
  "ItemDisplay[MULTI83,2=2]:",
  "ItemDisplay[(GOLD<100 OR (GOLD<1000 CLVL>50))]:",
  "ItemDisplay[yps CLVL>89 !(MAPID>160 MAPID<164)]:",
  "ItemDisplay[cm3 PREFIX~1279-1353]: %NAME% +1",
];

describe("round-trip", () => {
  for (const src of FIXTURES) {
    it(`roundtrips: ${src.slice(0, 48)}…`, () => {
      const first = parseFilter(src);
      const re = serializeFilter(first.file);
      const second = parseFilter(re);
      expect(second.file.rules).toHaveLength(first.file.rules.length);
      // compare the AST - serialize both ASTs again and compare the strings
      expect(serializeFilter(second.file)).toBe(re);
    });
  }

  it("handles multi-rule file with aliases + comments", () => {
    const input = [
      "// file-level comment",
      "ItemDisplayFilterName[]: Low Strictness",
      "",
      "Alias[RWBASES]: (NMAG !INF !RW SOCK=0)",
      "",
      "// leading comment for next rule",
      "ItemDisplay[FILTLVL>1 RWBASES]: %NAME% Socket Me",
      "// ItemDisplay[tsc]: //%NAME%",
      "ItemDisplay[RUNE>9]: %ORANGE% %NAME% %ORANGE%",
    ].join("\n");
    const first = parseFilter(input);
    expect(first.diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    const re = serializeFilter(first.file);
    const second = parseFilter(re);
    expect(second.file.rules).toHaveLength(first.file.rules.length);
  });
});
