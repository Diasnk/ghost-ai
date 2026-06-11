import { currentUser } from "@clerk/nextjs/server";

import type { Project } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  email: string | null;
}

export type ProjectAccessResult =
  | { status: "ok"; project: Project }
  | { status: "not_found" }
  | { status: "forbidden" };

export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
  };
}

export async function findProjectForUser(
  projectId: string,
  identity: ClerkIdentity
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { status: "not_found" };
  }

  if (project.ownerId === identity.userId) {
    return { status: "ok", project };
  }

  const email = identity.email?.trim().toLowerCase();
  if (!email) {
    return { status: "forbidden" };
  }

  const collaborator = await prisma.projectCollaborator.findFirst({
    where: {
      projectId,
      email,
    },
  });

  if (!collaborator) {
    return { status: "forbidden" };
  }

  return { status: "ok", project };
}
