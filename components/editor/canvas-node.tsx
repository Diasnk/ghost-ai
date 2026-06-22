"use client";

import {
  NodeResizer,
  NodeToolbar,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { useCanvasConnection } from "@/components/editor/canvas-connection-context";
import { CanvasNodeColorToolbar } from "@/components/editor/canvas-node-color-toolbar";
import { CanvasNodeLabel } from "@/components/editor/canvas-node-label";
import { CanvasNodeShape } from "@/components/editor/canvas-node-shape";
import { ConnectionNodes } from "@/components/editor/connection-nodes";
import { getNodeMinDimensions } from "@/lib/canvas-shape-defaults";
import { resolveNodeShape } from "@/lib/resolve-node-shape";
import { getNodeTextColor, type CanvasNode } from "@/types/canvas";

export function CanvasNode({
  id,
  data,
  width,
  height,
  selected,
}: NodeProps<CanvasNode>) {
  const shape = resolveNodeShape(data.shape);
  const textColor = getNodeTextColor(data.color);
  const { localSelectedNodeId } = useCanvasConnection();
  const isLocallySelected = localSelectedNodeId === id;
  const { minWidth, minHeight } = getNodeMinDimensions(shape);

  return (
    <div className="group relative overflow-visible" style={{ width, height }}>
      <NodeToolbar
        align="center"
        isVisible={isLocallySelected}
        offset={10}
        position={Position.Top}
      >
        <CanvasNodeColorToolbar activeFill={data.color} nodeId={id} />
      </NodeToolbar>
      <NodeResizer
        color="var(--border-subtle)"
        handleClassName="border border-surface-border-subtle bg-elevated rounded-sm"
        isVisible={isLocallySelected}
        lineClassName="border-surface-border-subtle"
        minHeight={minHeight}
        minWidth={minWidth}
        nodeId={id}
      />
      <CanvasNodeShape fill={data.color} selected={selected} shape={shape} />
      <CanvasNodeLabel label={data.label} nodeId={id} textColor={textColor} />
      <ConnectionNodes
        height={height}
        nodeId={id}
        shape={shape}
        width={width}
      />
    </div>
  );
}
