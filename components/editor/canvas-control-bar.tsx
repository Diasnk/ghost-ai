"use client";

import { Maximize2, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";

interface CanvasControlBarProps {
  canRedo: boolean;
  canUndo: boolean;
  className?: string;
  onFitView: () => void;
  onRedo: () => void;
  onUndo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function CanvasControlBar({
  canRedo,
  canUndo,
  className,
  onFitView,
  onRedo,
  onUndo,
  onZoomIn,
  onZoomOut,
}: CanvasControlBarProps) {
  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className={cn(
        "nodrag nopan nowheel flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 p-1.5 shadow-2xl backdrop-blur",
        className
      )}
      onPointerDown={handlePointerDown}
    >
      <div className="flex items-center gap-1">
        <button
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center rounded-full text-copy-secondary transition hover:bg-elevated hover:text-copy-primary"
          onClick={onZoomOut}
          type="button"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          aria-label="Fit view"
          className="flex h-9 w-9 items-center justify-center rounded-full text-copy-secondary transition hover:bg-elevated hover:text-copy-primary"
          onClick={onFitView}
          type="button"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center rounded-full text-copy-secondary transition hover:bg-elevated hover:text-copy-primary"
          onClick={onZoomIn}
          type="button"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      <div aria-hidden className="mx-0.5 h-6 w-px bg-surface-border" />

      <div className="flex items-center gap-1">
        <button
          aria-label="Undo"
          className="flex h-9 w-9 items-center justify-center rounded-full text-copy-secondary transition hover:bg-elevated hover:text-copy-primary disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canUndo}
          onClick={onUndo}
          type="button"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          aria-label="Redo"
          className="flex h-9 w-9 items-center justify-center rounded-full text-copy-secondary transition hover:bg-elevated hover:text-copy-primary disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canRedo}
          onClick={onRedo}
          type="button"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
