"use client";

import { CanvasNodeShape } from "@/components/editor/canvas-node-shape";
import type { ShapeDragPayload } from "@/lib/canvas-shape-defaults";
import { DEFAULT_NODE_COLOR } from "@/types/canvas";

interface ShapeDragPreviewProps {
  payload: ShapeDragPayload;
  x: number;
  y: number;
}

export function ShapeDragPreview({ payload, x, y }: ShapeDragPreviewProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-50 opacity-70"
      style={{
        left: x,
        top: y,
        width: payload.width,
        height: payload.height,
      }}
    >
      <CanvasNodeShape
        fill={DEFAULT_NODE_COLOR.fill}
        shape={payload.shape}
      />
    </div>
  );
}
