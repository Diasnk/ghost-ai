import { describe, expect, it } from "vitest";

import { createTemplateReplaceChanges } from "@/lib/canvas-template-import";
import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

function makeNode(id: string): CanvasNode {
  return {
    id,
    type: CANVAS_NODE_TYPE,
    position: { x: 0, y: 0 },
    data: { label: id, color: "#1F1F1F", shape: "rectangle" },
    width: 160,
    height: 80,
  };
}

function makeEdge(id: string, source: string, target: string): CanvasEdge {
  return {
    id,
    type: CANVAS_EDGE_TYPE,
    source,
    target,
    sourceHandle: "right-source",
    targetHandle: "left-target",
    data: { label: "" },
  };
}

describe("createTemplateReplaceChanges", () => {
  it("returns only adds when the canvas is empty", () => {
    const templateNodes = [makeNode("t1"), makeNode("t2")];
    const templateEdges = [makeEdge("te1", "t1", "t2")];

    const result = createTemplateReplaceChanges(
      [],
      [],
      templateNodes,
      templateEdges
    );

    expect(result.edgeRemovals).toEqual([]);
    expect(result.nodeRemovals).toEqual([]);
    expect(result.nodeAdds).toHaveLength(2);
    expect(result.edgeAdds).toHaveLength(1);
    expect(result.nodeAdds[0]).toMatchObject({ type: "add", item: templateNodes[0] });
    expect(result.edgeAdds[0]).toMatchObject({ type: "add", item: templateEdges[0] });
  });

  it("returns separate removal and add phases for a populated canvas", () => {
    const currentNodes = [makeNode("n1")];
    const currentEdges = [makeEdge("e1", "n1", "n1")];
    const templateNodes = [makeNode("t1")];
    const templateEdges = [makeEdge("te1", "t1", "t1")];

    const result = createTemplateReplaceChanges(
      currentNodes,
      currentEdges,
      templateNodes,
      templateEdges
    );

    expect(result.edgeRemovals).toEqual([{ id: "e1", type: "remove" }]);
    expect(result.nodeRemovals).toEqual([{ id: "n1", type: "remove" }]);
    expect(result.nodeAdds).toEqual([{ type: "add", item: templateNodes[0] }]);
    expect(result.edgeAdds).toEqual([{ type: "add", item: templateEdges[0] }]);
  });
});
