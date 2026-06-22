import type { Connection, EdgeChange } from "@xyflow/react";

import {
  CANVAS_EDGE_TYPE,
  parseConnectionHandleId,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

export function isValidConnection(connection: Connection): boolean {
  if (!connection.source || !connection.target) {
    return false;
  }

  if (connection.source === connection.target) {
    return false;
  }

  if (
    !parseConnectionHandleId(connection.sourceHandle) ||
    !parseConnectionHandleId(connection.targetHandle)
  ) {
    return false;
  }

  return true;
}

export function createCanvasEdge(connection: Connection): CanvasEdge {
  return {
    id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}-${Date.now()}`,
    type: CANVAS_EDGE_TYPE,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    data: { label: "" },
  };
}

export interface NormalizedCanvasEdge {
  edge: CanvasEdge;
  sourceNode: CanvasNode;
  targetNode: CanvasNode;
}

export function normalizeCanvasEdge(
  edge: CanvasEdge,
  nodes: CanvasNode[]
): NormalizedCanvasEdge | null {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return { edge, sourceNode, targetNode };
}

export function removeEdgesForDeletedNodes(
  edges: CanvasEdge[],
  deletedNodeIds: ReadonlySet<string>
): CanvasEdge[] {
  if (deletedNodeIds.size === 0) {
    return edges;
  }

  return edges.filter(
    (edge) =>
      !deletedNodeIds.has(edge.source) && !deletedNodeIds.has(edge.target)
  );
}

export function createEdgeRemovalChanges(
  edges: CanvasEdge[],
  deletedNodeIds: ReadonlySet<string>
): EdgeChange<CanvasEdge>[] {
  const remaining = removeEdgesForDeletedNodes(edges, deletedNodeIds);
  const remainingIds = new Set(remaining.map((edge) => edge.id));

  return edges
    .filter((edge) => !remainingIds.has(edge.id))
    .map(
      (edge): EdgeChange<CanvasEdge> => ({
        id: edge.id,
        type: "remove",
      })
    );
}
