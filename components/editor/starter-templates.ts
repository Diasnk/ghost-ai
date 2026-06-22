import { getShapeDefaults } from "@/lib/canvas-shape-defaults";
import {
  CANVAS_EDGE_TYPE,
  CANVAS_NODE_TYPE,
  connectionHandleId,
  NODE_COLORS,
  type CanvasEdge,
  type CanvasNode,
  type ConnectionNodePosition,
  type NodeShape,
} from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function templateNode(
  id: string,
  label: string,
  shape: NodeShape,
  position: { x: number; y: number },
  colorIndex = 0
): CanvasNode {
  const { width, height } = getShapeDefaults(shape);

  return {
    id,
    type: CANVAS_NODE_TYPE,
    position,
    data: {
      label,
      color: NODE_COLORS[colorIndex]?.fill ?? NODE_COLORS[0].fill,
      shape,
    },
    width,
    height,
  };
}

function templateEdge(
  id: string,
  source: string,
  target: string,
  sourceSide: ConnectionNodePosition = "right",
  targetSide: ConnectionNodePosition = "left",
  label = ""
): CanvasEdge {
  return {
    id,
    type: CANVAS_EDGE_TYPE,
    source,
    target,
    sourceHandle: connectionHandleId(sourceSide, "source"),
    targetHandle: connectionHandleId(targetSide, "target"),
    data: { label },
  };
}

const microservicesTemplate: CanvasTemplate = {
  id: "microservices",
  name: "Microservices",
  description:
    "API gateway routing requests to dedicated services backed by separate databases.",
  nodes: [
    templateNode("ms-client", "Client", "circle", { x: 0, y: 180 }, 6),
    templateNode("ms-api-gateway", "API Gateway", "pill", { x: 200, y: 160 }, 1),
    templateNode("ms-auth", "Auth Service", "rectangle", { x: 480, y: 40 }, 2),
    templateNode("ms-users", "User Service", "rectangle", { x: 480, y: 160 }, 3),
    templateNode("ms-orders", "Order Service", "rectangle", { x: 480, y: 280 }, 4),
    templateNode("ms-auth-db", "Auth DB", "cylinder", { x: 760, y: 20 }, 0),
    templateNode("ms-users-db", "Users DB", "cylinder", { x: 760, y: 140 }, 0),
    templateNode("ms-orders-db", "Orders DB", "cylinder", { x: 760, y: 260 }, 0),
  ],
  edges: [
    templateEdge("ms-e1", "ms-client", "ms-api-gateway"),
    templateEdge("ms-e2", "ms-api-gateway", "ms-auth"),
    templateEdge("ms-e3", "ms-api-gateway", "ms-users"),
    templateEdge("ms-e4", "ms-api-gateway", "ms-orders"),
    templateEdge("ms-e5", "ms-auth", "ms-auth-db"),
    templateEdge("ms-e6", "ms-users", "ms-users-db"),
    templateEdge("ms-e7", "ms-orders", "ms-orders-db"),
  ],
};

const cicdPipelineTemplate: CanvasTemplate = {
  id: "cicd-pipeline",
  name: "CI/CD Pipeline",
  description:
    "Source control through build, test, and staged deployments to production.",
  nodes: [
    templateNode("cicd-source", "Source", "rectangle", { x: 0, y: 140 }, 6),
    templateNode("cicd-build", "Build", "pill", { x: 220, y: 140 }, 1),
    templateNode("cicd-test", "Test", "pill", { x: 440, y: 140 }, 3),
    templateNode("cicd-staging", "Staging", "rectangle", { x: 660, y: 80 }, 2),
    templateNode("cicd-production", "Production", "rectangle", { x: 660, y: 220 }, 5),
    templateNode("cicd-artifacts", "Artifacts", "cylinder", { x: 220, y: 300 }, 0),
    templateNode("cicd-monitor", "Monitoring", "hexagon", { x: 900, y: 140 }, 7),
  ],
  edges: [
    templateEdge("cicd-e1", "cicd-source", "cicd-build"),
    templateEdge("cicd-e2", "cicd-build", "cicd-test"),
    templateEdge("cicd-e3", "cicd-test", "cicd-staging"),
    templateEdge("cicd-e4", "cicd-test", "cicd-production"),
    templateEdge("cicd-e5", "cicd-build", "cicd-artifacts", "bottom", "top"),
    templateEdge("cicd-e6", "cicd-staging", "cicd-monitor"),
    templateEdge("cicd-e7", "cicd-production", "cicd-monitor"),
  ],
};

const eventDrivenTemplate: CanvasTemplate = {
  id: "event-driven",
  name: "Event-Driven System",
  description:
    "Producers publish events to a central bus consumed by downstream services.",
  nodes: [
    templateNode("ed-producer-a", "Producer A", "rectangle", { x: 0, y: 40 }, 1),
    templateNode("ed-producer-b", "Producer B", "rectangle", { x: 0, y: 200 }, 3),
    templateNode("ed-bus", "Event Bus", "hexagon", { x: 280, y: 100 }, 2),
    templateNode("ed-router", "Router", "diamond", { x: 520, y: 110 }, 7),
    templateNode("ed-consumer-a", "Consumer A", "pill", { x: 760, y: 20 }, 4),
    templateNode("ed-consumer-b", "Consumer B", "pill", { x: 760, y: 140 }, 5),
    templateNode("ed-consumer-c", "Consumer C", "pill", { x: 760, y: 260 }, 6),
    templateNode("ed-dead-letter", "Dead Letter", "cylinder", { x: 520, y: 300 }, 0),
  ],
  edges: [
    templateEdge("ed-e1", "ed-producer-a", "ed-bus"),
    templateEdge("ed-e2", "ed-producer-b", "ed-bus"),
    templateEdge("ed-e3", "ed-bus", "ed-router"),
    templateEdge("ed-e4", "ed-router", "ed-consumer-a"),
    templateEdge("ed-e5", "ed-router", "ed-consumer-b"),
    templateEdge("ed-e6", "ed-router", "ed-consumer-c"),
    templateEdge("ed-e7", "ed-router", "ed-dead-letter", "bottom", "top"),
  ],
};

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  microservicesTemplate,
  cicdPipelineTemplate,
  eventDrivenTemplate,
];
