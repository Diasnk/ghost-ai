import { describe, expect, it } from "vitest";

import {
  getShapeDefaults,
  parseShapeDragPayload,
  serializeShapeDragPayload,
} from "@/lib/canvas-shape-defaults";
import { NODE_SHAPES } from "@/types/canvas";

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
