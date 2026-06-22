"use client";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { NODE_COLORS, type CanvasNode } from "@/types/canvas";

const COLOR_NAMES = [
  "neutral",
  "blue",
  "purple",
  "orange",
  "red",
  "pink",
  "green",
  "teal",
] as const;

interface CanvasNodeColorToolbarProps {
  nodeId: string;
  activeFill: string;
}

export function CanvasNodeColorToolbar({
  nodeId,
  activeFill,
}: CanvasNodeColorToolbarProps) {
  const { updateNode } = useReactFlow<CanvasNode>();

  const handleColorSelect = useCallback(
    (fill: string) => {
      updateNode(nodeId, (node) => ({
        ...node,
        data: { ...node.data, color: fill },
      }));
    },
    [nodeId, updateNode]
  );

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <div
      className="nodrag nopan nowheel flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 p-1 shadow-2xl backdrop-blur"
      onPointerDown={handlePointerDown}
    >
      {NODE_COLORS.map((pair, index) => {
        const isActive = activeFill === pair.fill;

        return (
          <button
            key={pair.fill}
            aria-label={`Set node color ${COLOR_NAMES[index]}`}
            aria-pressed={isActive}
            className={cn(
              "nodrag nopan nowheel h-5 w-5 shrink-0 rounded-full border border-surface-border-subtle transition-[box-shadow,transform]",
              isActive
                ? "ring-2 ring-copy-primary ring-offset-1 ring-offset-surface"
                : "hover:scale-105"
            )}
            style={{
              backgroundColor: pair.fill,
            }}
            type="button"
            onClick={() => handleColorSelect(pair.fill)}
            onPointerDown={handlePointerDown}
            onMouseEnter={(event) => {
              if (!isActive) {
                event.currentTarget.style.boxShadow = `0 0 0 2px color-mix(in srgb, ${pair.text} 55%, transparent)`;
              }
            }}
            onMouseLeave={(event) => {
              if (!isActive) {
                event.currentTarget.style.boxShadow = "";
              }
            }}
          />
        );
      })}
    </div>
  );
}
