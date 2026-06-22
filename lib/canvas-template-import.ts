import type { EdgeChange, NodeChange } from "@xyflow/react";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

export function createTemplateReplaceChanges(
  currentNodes: CanvasNode[],
  currentEdges: CanvasEdge[],
  templateNodes: CanvasNode[],
  templateEdges: CanvasEdge[]
): {
  edgeRemovals: EdgeChange<CanvasEdge>[];
  nodeRemovals: NodeChange<CanvasNode>[];
  nodeAdds: NodeChange<CanvasNode>[];
  edgeAdds: EdgeChange<CanvasEdge>[];
} {
  const edgeRemovals: EdgeChange<CanvasEdge>[] = currentEdges.map((edge) => ({
    id: edge.id,
    type: "remove",
  }));

  const nodeRemovals: NodeChange<CanvasNode>[] = currentNodes.map((node) => ({
    id: node.id,
    type: "remove",
  }));

  const nodeAdds: NodeChange<CanvasNode>[] = templateNodes.map((item) => ({
    type: "add",
    item,
  }));

  const edgeAdds: EdgeChange<CanvasEdge>[] = templateEdges.map((item) => ({
    type: "add",
    item,
  }));

  return {
    edgeRemovals,
    nodeRemovals,
    nodeAdds,
    edgeAdds,
  };
}
