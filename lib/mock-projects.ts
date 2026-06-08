import type { MockProject } from "@/types/project";

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "proj-1",
    name: "API Gateway",
    slug: "api-gateway",
    ownership: "owned",
  },
  {
    id: "proj-2",
    name: "Event Pipeline",
    slug: "event-pipeline",
    ownership: "owned",
  },
  {
    id: "proj-3",
    name: "Shared Dashboard",
    slug: "shared-dashboard",
    ownership: "shared",
  },
];
