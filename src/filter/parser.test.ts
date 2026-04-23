import { describe, it, expect } from "vitest";
import { parseFilter } from "./parser";

describe("parseFilter", () => {
  it("parses an empty file", () => {
    const r = parseFilter("");
    expect(r.file.rules).toHaveLength(0);
    expect(r.file.aliases).toHaveLength(0);
  });

  it("parses a minimal rule with no conditions or output", () => {
    const r = parseFilter("ItemDisplay[]:");
    expect(r.file.rules).toHaveLength(1);
    expect(r.file.rules[0].conditions).toBeNull();
    expect(r.file.rules[0].output.name).toHaveLength(0);
  });

  it("parses a rule with %NAME% output", () => {
    const r = parseFilter("ItemDisplay[]: %NAME%");
    expect(r.file.rules).toHaveLength(1);
    const name = r.file.rules[0].output.name;
    expect(name).toEqual([{ kind: "keyword", raw: "%NAME%" }]);
  });

  it("parses implicit-AND conditions", () => {
    const r = parseFilter("ItemDisplay[NMAG SOCKETS=1 CLVL>10]:");
    const conds = r.file.rules[0].conditions!;
    expect(conds.kind).toBe("and");
  });

  it("parses OR with parentheses", () => {
    const r = parseFilter("ItemDisplay[NMAG (BOOTS OR GLOVES OR BELT) CLVL>10]:");
    const root = r.file.rules[0].conditions!;
    expect(root.kind).toBe("and");
    if (root.kind !== "and") return;
    // one child must be an OR group
    const orChild = root.children.find((c) => c.kind === "or");
    expect(orChild).toBeTruthy();
  });

  it("parses BETWEEN range SOCKETS~1-2", () => {
    const r = parseFilter("ItemDisplay[NMAG SOCKETS~1-2]:");
    const conds = r.file.rules[0].conditions!;
    expect(conds.kind).toBe("and");
    if (conds.kind !== "and") return;
    const val = conds.children.find(
      (c) => c.kind === "atom" && c.atom.type === "value"
    );
    expect(val).toBeTruthy();
    if (val?.kind === "atom" && val.atom.type === "value") {
      expect(val.atom.op).toBe("~");
      expect(val.atom.rhs).toBe(1);
      expect(val.atom.rhsHigh).toBe(2);
    }
  });

  it("parses addition-of-codes in value conditions", () => {
    const r = parseFilter("ItemDisplay[RARE FRES+CRES+LRES+PRES>79]: %NAME%");
    const conds = r.file.rules[0].conditions!;
    if (conds.kind !== "and") throw new Error();
    const val = conds.children.find((c) => c.kind === "atom" && c.atom.type === "value");
    if (val?.kind !== "atom" || val.atom.type !== "value") throw new Error();
    expect(val.atom.lhs.kind).toBe("sum");
    if (val.atom.lhs.kind !== "sum") return;
    expect(val.atom.lhs.terms.map((t) => (t.kind === "code" ? t.code : ""))).toEqual(["FRES","CRES","LRES","PRES"]);
  });

  it("parses MULTI syntax", () => {
    const r = parseFilter("ItemDisplay[MULTI83,2=2]:");
    const conds = r.file.rules[0].conditions!;
    if (conds.kind !== "atom" || conds.atom.type !== "multi") throw new Error();
    expect(conds.atom.stat).toBe(83);
    expect(conds.atom.layer).toBe(2);
    expect(conds.atom.op).toBe("=");
    expect(conds.atom.value).toBe(2);
  });

  it("parses negation with parentheses", () => {
    const r = parseFilter("ItemDisplay[MAG !ID HELM !(BAR OR DRU OR ELT)]:");
    const c = r.file.rules[0].conditions!;
    expect(c.kind).toBe("and");
  });

  it("parses description in braces", () => {
    const r = parseFilter("ItemDisplay[]: %NAME%{%NAME%}");
    const out = r.file.rules[0].output;
    expect(out.hasDescription).toBe(true);
    expect(out.description).toEqual([{ kind: "keyword", raw: "%NAME%" }]);
  });

  it("detects %CONTINUE%", () => {
    const r = parseFilter("ItemDisplay[SOCKETS>0]: %NAME% [%SOCKETS%]%CONTINUE%");
    expect(r.file.rules[0].output.continue).toBe(true);
  });

  it("parses notifications", () => {
    const r = parseFilter("ItemDisplay[RUNE>9]: %NAME% %DOT-84%");
    const notifs = r.file.rules[0].output.notifications;
    expect(notifs).toHaveLength(1);
    expect(notifs[0]).toEqual({ kind: "dot", colorHex: "84" });
  });

  it("parses aliases + expands them in rule conditions", () => {
    const input = [
      "Alias[RWBASES]: (NMAG !INF !RW SOCK=0)",
      "ItemDisplay[FILTLVL>1 RWBASES]: %NAME% Socket Me",
    ].join("\n");
    const r = parseFilter(input);
    expect(r.file.aliases).toHaveLength(1);
    expect(r.file.rules).toHaveLength(1);
    const c = r.file.rules[0].conditions!;
    // After expansion, must contain the SOCK condition inside a paren group
    expect(c.kind).toBe("and");
  });

  it("parses disabled rules (leading //)", () => {
    const r = parseFilter("// ItemDisplay[MAG (aqv OR cqv)]: // hides magic quivers if enabled");
    expect(r.file.rules).toHaveLength(1);
    expect(r.file.rules[0].enabled).toBe(false);
  });

  it("parses strictness level declarations", () => {
    const r = parseFilter([
      "ItemDisplayFilterName[]: Low Strictness",
      "ItemDisplayFilterName[]: Medium Strictness",
      "ItemDisplay[yps FILTLVL>1]:",
    ].join("\n"));
    expect(r.file.strictnessLevels.map((l) => l.name)).toEqual(["Low Strictness","Medium Strictness"]);
    expect(r.file.rules).toHaveLength(1);
  });
});
