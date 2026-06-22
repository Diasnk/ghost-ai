"use client";

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  Square,
  type LucideIcon,
} from "lucide-react";

import {
  getShapeDefaults,
  type ShapeDragPayload,
  SHAPE_DRAG_MIME,
  serializeShapeDragPayload,
} from "@/lib/canvas-shape-defaults";
import { cn } from "@/lib/utils";
import { NODE_SHAPES, type NodeShape } from "@/types/canvas";

const BLANK_DRAG_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const SHAPE_ICONS: Record<NodeShape, LucideIcon> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
};

interface ShapePanelProps {
  className?: string;
  onShapeDragStart?: (payload: ShapeDragPayload, event: React.DragEvent) => void;
  onShapeDragEnd?: () => void;
}

export function ShapePanel({
  className,
  onShapeDragStart,
  onShapeDragEnd,
}: ShapePanelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 p-1.5 shadow-2xl backdrop-blur",
        className
      )}
    >
      {NODE_SHAPES.map((shape) => {
        const Icon = SHAPE_ICONS[shape];

        return (
          <button
            key={shape}
            aria-label={`Add ${shape}`}
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full text-copy-secondary transition hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
            draggable
            onDragEnd={() => {
              onShapeDragEnd?.();
            }}
            onDragStart={(event) => {
              const payload = getShapeDefaults(shape);
              event.dataTransfer.setData(
                SHAPE_DRAG_MIME,
                serializeShapeDragPayload(payload)
              );
              event.dataTransfer.effectAllowed = "move";

              const blank = new Image();
              blank.src = BLANK_DRAG_IMAGE;
              event.dataTransfer.setDragImage(blank, 0, 0);

              onShapeDragStart?.(payload, event);
            }}
            type="button"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
