"use client";

import { useCallback, useEffect } from "react";
import {
  shallow,
  useOther,
  useOthersConnectionIds,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import {
  useReactFlow,
  useStore,
  useStoreApi,
  ViewportPortal,
} from "@xyflow/react";

// Pointer tip in the SVG path sits at (1, 1) in the 16×16 viewBox.
const CURSOR_TIP_OFFSET = 1;

interface CollaboratorCursorProps {
  connectionId: number;
}

function CollaboratorCursor({ connectionId }: CollaboratorCursorProps) {
  const { cursor, color, name } = useOther(
    connectionId,
    (other) => ({
      color: other.info.color,
      cursor: other.presence.cursor,
      name: other.info.name,
    }),
    shallow
  );

  if (!cursor) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-1000"
      style={{
        transform: `translate(${cursor.x}px, ${cursor.y}px)`,
      }}
    >
      <svg
        aria-hidden
        fill="none"
        height="16"
        style={{
          transform: `translate(-${CURSOR_TIP_OFFSET}px, -${CURSOR_TIP_OFFSET}px)`,
        }}
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          d="M1 1L1 13.5L4.5 10L7.5 15.5L9.5 14.5L6.5 9L11.5 8.5L1 1Z"
          fill={color}
          stroke="var(--bg-base)"
          strokeLinejoin="round"
          strokeWidth="1.25"
        />
      </svg>
      <div
        className="absolute left-3 top-3 max-w-[140px] truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  );
}

function useBroadcastCursorPresence() {
  const reactFlow = useReactFlow();
  const reactFlowStoreApi = useStoreApi();
  const reactFlowDomNode = useStore((state) => state.domNode);
  const updateMyPresence = useUpdateMyPresence();

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (reactFlowStoreApi.getState().paneDragging) {
        return;
      }

      updateMyPresence({
        cursor: reactFlow.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        }),
      });
    },
    [reactFlow, reactFlowStoreApi, updateMyPresence]
  );

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useEffect(() => {
    if (!reactFlowDomNode) {
      return;
    }

    reactFlowDomNode.addEventListener("pointermove", handlePointerMove);
    reactFlowDomNode.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      reactFlowDomNode.removeEventListener("pointermove", handlePointerMove);
      reactFlowDomNode.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      handlePointerLeave();
    };
  }, [handlePointerLeave, handlePointerMove, reactFlowDomNode]);
}

export function CanvasLiveCursors() {
  useBroadcastCursorPresence();

  const connectionIds = useOthersConnectionIds();

  return (
    <ViewportPortal>
      {connectionIds.map((connectionId) => (
        <CollaboratorCursor connectionId={connectionId} key={connectionId} />
      ))}
    </ViewportPortal>
  );
}
