"use client";

import { type NodeProps } from "@xyflow/react";

import { CanvasNodeShape } from "@/components/editor/canvas-node-shape";
import { resolveNodeShape } from "@/lib/resolve-node-shape";
import {
  DEFAULT_NODE_COLOR,
  NODE_COLORS,
  type CanvasNode,
} from "@/types/canvas";

function getTextColor(fill: string): string {
  return (
    NODE_COLORS.find((pair) => pair.fill === fill)?.text ??
    DEFAULT_NODE_COLOR.text
  );
}

export function CanvasNode({ data, width, height }: NodeProps<CanvasNode>) {
  const shape = resolveNodeShape(data.shape);
  const textColor = getTextColor(data.color);

  return (
    <div className="relative" style={{ width, height }}>
      <CanvasNodeShape fill={data.color} shape={shape} />
      <div
        className="absolute inset-0 flex items-center justify-center px-3 py-2 text-sm"
        style={{ color: textColor }}
      >
        <span className="truncate text-center">{data.label}</span>
      </div>
    </div>
  );
}
