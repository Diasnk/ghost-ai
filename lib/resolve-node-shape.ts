import {
  DEFAULT_NODE_SHAPE,
  NODE_SHAPES,
  type NodeShape,
} from "@/types/canvas";

export function resolveNodeShape(shape: unknown): NodeShape {
  if (
    typeof shape === "string" &&
    (NODE_SHAPES as readonly string[]).includes(shape)
  ) {
    return shape as NodeShape;
  }

  return DEFAULT_NODE_SHAPE;
}
