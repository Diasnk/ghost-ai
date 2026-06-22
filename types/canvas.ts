import type { Edge, Node } from "@xyflow/react";

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export type NodeShape = (typeof NODE_SHAPES)[number];

export const DEFAULT_NODE_SHAPE: NodeShape = "rectangle";

export const CONNECTION_NODE_POSITIONS = [
  "top",
  "right",
  "bottom",
  "left",
] as const;

export type ConnectionNodePosition =
  (typeof CONNECTION_NODE_POSITIONS)[number];

export function isConnectionNodePosition(
  value: unknown
): value is ConnectionNodePosition {
  return (
    typeof value === "string" &&
    (CONNECTION_NODE_POSITIONS as readonly string[]).includes(value)
  );
}

export function connectionHandleId(
  node: ConnectionNodePosition,
  handleType: "source" | "target"
): string {
  return `${node}-${handleType}`;
}

export function parseConnectionHandleId(
  handleId: string | null | undefined
): ConnectionNodePosition | null {
  if (!handleId) {
    return null;
  }

  if (isConnectionNodePosition(handleId)) {
    return handleId;
  }

  const match = handleId.match(/^(top|right|bottom|left)-(source|target)$/);
  if (match && isConnectionNodePosition(match[1])) {
    return match[1];
  }

  return null;
}

export interface NodeColorPair {
  fill: string;
  text: string;
}

export const NODE_COLORS: NodeColorPair[] = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
];

export const DEFAULT_NODE_COLOR = NODE_COLORS[0];

export function getNodeTextColor(fill: string): string {
  return (
    NODE_COLORS.find((pair) => pair.fill === fill)?.text ??
    DEFAULT_NODE_COLOR.text
  );
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: string;
  shape?: NodeShape;
}

export interface CanvasEdgeData extends Record<string, unknown> {
  label: string;
}

export const CANVAS_NODE_TYPE = "canvasNode" as const;
export const CANVAS_EDGE_TYPE = "canvasEdge" as const;

export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>;
export type CanvasEdge = Edge<CanvasEdgeData, typeof CANVAS_EDGE_TYPE>;
