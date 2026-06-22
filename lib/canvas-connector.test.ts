import { describe, expect, it } from "vitest";

import {
  createCanvasEdge,
  createEdgeRemovalChanges,
  isValidConnection,
  normalizeCanvasEdge,
  removeEdgesForDeletedNodes,
} from "@/lib/canvas-connector";
import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  parseConnectionHandleId,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

function makeNode(id: string): CanvasNode {
  return {
    id,
    type: CANVAS_NODE_TYPE,
    position: { x: 0, y: 0 },
    data: { label: "", color: "#1F1F1F" },
    width: 160,
    height: 80,
  };
}

describe("parseConnectionHandleId", () => {
  it("parses legacy and suffixed handle ids", () => {
    expect(parseConnectionHandleId("top")).toBe("top");
    expect(parseConnectionHandleId("right-source")).toBe("right");
    expect(parseConnectionHandleId("left-target")).toBe("left");
    expect(parseConnectionHandleId("invalid")).toBeNull();
  });
});

describe("isValidConnection", () => {
  it("accepts connections between different nodes with valid handles", () => {
    expect(
      isValidConnection({
        source: "a",
        target: "b",
        sourceHandle: "top-source",
        targetHandle: "left-target",
      })
    ).toBe(true);
  });

  it("rejects self-connections", () => {
    expect(
      isValidConnection({
        source: "a",
        target: "a",
        sourceHandle: "top",
        targetHandle: "left",
      })
    ).toBe(false);
  });

  it("rejects missing handles", () => {
    expect(
      isValidConnection({
        source: "a",
        target: "b",
        sourceHandle: null,
        targetHandle: "left",
      })
    ).toBe(false);
  });

  it("rejects invalid handle names", () => {
    expect(
      isValidConnection({
        source: "a",
        target: "b",
        sourceHandle: "corner",
        targetHandle: "left",
      })
    ).toBe(false);
  });
});

describe("createCanvasEdge", () => {
  it("stores shape ids and node positions on the edge", () => {
    const edge = createCanvasEdge({
      source: "shape-a",
      target: "shape-b",
      sourceHandle: "right-source",
      targetHandle: "left-target",
    });

    expect(edge.type).toBe(CANVAS_EDGE_TYPE);
    expect(edge.source).toBe("shape-a");
    expect(edge.target).toBe("shape-b");
    expect(edge.sourceHandle).toBe("right-source");
    expect(edge.targetHandle).toBe("left-target");
    expect(edge.data).toEqual({ label: "" });
  });
});

describe("normalizeCanvasEdge", () => {
  it("returns nodes for valid edges", () => {
    const nodes = [makeNode("a"), makeNode("b")];
    const edge: CanvasEdge = {
      id: "e1",
      type: CANVAS_EDGE_TYPE,
      source: "a",
      target: "b",
      sourceHandle: "top",
      targetHandle: "bottom",
      data: { label: "" },
    };

    const normalized = normalizeCanvasEdge(edge, nodes);
    expect(normalized?.sourceNode.id).toBe("a");
    expect(normalized?.targetNode.id).toBe("b");
  });

  it("returns null for orphaned connectors", () => {
    const edge: CanvasEdge = {
      id: "e1",
      type: CANVAS_EDGE_TYPE,
      source: "missing",
      target: "b",
      sourceHandle: "top",
      targetHandle: "bottom",
      data: { label: "" },
    };

    expect(normalizeCanvasEdge(edge, [makeNode("b")])).toBeNull();
  });
});

describe("removeEdgesForDeletedNodes", () => {
  it("removes edges attached to deleted shapes", () => {
    const edges: CanvasEdge[] = [
      {
        id: "e1",
        type: CANVAS_EDGE_TYPE,
        source: "a",
        target: "b",
        data: { label: "" },
      },
      {
        id: "e2",
        type: CANVAS_EDGE_TYPE,
        source: "b",
        target: "c",
        data: { label: "" },
      },
    ];

    const remaining = removeEdgesForDeletedNodes(edges, new Set(["b"]));
    expect(remaining).toHaveLength(0);
  });

  it("creates edge removal changes for deleted nodes", () => {
    const edges: CanvasEdge[] = [
      {
        id: "e1",
        type: CANVAS_EDGE_TYPE,
        source: "a",
        target: "b",
        data: { label: "" },
      },
    ];

    const changes = createEdgeRemovalChanges(edges, new Set(["a"]));
    expect(changes).toEqual([{ id: "e1", type: "remove" }]);
  });
});
