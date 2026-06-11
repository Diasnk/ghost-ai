export type ProjectMemberRole = "owner" | "collaborator";

export interface ProjectMemberView {
  id: string;
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
  role: ProjectMemberRole;
}

/** @deprecated Use ProjectMemberView with role "collaborator" */
export interface ProjectCollaboratorView extends ProjectMemberView {
  role: "collaborator";
  createdAt: string;
}
