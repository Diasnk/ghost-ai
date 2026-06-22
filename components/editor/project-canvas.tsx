"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";

import { CanvasNode } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import { generateCanvasNodeId } from "@/lib/canvas-node-id";
import {
  parseShapeDragPayload,
  SHAPE_DRAG_MIME,
} from "@/lib/canvas-shape-defaults";
import {
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  type CanvasEdge,
  type CanvasNode as CanvasNodeType,
} from "@/types/canvas";

import "@xyflow/react/dist/style.css";

function ProjectCanvasFlow() {
  const nodeIdCounter = useRef(0);
  const { screenToFlowPosition, addNodes } = useReactFlow<CanvasNodeType>();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNodeType, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const nodeTypes = useMemo(
    () => ({
      [CANVAS_NODE_TYPE]: CanvasNode,
    }),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const payload = parseShapeDragPayload(
        event.dataTransfer.getData(SHAPE_DRAG_MIME)
      );
      if (!payload) {
        return;
      }

      nodeIdCounter.current += 1;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNodes({
        id: generateCanvasNodeId(payload.shape, nodeIdCounter.current),
        type: CANVAS_NODE_TYPE,
        position,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.fill,
          shape: payload.shape,
        },
        width: payload.width,
        height: payload.height,
      });
    },
    [addNodes, screenToFlowPosition]
  );

  return (
    <ReactFlow
      colorMode="dark"
      connectionMode={ConnectionMode.Loose}
      edges={edges}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onDelete={onDelete}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Panel position="bottom-center">
        <ShapePanel className="mb-4" />
      </Panel>
    </ReactFlow>
  );
}

export function ProjectCanvas() {
  return (
    <div className="relative h-full w-full bg-base">
      <ReactFlowProvider>
        <ProjectCanvasFlow />
      </ReactFlowProvider>
    </div>
  );
}
