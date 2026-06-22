"use client";

import { Handle, Position, useStore } from "@xyflow/react";

import { useCanvasConnection } from "@/components/editor/canvas-connection-context";
import { getConnectionNodeOffset } from "@/lib/connection-node-position";
import { cn } from "@/lib/utils";
import {
  CONNECTION_NODE_POSITIONS,
  connectionHandleId,
  type ConnectionNodePosition,
  type NodeShape,
} from "@/types/canvas";

const HANDLE_SIZE_PX = 10;
const HIT_SIZE_PX = 24;

const POSITION_MAP: Record<ConnectionNodePosition, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

const LABELS: Record<ConnectionNodePosition, string> = {
  top: "Connect from top",
  right: "Connect from right",
  bottom: "Connect from bottom",
  left: "Connect from left",
};

interface ConnectionNodesProps {
  nodeId: string;
  shape: NodeShape;
  width?: number;
  height?: number;
}

function ConnectionHandle({
  shape,
  width,
  height,
  connectionNode,
  zoom,
  forceVisible,
  isSourceNode,
  isValidTarget,
}: {
  shape: NodeShape;
  width: number;
  height: number;
  connectionNode: ConnectionNodePosition;
  zoom: number;
  forceVisible: boolean;
  isSourceNode: boolean;
  isValidTarget: boolean;
}) {
  const offset = getConnectionNodeOffset(shape, width, height, connectionNode);
  const scale = 1 / zoom;
  const position = POSITION_MAP[connectionNode];

  const handleStyle = {
    left: offset.x,
    top: offset.y,
    width: HIT_SIZE_PX,
    height: HIT_SIZE_PX,
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: "center center",
  };

  const dotClassName = cn(
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-copy-primary transition-opacity",
    "border-surface-border",
    "hover:border-brand hover:bg-elevated",
    isSourceNode && "border-brand bg-elevated",
    isValidTarget && "border-brand ring-2 ring-brand/40",
    forceVisible
      ? "opacity-100"
      : "opacity-0 group-hover:opacity-100"
  );

  const sourceHandleClassName = cn(
    "border-none! bg-transparent!",
    forceVisible
      ? "pointer-events-auto opacity-100"
      : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
  );

  const targetHandleClassName = cn(
    "border-none! bg-transparent!",
    "pointer-events-none opacity-0"
  );

  return (
    <>
      <Handle
        aria-label={LABELS[connectionNode]}
        className={sourceHandleClassName}
        id={connectionHandleId(connectionNode, "source")}
        position={position}
        style={handleStyle}
        title={LABELS[connectionNode]}
        type="source"
      >
        <span
          aria-hidden
          className={dotClassName}
          style={{ width: HANDLE_SIZE_PX, height: HANDLE_SIZE_PX }}
        />
      </Handle>
      <Handle
        aria-label={`${LABELS[connectionNode]} target`}
        className={targetHandleClassName}
        id={connectionHandleId(connectionNode, "target")}
        position={position}
        style={handleStyle}
        title={LABELS[connectionNode]}
        type="target"
      />
    </>
  );
}

export function ConnectionNodes({
  nodeId,
  shape,
  width = 0,
  height = 0,
}: ConnectionNodesProps) {
  const zoom = useStore((state) => state.transform[2]);
  const {
    isConnecting,
    connectingFromNodeId,
  } = useCanvasConnection();

  const isConnectingFromThis = connectingFromNodeId === nodeId;
  const showAsTarget =
    isConnecting && connectingFromNodeId !== null && !isConnectingFromThis;
  const forceVisible = isConnectingFromThis || showAsTarget;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {CONNECTION_NODE_POSITIONS.map((connectionNode) => (
        <ConnectionHandle
          key={connectionNode}
          connectionNode={connectionNode}
          forceVisible={forceVisible}
          height={height}
          isSourceNode={isConnectingFromThis}
          isValidTarget={showAsTarget}
          shape={shape}
          width={width}
          zoom={zoom > 0 ? zoom : 1}
        />
      ))}
    </div>
  );
}
