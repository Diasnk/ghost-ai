import { describe, expect, it } from "vitest";

import { resolveNodeShape } from "@/lib/resolve-node-shape";
import { NODE_SHAPES } from "@/types/canvas";

describe("resolveNodeShape", () => {
  it("returns each supported shape unchanged", () => {
    for (const shape of NODE_SHAPES) {
      expect(resolveNodeShape(shape)).toBe(shape);
    }
  });

  it("defaults missing shape to rectangle", () => {
    expect(resolveNodeShape(undefined)).toBe("rectangle");
  });

  it("defaults null shape to rectangle", () => {
    expect(resolveNodeShape(null)).toBe("rectangle");
  });

  it("defaults unknown shape values to rectangle", () => {
    expect(resolveNodeShape("square")).toBe("rectangle");
    expect(resolveNodeShape("")).toBe("rectangle");
    expect(resolveNodeShape(42)).toBe("rectangle");
  });
});
