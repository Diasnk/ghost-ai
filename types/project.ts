export type ProjectOwnership = "owned" | "shared";

export interface EditorProject {
  id: string;
  name: string;
  ownership: ProjectOwnership;
}
