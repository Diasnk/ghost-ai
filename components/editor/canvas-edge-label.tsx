"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReactFlow } from "@xyflow/react";

import { cn } from "@/lib/utils";

const PLACEHOLDER = "Add label…";

interface CanvasEdgeLabelProps {
  edgeId: string;
  label: string;
  selected: boolean;
}

export function CanvasEdgeLabel({
  edgeId,
  label,
  selected,
}: CanvasEdgeLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateEdge } = useReactFlow();

  const handleLabelChange = useCallback(
    (value: string) => {
      updateEdge(edgeId, (edge) => ({
        ...edge,
        data: { ...edge.data, label: value },
      }));
    },
    [edgeId, updateEdge]
  );

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.focus();
    input.select();
  }, [isEditing]);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      startEditing();
    },
    [startEditing]
  );

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        stopEditing();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        stopEditing();
      }
    },
    [stopEditing]
  );

  const showHint = selected && !label && !isEditing;

  return (
    <div
      className="nodrag nopan nowheel pointer-events-auto"
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="field-sizing-content max-w-48 rounded-full border border-surface-border-subtle bg-elevated px-2 py-0.5 text-center text-xs text-copy-primary outline-none"
          value={label}
          onBlur={stopEditing}
          onChange={(event) => handleLabelChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : label ? (
        <span className="inline-block rounded-full border border-surface-border-subtle bg-elevated px-2 py-0.5 text-xs text-copy-primary">
          {label}
        </span>
      ) : showHint ? (
        <span className="inline-block rounded-full border border-transparent px-2 py-0.5 text-xs text-copy-faint">
          {PLACEHOLDER}
        </span>
      ) : null}
    </div>
  );
}
