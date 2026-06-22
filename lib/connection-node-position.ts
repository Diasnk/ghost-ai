import type { ConnectionNodePosition, NodeShape } from "@/types/canvas";

export interface Point2D {
  x: number;
  y: number;
}

function scaleViewBoxPoint(
  viewX: number,
  viewY: number,
  width: number,
  height: number
): Point2D {
  return {
    x: (viewX / 100) * width,
    y: (viewY / 100) * height,
  };
}

function rectangleOffset(
  width: number,
  height: number,
  node: ConnectionNodePosition
): Point2D {
  switch (node) {
    case "top":
      return { x: width / 2, y: 0 };
    case "right":
      return { x: width, y: height / 2 };
    case "bottom":
      return { x: width / 2, y: height };
    case "left":
      return { x: 0, y: height / 2 };
  }
}

function circleOffset(
  width: number,
  height: number,
  node: ConnectionNodePosition
): Point2D {
  const rx = width / 2;
  const ry = height / 2;
  const cx = rx;
  const cy = ry;

  switch (node) {
    case "top":
      return { x: cx, y: cy - ry };
    case "right":
      return { x: cx + rx, y: cy };
    case "bottom":
      return { x: cx, y: cy + ry };
    case "left":
      return { x: cx - rx, y: cy };
  }
}

function diamondOffset(
  width: number,
  height: number,
  node: ConnectionNodePosition
): Point2D {
  const vertices: Record<ConnectionNodePosition, Point2D> = {
    top: scaleViewBoxPoint(50, 4, width, height),
    right: scaleViewBoxPoint(96, 50, width, height),
    bottom: scaleViewBoxPoint(50, 96, width, height),
    left: scaleViewBoxPoint(4, 50, width, height),
  };
  return vertices[node];
}

function hexagonOffset(
  width: number,
  height: number,
  node: ConnectionNodePosition
): Point2D {
  const points: Record<ConnectionNodePosition, Point2D> = {
    top: scaleViewBoxPoint(50, 8, width, height),
    right: scaleViewBoxPoint(98, 50, width, height),
    bottom: scaleViewBoxPoint(50, 92, width, height),
    left: scaleViewBoxPoint(2, 50, width, height),
  };
  return points[node];
}

function cylinderOffset(
  width: number,
  height: number,
  node: ConnectionNodePosition
): Point2D {
  const points: Record<ConnectionNodePosition, Point2D> = {
    top: scaleViewBoxPoint(50, 18, width, height),
    right: scaleViewBoxPoint(88, 45, width, height),
    bottom: scaleViewBoxPoint(50, 84, width, height),
    left: scaleViewBoxPoint(12, 45, width, height),
  };
  return points[node];
}

const SHAPE_OFFSET_RESOLVERS: Record<
  NodeShape,
  (width: number, height: number, node: ConnectionNodePosition) => Point2D
> = {
  rectangle: rectangleOffset,
  pill: rectangleOffset,
  circle: circleOffset,
  diamond: diamondOffset,
  hexagon: hexagonOffset,
  cylinder: cylinderOffset,
};

export function getConnectionNodeOffset(
  shape: NodeShape,
  width: number,
  height: number,
  node: ConnectionNodePosition
): Point2D {
  if (width <= 0 || height <= 0) {
    return rectangleOffset(width, height, node);
  }

  return SHAPE_OFFSET_RESOLVERS[shape](width, height, node);
}

export function getConnectionNodeFlowPosition(
  nodePosition: { x: number; y: number },
  shape: NodeShape,
  width: number,
  height: number,
  connectionNode: ConnectionNodePosition
): Point2D {
  const offset = getConnectionNodeOffset(shape, width, height, connectionNode);
  return {
    x: nodePosition.x + offset.x,
    y: nodePosition.y + offset.y,
  };
}

export function inferConnectionNodePosition(
  shape: NodeShape,
  width: number,
  height: number,
  point: Point2D,
  nodePosition: { x: number; y: number }
): ConnectionNodePosition {
  const localX = point.x - nodePosition.x;
  const localY = point.y - nodePosition.y;

  const sides: ConnectionNodePosition[] = ["top", "right", "bottom", "left"];
  let nearest: ConnectionNodePosition = "top";
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const side of sides) {
    const offset = getConnectionNodeOffset(shape, width, height, side);
    const dx = localX - offset.x;
    const dy = localY - offset.y;
    const distance = dx * dx + dy * dy;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = side;
    }
  }

  return nearest;
}
