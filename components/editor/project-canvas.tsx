"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type NodeChange,
  type OnConnectEnd,
  type OnConnectStart,
  type OnSelectionChangeFunc,
} from "@xyflow/react";
import {
  useCanRedo,
  useCanUndo,
  useRedo,
  useUndo,
} from "@liveblocks/react/suspense";
import { useLiveblocksFlow } from "@liveblocks/react-flow";

import { CanvasControlBar } from "@/components/editor/canvas-control-bar";
import { CanvasLiveCursors } from "@/components/editor/canvas-live-cursors";
import { CanvasPresenceAvatars } from "@/components/editor/canvas-presence-avatars";
import { CanvasEdge as CanvasEdgeComponent } from "@/components/editor/canvas-edge";
import { CanvasConnectionProvider, useCanvasConnection } from "@/components/editor/canvas-connection-context";
import { CanvasNode } from "@/components/editor/canvas-node";
import { ShapeDragPreview } from "@/components/editor/shape-drag-preview";
import { ShapePanel } from "@/components/editor/shape-panel";
import { useStarterTemplates } from "@/components/editor/starter-templates-context";
import type { CanvasTemplate } from "@/components/editor/starter-templates";
import { createTemplateReplaceChanges } from "@/lib/canvas-template-import";
import {
  createEdgeRemovalChanges,
  isValidConnection,
} from "@/lib/canvas-connector";
import { generateCanvasNodeId } from "@/lib/canvas-node-id";
import {
  type ShapeDragPayload,
  parseShapeDragPayload,
  SHAPE_DRAG_MIME,
} from "@/lib/canvas-shape-defaults";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_COLOR,
  type CanvasEdge,
  type CanvasNode as CanvasNodeType,
} from "@/types/canvas";

import "@liveblocks/react-flow/styles.css";
import "@xyflow/react/dist/style.css";

interface DragPreviewState {
  payload: ShapeDragPayload;
  x: number;
  y: number;
}

function ProjectCanvasFlowInner() {
  const nodeIdCounter = useRef(0);
  const [dragPreview, setDragPreview] = useState<DragPreviewState | null>(null);
  const { addNodes, fitView, screenToFlowPosition, zoomIn, zoomOut } =
    useReactFlow<CanvasNodeType>();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const {
    localSelectedNodeId,
    setLocalSelectedNodeId,
    startConnecting,
    stopConnecting,
  } = useCanvasConnection();
  const { registerImportHandler } = useStarterTemplates();
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

  const edgeTypes = useMemo(
    () => ({
      [CANVAS_EDGE_TYPE]: CanvasEdgeComponent,
      default: CanvasEdgeComponent,
    }),
    []
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<CanvasNodeType>[]) => {
      const deletedNodeIds = new Set(
        changes
          .filter((change) => change.type === "remove")
          .map((change) => change.id)
      );

      if (deletedNodeIds.size > 0) {
        const edgeRemovals = createEdgeRemovalChanges(edges, deletedNodeIds);
        if (edgeRemovals.length > 0) {
          onEdgesChange(edgeRemovals);
        }

        if (
          localSelectedNodeId &&
          deletedNodeIds.has(localSelectedNodeId)
        ) {
          setLocalSelectedNodeId(null);
        }
      }

      onNodesChange(changes);
    },
    [
      edges,
      localSelectedNodeId,
      onEdgesChange,
      onNodesChange,
      setLocalSelectedNodeId,
    ]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!isValidConnection(connection)) {
        return;
      }

      onConnect(connection);
    },
    [onConnect]
  );

  const handleSelectionChange: OnSelectionChangeFunc<CanvasNodeType> =
    useCallback(
      ({ nodes: selectedNodes }) => {
        setLocalSelectedNodeId(selectedNodes[0]?.id ?? null);
      },
      [setLocalSelectedNodeId]
    );

  const handleConnectStart: OnConnectStart = useCallback(
    (_event, { nodeId }) => {
      if (nodeId) {
        startConnecting(nodeId);
      }
    },
    [startConnecting]
  );

  const handleConnectEnd: OnConnectEnd = useCallback(() => {
    stopConnecting();
  }, [stopConnecting]);

  const handleShapeDragStart = useCallback(
    (payload: ShapeDragPayload, event: React.DragEvent) => {
      setDragPreview({
        payload,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  const handleShapeDragEnd = useCallback(() => {
    setDragPreview(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (event.dataTransfer.types.includes(SHAPE_DRAG_MIME)) {
      setDragPreview((current) =>
        current
          ? { ...current, x: event.clientX, y: event.clientY }
          : null
      );
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ duration: 200 });
  }, [fitView]);

  const handleImportTemplate = useCallback(
    (template: CanvasTemplate) => {
      setLocalSelectedNodeId(null);

      const { edgeRemovals, nodeRemovals, edgeAdds } =
        createTemplateReplaceChanges(
          nodes,
          edges,
          template.nodes,
          template.edges
        );

      if (edgeRemovals.length > 0) {
        onEdgesChange(edgeRemovals);
      }

      if (nodeRemovals.length > 0) {
        onNodesChange(nodeRemovals);
      }

      addNodes(template.nodes);

      requestAnimationFrame(() => {
        if (edgeAdds.length > 0) {
          onEdgesChange(edgeAdds);
        }

        requestAnimationFrame(() => {
          fitView({ duration: 200 });
        });
      });
    },
    [
      addNodes,
      edges,
      fitView,
      nodes,
      onEdgesChange,
      onNodesChange,
      setLocalSelectedNodeId,
    ]
  );

  useEffect(() => {
    registerImportHandler(handleImportTemplate);

    return () => {
      registerImportHandler(null);
    };
  }, [handleImportTemplate, registerImportHandler]);

  useKeyboardShortcuts({
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    undo,
    redo,
  });

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

      setDragPreview(null);
    },
    [addNodes, screenToFlowPosition]
  );

  return (
    <>
      {dragPreview ? (
        <ShapeDragPreview
          payload={dragPreview.payload}
          x={dragPreview.x}
          y={dragPreview.y}
        />
      ) : null}
      <ReactFlow
        colorMode="dark"
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: "var(--text-primary)",
          strokeWidth: 1.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={{ type: CANVAS_EDGE_TYPE }}
        edgeTypes={edgeTypes}
        edges={edges}
        fitView
        nodes={nodes}
        nodeTypes={nodeTypes}
        onConnect={handleConnect}
        onConnectEnd={handleConnectEnd}
        onConnectStart={handleConnectStart}
        onDelete={onDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onEdgesChange={onEdgesChange}
        onNodesChange={handleNodesChange}
        onSelectionChange={handleSelectionChange}
      >
        <Background variant={BackgroundVariant.Dots} />
        <CanvasLiveCursors />
        <Panel position="bottom-left">
          <CanvasControlBar
            canRedo={canRedo}
            canUndo={canUndo}
            className="mb-4 ml-4"
            onFitView={handleFitView}
            onRedo={redo}
            onUndo={undo}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </Panel>
        <Panel position="bottom-center">
          <ShapePanel
            className="mb-4"
            onShapeDragEnd={handleShapeDragEnd}
            onShapeDragStart={handleShapeDragStart}
          />
        </Panel>
        <Panel position="top-right">
          <CanvasPresenceAvatars className="mr-4 mt-4" />
        </Panel>
      </ReactFlow>
    </>
  );
}

function ProjectCanvasFlow() {
  return (
    <CanvasConnectionProvider>
      <ProjectCanvasFlowInner />
    </CanvasConnectionProvider>
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
