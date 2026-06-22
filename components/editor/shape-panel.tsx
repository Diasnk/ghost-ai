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
  SHAPE_DRAG_MIME,
  serializeShapeDragPayload,
} from "@/lib/canvas-shape-defaults";
import { cn } from "@/lib/utils";
import { NODE_SHAPES, type NodeShape } from "@/types/canvas";

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
}

export function ShapePanel({ className }: ShapePanelProps) {
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
            onDragStart={(event) => {
              const payload = getShapeDefaults(shape);
              event.dataTransfer.setData(
                SHAPE_DRAG_MIME,
                serializeShapeDragPayload(payload)
              );
              event.dataTransfer.effectAllowed = "move";
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
