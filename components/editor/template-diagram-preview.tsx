import { CanvasNodeShape } from "@/components/editor/canvas-node-shape";
import { resolveNodeShape } from "@/lib/resolve-node-shape";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

const PREVIEW_WIDTH = 280;
const PREVIEW_HEIGHT = 160;
const PREVIEW_PADDING = 16;

export interface DiagramBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export function getDiagramBounds(nodes: CanvasNode[]): DiagramBounds {
  if (nodes.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: PREVIEW_WIDTH,
      maxY: PREVIEW_HEIGHT,
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    const width = node.width ?? node.measured?.width ?? 160;
    const height = node.height ?? node.measured?.height ?? 80;

    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function getNodeCenter(node: CanvasNode): { x: number; y: number } {
  const width = node.width ?? node.measured?.width ?? 160;
  const height = node.height ?? node.measured?.height ?? 80;

  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
}

interface TemplateDiagramPreviewProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  className?: string;
}

export function TemplateDiagramPreview({
  nodes,
  edges,
  className,
}: TemplateDiagramPreviewProps) {
  const bounds = getDiagramBounds(nodes);
  const availableWidth = PREVIEW_WIDTH - PREVIEW_PADDING * 2;
  const availableHeight = PREVIEW_HEIGHT - PREVIEW_PADDING * 2;
  const scale = Math.min(
    availableWidth / Math.max(bounds.width, 1),
    availableHeight / Math.max(bounds.height, 1)
  );
  const offsetX =
    PREVIEW_PADDING + (availableWidth - bounds.width * scale) / 2;
  const offsetY =
    PREVIEW_PADDING + (availableHeight - bounds.height * scale) / 2;

  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-base ${className ?? ""}`}
      style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`}
      >
        {edges.map((edge) => {
          const sourceNode = nodeById.get(edge.source);
          const targetNode = nodeById.get(edge.target);

          if (!sourceNode || !targetNode) {
            return null;
          }

          const source = getNodeCenter(sourceNode);
          const target = getNodeCenter(targetNode);

          return (
            <line
              key={edge.id}
              stroke="var(--text-muted)"
              strokeLinecap="round"
              strokeWidth={1.5}
              x1={offsetX + (source.x - bounds.minX) * scale}
              x2={offsetX + (target.x - bounds.minX) * scale}
              y1={offsetY + (source.y - bounds.minY) * scale}
              y2={offsetY + (target.y - bounds.minY) * scale}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const width = node.width ?? node.measured?.width ?? 160;
        const height = node.height ?? node.measured?.height ?? 80;
        const shape = resolveNodeShape(node.data.shape);

        return (
          <div
            key={node.id}
            className="pointer-events-none absolute"
            style={{
              left: offsetX + (node.position.x - bounds.minX) * scale,
              top: offsetY + (node.position.y - bounds.minY) * scale,
              width: width * scale,
              height: height * scale,
            }}
          >
            <div className="relative h-full w-full">
              <CanvasNodeShape fill={node.data.color} shape={shape} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
