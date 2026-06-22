import type { NodeShape } from "@/types/canvas";

export function generateCanvasNodeId(shape: NodeShape, counter: number): string {
  return `${shape}-${Date.now()}-${counter}`;
}
