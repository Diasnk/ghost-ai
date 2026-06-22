"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReactFlow } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { type CanvasNode } from "@/types/canvas";

const PLACEHOLDER = "Add label…";

interface CanvasNodeLabelProps {
  nodeId: string;
  label: string;
  textColor: string;
}

export function CanvasNodeLabel({
  nodeId,
  label,
  textColor,
}: CanvasNodeLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNode } = useReactFlow<CanvasNode>();

  const handleLabelChange = useCallback(
    (value: string) => {
      updateNode(nodeId, (node) => ({
        ...node,
        data: { ...node.data, label: value },
      }));
    },
    [nodeId, updateNode]
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

    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.select();
  }, [isEditing]);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      startEditing();
    },
    [startEditing]
  );

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (isEditing) {
      event.stopPropagation();
    }
  }, [isEditing]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        stopEditing();
      }
    },
    [stopEditing]
  );

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center px-3 py-2 text-sm",
        isEditing ? "z-20" : "z-0"
      )}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="nodrag nopan nowheel field-sizing-content max-h-full w-full resize-none overflow-hidden border-none bg-transparent p-0 text-center text-sm outline-none"
          rows={1}
          style={{ color: textColor }}
          value={label}
          onBlur={stopEditing}
          onChange={(event) => handleLabelChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : label ? (
        <span
          className="truncate text-center"
          style={{ color: textColor }}
        >
          {label}
        </span>
      ) : (
        <span className="truncate text-center text-copy-muted">{PLACEHOLDER}</span>
      )}
    </div>
  );
}
