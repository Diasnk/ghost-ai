import { describe, expect, it } from "vitest";

import {
  getNodeMinDimensions,
  getShapeDefaults,
  parseShapeDragPayload,
  serializeShapeDragPayload,
} from "@/lib/canvas-shape-defaults";
import { NODE_SHAPES } from "@/types/canvas";

describe("getNodeMinDimensions", () => {
  it("returns half of each shape default size floored", () => {
    expect(getNodeMinDimensions("rectangle")).toEqual({
      minWidth: 80,
      minHeight: 40,
    });
    expect(getNodeMinDimensions("circle")).toEqual({
      minWidth: 60,
      minHeight: 40,
    });
    expect(getNodeMinDimensions("diamond")).toEqual({
      minWidth: 70,
      minHeight: 50,
    });
    expect(getNodeMinDimensions("pill")).toEqual({
      minWidth: 80,
      minHeight: 32,
    });
    expect(getNodeMinDimensions("cylinder")).toEqual({
      minWidth: 60,
      minHeight: 40,
    });
    expect(getNodeMinDimensions("hexagon")).toEqual({
      minWidth: 60,
      minHeight: 50,
    });
  });

  it("stays below default drop dimensions for every shape", () => {
    for (const shape of NODE_SHAPES) {
      const defaults = getShapeDefaults(shape);
      const mins = getNodeMinDimensions(shape);
      expect(mins.minWidth).toBeLessThan(defaults.width);
      expect(mins.minHeight).toBeLessThan(defaults.height);
    }
  });
});

describe("parseShapeDragPayload", () => {
  it("parses valid payloads for every supported shape", () => {
    for (const shape of NODE_SHAPES) {
      const payload = getShapeDefaults(shape);
      const raw = serializeShapeDragPayload(payload);
      expect(parseShapeDragPayload(raw)).toEqual(payload);
    }
  });

  it("rejects malformed payloads", () => {
    expect(parseShapeDragPayload("not-json")).toBeNull();
    expect(parseShapeDragPayload("{}")).toBeNull();
    expect(
      parseShapeDragPayload(
        JSON.stringify({ shape: "rectangle", width: 0, height: 80 })
      )
    ).toBeNull();
    expect(
      parseShapeDragPayload(
        JSON.stringify({ shape: "unknown", width: 160, height: 80 })
      )
    ).toBeNull();
  });
});
