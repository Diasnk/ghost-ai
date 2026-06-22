import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { NodeShape } from "@/types/canvas";

const SVG_STROKE_WIDTH = 1.5;

interface CanvasNodeShapeProps {
  shape: NodeShape;
  fill: string;
  selected?: boolean;
}

interface ShapeProps {
  fill: string;
  selected?: boolean;
}

function borderClass(selected?: boolean) {
  return selected ? "border-copy-muted" : "border-surface-border-subtle";
}

function svgStroke(selected?: boolean) {
  return selected ? "var(--text-muted)" : "var(--border-subtle)";
}

function SvgShapeFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 100 100"
    >
      {children}
    </svg>
  );
}

function RectangleShape({ fill, selected }: ShapeProps) {
  return (
    <div
      className={cn("absolute inset-0 rounded-xl border", borderClass(selected))}
      style={{ backgroundColor: fill }}
    />
  );
}

function CircleShape({ fill, selected }: ShapeProps) {
  return (
    <div
      className={cn("absolute inset-0 border", borderClass(selected))}
      style={{ backgroundColor: fill, borderRadius: "50%" }}
    />
  );
}

function PillShape({ fill, selected }: ShapeProps) {
  return (
    <div
      className={cn("absolute inset-0 border", borderClass(selected))}
      style={{ backgroundColor: fill, borderRadius: "9999px" }}
    />
  );
}

function DiamondShape({ fill, selected }: ShapeProps) {
  const stroke = svgStroke(selected);

  return (
    <SvgShapeFrame>
      <polygon
        fill={fill}
        points="50,4 96,50 50,96 4,50"
        stroke={stroke}
        strokeLinejoin="round"
        strokeWidth={SVG_STROKE_WIDTH}
      />
    </SvgShapeFrame>
  );
}

function CylinderShape({ fill, selected }: ShapeProps) {
  const stroke = svgStroke(selected);

  return (
    <SvgShapeFrame>
      <ellipse
        cx="50"
        cy="18"
        fill={fill}
        rx="38"
        ry="12"
        stroke={stroke}
        strokeWidth={SVG_STROKE_WIDTH}
      />
      <path
        d="M12 18 L12 72 A38 12 0 0 0 88 72 L88 18"
        fill={fill}
        stroke={stroke}
        strokeLinejoin="round"
        strokeWidth={SVG_STROKE_WIDTH}
      />
      <path
        d="M12 72 A38 12 0 0 0 88 72"
        fill="none"
        stroke={stroke}
        strokeWidth={SVG_STROKE_WIDTH}
      />
    </SvgShapeFrame>
  );
}

function HexagonShape({ fill, selected }: ShapeProps) {
  const stroke = svgStroke(selected);

  return (
    <SvgShapeFrame>
      <polygon
        fill={fill}
        points="25,8 75,8 98,50 75,92 25,92 2,50"
        stroke={stroke}
        strokeLinejoin="round"
        strokeWidth={SVG_STROKE_WIDTH}
      />
    </SvgShapeFrame>
  );
}

const SHAPE_RENDERERS: Record<NodeShape, (props: ShapeProps) => ReactNode> = {
  rectangle: RectangleShape,
  circle: CircleShape,
  pill: PillShape,
  diamond: DiamondShape,
  cylinder: CylinderShape,
  hexagon: HexagonShape,
};

export function CanvasNodeShape({
  shape,
  fill,
  selected,
}: CanvasNodeShapeProps) {
  const Renderer = SHAPE_RENDERERS[shape];
  return <Renderer fill={fill} selected={selected} />;
}
