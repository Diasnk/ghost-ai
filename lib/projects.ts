import type { Project } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { sortEditorProjectsByCreatedAt } from "@/lib/sort-projects";
import type { EditorProject } from "@/types/project";

type ProjectAccessResult =
  | { status: "ok"; project: Project }
  | { status: "not_found" }
  | { status: "forbidden" };

export async function findProjectForOwner(
  projectId: string,
  ownerId: string
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { status: "not_found" };
  }

  if (project.ownerId !== ownerId) {
    return { status: "forbidden" };
  }

  return { status: "ok", project };
}

export function projectAccessResponse(
  result: Exclude<ProjectAccessResult, { status: "ok" }>
): Response {
  if (result.status === "not_found") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ error: "Forbidden" }, { status: 403 });
}

function toEditorProject(
  project: Project,
  ownership: EditorProject["ownership"]
): EditorProject {
  return {
    id: project.id,
    name: project.name,
    ownership,
    createdAt: project.createdAt.toISOString(),
  };
}

export async function listOwnedProjects(userId: string): Promise<EditorProject[]> {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return sortEditorProjectsByCreatedAt(
    projects.map((project) => toEditorProject(project, "owned"))
  );
}

export async function listSharedProjects(
  email: string | null | undefined
): Promise<EditorProject[]> {
  if (!email) {
    return [];
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { email: email.trim().toLowerCase() },
    include: { project: true },
    orderBy: { project: { createdAt: "desc" } },
  });

  return sortEditorProjectsByCreatedAt(
    collaborators.map((collaborator) =>
      toEditorProject(collaborator.project, "shared")
    )
  );
}

export async function getEditorProjectLists(
  userId: string,
  email: string | null | undefined
): Promise<{ owned: EditorProject[]; shared: EditorProject[] }> {
  const [owned, shared] = await Promise.all([
    listOwnedProjects(userId),
    listSharedProjects(email),
  ]);

  return { owned, shared };
}
