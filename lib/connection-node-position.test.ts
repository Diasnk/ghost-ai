import { describe, expect, it } from "vitest";

import {
  getConnectionNodeFlowPosition,
  getConnectionNodeOffset,
  inferConnectionNodePosition,
} from "@/lib/connection-node-position";
import {
  CONNECTION_NODE_POSITIONS,
  NODE_SHAPES,
} from "@/types/canvas";

describe("getConnectionNodeOffset", () => {
  it("places rectangle nodes at center of each edge", () => {
    expect(getConnectionNodeOffset("rectangle", 160, 80, "top")).toEqual({
      x: 80,
      y: 0,
    });
    expect(getConnectionNodeOffset("rectangle", 160, 80, "right")).toEqual({
      x: 160,
      y: 40,
    });
    expect(getConnectionNodeOffset("rectangle", 160, 80, "bottom")).toEqual({
      x: 80,
      y: 80,
    });
    expect(getConnectionNodeOffset("rectangle", 160, 80, "left")).toEqual({
      x: 0,
      y: 40,
    });
  });

  it("places pill nodes at center of each edge", () => {
    expect(getConnectionNodeOffset("pill", 160, 64, "top")).toEqual({
      x: 80,
      y: 0,
    });
    expect(getConnectionNodeOffset("pill", 160, 64, "left")).toEqual({
      x: 0,
      y: 32,
    });
  });

  it("places circle nodes on the ellipse boundary", () => {
    expect(getConnectionNodeOffset("circle", 120, 80, "top")).toEqual({
      x: 60,
      y: 0,
    });
    expect(getConnectionNodeOffset("circle", 120, 80, "right")).toEqual({
      x: 120,
      y: 40,
    });
    expect(getConnectionNodeOffset("circle", 120, 80, "bottom")).toEqual({
      x: 60,
      y: 80,
    });
    expect(getConnectionNodeOffset("circle", 120, 80, "left")).toEqual({
      x: 0,
      y: 40,
    });
  });

  it("returns offsets for every shape and side", () => {
    for (const shape of NODE_SHAPES) {
      for (const node of CONNECTION_NODE_POSITIONS) {
        const offset = getConnectionNodeOffset(shape, 120, 100, node);
        expect(offset.x).toBeGreaterThanOrEqual(0);
        expect(offset.y).toBeGreaterThanOrEqual(0);
        expect(offset.x).toBeLessThanOrEqual(120);
        expect(offset.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("scales relative offsets proportionally with size", () => {
    const small = getConnectionNodeOffset("rectangle", 80, 40, "right");
    const large = getConnectionNodeOffset("rectangle", 160, 80, "right");
    expect(large.x / small.x).toBe(2);
    expect(large.y / small.y).toBe(2);
  });
});

describe("getConnectionNodeFlowPosition", () => {
  it("adds node position to local offset", () => {
    const flow = getConnectionNodeFlowPosition(
      { x: 100, y: 50 },
      "rectangle",
      160,
      80,
      "right"
    );
    expect(flow).toEqual({ x: 260, y: 90 });
  });
});

describe("inferConnectionNodePosition", () => {
  it("infers the nearest side from a flow point", () => {
    const nodePosition = { x: 0, y: 0 };
    const width = 160;
    const height = 80;

    const top = inferConnectionNodePosition(
      "rectangle",
      width,
      height,
      { x: 80, y: 0 },
      nodePosition
    );
    const right = inferConnectionNodePosition(
      "rectangle",
      width,
      height,
      { x: 160, y: 40 },
      nodePosition
    );

    expect(top).toBe("top");
    expect(right).toBe("right");
  });

  it("returns a valid side for diamond geometry", () => {
    const side = inferConnectionNodePosition(
      "diamond",
      140,
      100,
      { x: 140, y: 50 },
      { x: 0, y: 0 }
    );
    expect(CONNECTION_NODE_POSITIONS).toContain(side);
  });
});
