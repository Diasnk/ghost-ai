import { NODE_SHAPES, type NodeShape } from "@/types/canvas";

export const SHAPE_DRAG_MIME = "application/ghostai-shape";

export interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

const SHAPE_DEFAULTS: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 160, height: 80 },
  circle: { width: 120, height: 80 },
  diamond: { width: 140, height: 100 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 120, height: 80 },
  hexagon: { width: 120, height: 100 },
};

export function getShapeDefaults(shape: NodeShape): ShapeDragPayload {
  const { width, height } = SHAPE_DEFAULTS[shape];
  return { shape, width, height };
}

export function getNodeMinDimensions(shape: NodeShape): {
  minWidth: number;
  minHeight: number;
} {
  const { width, height } = SHAPE_DEFAULTS[shape];
  return {
    minWidth: Math.floor(width / 2),
    minHeight: Math.floor(height / 2),
  };
}

export function serializeShapeDragPayload(payload: ShapeDragPayload): string {
  return JSON.stringify(payload);
}

function isNodeShape(value: unknown): value is NodeShape {
  return (
    typeof value === "string" &&
    (NODE_SHAPES as readonly string[]).includes(value)
  );
}

export function parseShapeDragPayload(raw: string): ShapeDragPayload | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("shape" in parsed) ||
      !("width" in parsed) ||
      !("height" in parsed)
    ) {
      return null;
    }

    const { shape, width, height } = parsed as Record<string, unknown>;

    if (
      !isNodeShape(shape) ||
      typeof width !== "number" ||
      typeof height !== "number" ||
      !isFinite(width) ||
      !isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return null;
    }

    return { shape, width, height };
  } catch {
    return null;
  }
}
