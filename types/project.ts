export type ProjectOwnership = "owned" | "shared";

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  ownership: ProjectOwnership;
}
