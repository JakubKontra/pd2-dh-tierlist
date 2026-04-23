import { describe, it, expect } from "vitest";
import { parseFilter } from "./parser";
import { validate } from "./validator";

function diagsFor(src: string) {
  const p = parseFilter(src);
  return [...p.diagnostics, ...validate(p.file)];
}

describe("validator", () => {
  it("errors on an unknown boolean code", () => {
    const d = diagsFor("ItemDisplay[FOOBAR]:");
    expect(d.some((x) => x.severity === "error" && x.message.includes("FOOBAR"))).toBe(true);
  });

  it("accepts well-formed known codes", () => {
    const d = diagsFor("ItemDisplay[RARE FRES+CRES+LRES+PRES>79]: %NAME%");
    expect(d.filter((x) => x.severity === "error")).toHaveLength(0);
  });

  it("errors when PREFIX uses '<' operator", () => {
    const d = diagsFor("ItemDisplay[cm3 PREFIX<1300]: %NAME%");
    expect(d.some((x) => x.code === "invalid-operator")).toBe(true);
  });

  it("allows PREFIX with '=' and '~'", () => {
    const d = diagsFor([
      "ItemDisplay[cm3 PREFIX=1280]: %NAME%",
      "ItemDisplay[cm3 PREFIX~1279-1353]: %NAME%",
    ].join("\n"));
    expect(d.filter((x) => x.code === "invalid-operator")).toHaveLength(0);
  });

  it("accepts MULTI stat codes in range", () => {
    const d = diagsFor("ItemDisplay[MULTI83,2=2]:");
    expect(d.filter((x) => x.severity === "error")).toHaveLength(0);
  });
});
