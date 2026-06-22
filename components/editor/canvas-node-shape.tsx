import type { ReactNode } from "react";

import type { NodeShape } from "@/types/canvas";

const SVG_STROKE = "var(--border-subtle)";
const SVG_STROKE_WIDTH = 1.5;

interface CanvasNodeShapeProps {
  shape: NodeShape;
  fill: string;
}

interface SvgShapeProps {
  fill: string;
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

function RectangleShape({ fill }: SvgShapeProps) {
  return (
    <div
      className="absolute inset-0 rounded-xl border border-surface-border-subtle"
      style={{ backgroundColor: fill }}
    />
  );
}

function CircleShape({ fill }: SvgShapeProps) {
  return (
    <div
      className="absolute inset-0 border border-surface-border-subtle"
      style={{ backgroundColor: fill, borderRadius: "50%" }}
    />
  );
}

function PillShape({ fill }: SvgShapeProps) {
  return (
    <SvgShapeFrame>
      <g transform="rotate(45 50 50)">
        <rect
          fill={fill}
          height="28"
          rx="14"
          ry="14"
          stroke={SVG_STROKE}
          strokeWidth={SVG_STROKE_WIDTH}
          width="72"
          x="14"
          y="36"
        />
      </g>
    </SvgShapeFrame>
  );
}

function DiamondShape({ fill }: SvgShapeProps) {
  return (
    <SvgShapeFrame>
      <polygon
        fill={fill}
        points="50,4 96,50 50,96 4,50"
        stroke={SVG_STROKE}
        strokeLinejoin="round"
        strokeWidth={SVG_STROKE_WIDTH}
      />
    </SvgShapeFrame>
  );
}

function CylinderShape({ fill }: SvgShapeProps) {
  return (
    <SvgShapeFrame>
      <ellipse
        cx="50"
        cy="18"
        fill={fill}
        rx="38"
        ry="12"
        stroke={SVG_STROKE}
        strokeWidth={SVG_STROKE_WIDTH}
      />
      <path
        d="M12 18 L12 72 A38 12 0 0 0 88 72 L88 18"
        fill={fill}
        stroke={SVG_STROKE}
        strokeLinejoin="round"
        strokeWidth={SVG_STROKE_WIDTH}
      />
      <path
        d="M12 72 A38 12 0 0 0 88 72"
        fill="none"
        stroke={SVG_STROKE}
        strokeWidth={SVG_STROKE_WIDTH}
      />
    </SvgShapeFrame>
  );
}

function HexagonShape({ fill }: SvgShapeProps) {
  return (
    <SvgShapeFrame>
      <polygon
        fill={fill}
        points="25,8 75,8 98,50 75,92 25,92 2,50"
        stroke={SVG_STROKE}
        strokeLinejoin="round"
        strokeWidth={SVG_STROKE_WIDTH}
      />
    </SvgShapeFrame>
  );
}

const SHAPE_RENDERERS: Record<
  NodeShape,
  (props: SvgShapeProps) => ReactNode
> = {
  rectangle: RectangleShape,
  circle: CircleShape,
  pill: PillShape,
  diamond: DiamondShape,
  cylinder: CylinderShape,
  hexagon: HexagonShape,
};

export function CanvasNodeShape({ shape, fill }: CanvasNodeShapeProps) {
  const Renderer = SHAPE_RENDERERS[shape];
  return <Renderer fill={fill} />;
}
