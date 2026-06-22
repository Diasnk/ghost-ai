"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Position,
  useStore,
  type EdgeProps,
} from "@xyflow/react";
import { useId, useMemo, useState } from "react";

import { CanvasEdgeLabel } from "@/components/editor/canvas-edge-label";
import { normalizeCanvasEdge } from "@/lib/canvas-connector";
import { getConnectionNodeOffset } from "@/lib/connection-node-position";
import { resolveNodeShape } from "@/lib/resolve-node-shape";
import {
  CANVAS_EDGE_TYPE,
  parseConnectionHandleId,
  type CanvasEdge,
  type CanvasNode,
} from "@/types/canvas";

const VISIBLE_STROKE_WIDTH = 1.5;
const INTERACTION_STROKE_WIDTH = 18;
const REST_OPACITY = 0.45;
const ACTIVE_OPACITY = 1;

function positionFromSide(
  side: ReturnType<typeof parseConnectionHandleId>
): Position {
  switch (side) {
    case "top":
      return Position.Top;
    case "right":
      return Position.Right;
    case "bottom":
      return Position.Bottom;
    case "left":
      return Position.Left;
    default:
      return Position.Top;
  }
}

function getNodeDimensions(node: CanvasNode): { width: number; height: number } {
  return {
    width: node.width ?? node.measured?.width ?? 0,
    height: node.height ?? node.measured?.height ?? 0,
  };
}

export function CanvasEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  selected,
  style,
  data,
}: EdgeProps<CanvasEdge>) {
  const markerId = useId().replace(/:/g, "");
  const [isHovered, setIsHovered] = useState(false);
  const nodes = useStore((state) => state.nodes) as CanvasNode[];

  const canvasEdge: CanvasEdge = useMemo(
    () => ({
      id,
      type: CANVAS_EDGE_TYPE,
      source,
      target,
      sourceHandle: sourceHandleId,
      targetHandle: targetHandleId,
      data: data ?? { label: "" },
    }),
    [data, id, source, sourceHandleId, target, targetHandleId]
  );

  const normalized = useMemo(
    () => normalizeCanvasEdge(canvasEdge, nodes),
    [canvasEdge, nodes]
  );

  const pathResult = useMemo(() => {
    if (!normalized) {
      return null;
    }

    const { sourceNode, targetNode } = normalized;
    let resolvedSourceX = sourceX;
    let resolvedSourceY = sourceY;
    let resolvedTargetX = targetX;
    let resolvedTargetY = targetY;
    let resolvedSourcePosition = sourcePosition ?? Position.Top;
    let resolvedTargetPosition = targetPosition ?? Position.Top;

    const sourceSide = parseConnectionHandleId(sourceHandleId);
    if (sourceSide) {
      const shape = resolveNodeShape(sourceNode.data.shape);
      const { width, height } = getNodeDimensions(sourceNode);
      if (width > 0 && height > 0) {
        const offset = getConnectionNodeOffset(
          shape,
          width,
          height,
          sourceSide
        );
        resolvedSourceX = sourceNode.position.x + offset.x;
        resolvedSourceY = sourceNode.position.y + offset.y;
        resolvedSourcePosition = positionFromSide(sourceSide);
      }
    }

    const targetSide = parseConnectionHandleId(targetHandleId);
    if (targetSide) {
      const shape = resolveNodeShape(targetNode.data.shape);
      const { width, height } = getNodeDimensions(targetNode);
      if (width > 0 && height > 0) {
        const offset = getConnectionNodeOffset(
          shape,
          width,
          height,
          targetSide
        );
        resolvedTargetX = targetNode.position.x + offset.x;
        resolvedTargetY = targetNode.position.y + offset.y;
        resolvedTargetPosition = positionFromSide(targetSide);
      }
    }

    return getSmoothStepPath({
      sourceX: resolvedSourceX,
      sourceY: resolvedSourceY,
      targetX: resolvedTargetX,
      targetY: resolvedTargetY,
      sourcePosition: resolvedSourcePosition,
      targetPosition: resolvedTargetPosition,
    });
  }, [
    normalized,
    sourceHandleId,
    sourcePosition,
    sourceX,
    sourceY,
    targetHandleId,
    targetPosition,
    targetX,
    targetY,
  ]);

  if (!normalized || !pathResult) {
    return null;
  }

  const [path, labelX, labelY] = pathResult;
  const isActive = selected || isHovered;
  const strokeOpacity = isActive ? ACTIVE_OPACITY : REST_OPACITY;
  const label = canvasEdge.data?.label ?? "";

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerHeight={6}
          markerUnits="userSpaceOnUse"
          markerWidth={6}
          orient="auto"
          refX={7}
          refY={5}
          viewBox="0 0 10 10"
        >
          <path d="M 0 5 L 7 2 L 7 8 Z" fill="var(--text-primary)" />
        </marker>
      </defs>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseEdge
          id={`${id}-interaction`}
          path={path}
          style={{
            stroke: "transparent",
            strokeWidth: INTERACTION_STROKE_WIDTH,
            pointerEvents: "stroke",
            fill: "none",
            ...style,
          }}
        />
        <BaseEdge
          id={id}
          markerEnd={`url(#${markerId})`}
          path={path}
          style={{
            stroke: "var(--text-primary)",
            strokeWidth: VISIBLE_STROKE_WIDTH,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: strokeOpacity,
            pointerEvents: "none",
            fill: "none",
            ...style,
          }}
        />
      </g>
      <EdgeLabelRenderer>
        <div
          className="pointer-events-none absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <CanvasEdgeLabel edgeId={id} label={label} selected={!!selected} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
