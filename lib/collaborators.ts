import type { ProjectCollaborator } from "@/app/generated/prisma/client";
import { Prisma } from "@/app/generated/prisma/client";
import {
  getClerkProfileByUserId,
  getClerkProfilesByEmail,
} from "@/lib/clerk-users";
import { prisma } from "@/lib/prisma";
import type {
  ProjectCollaboratorView,
  ProjectMemberView,
} from "@/types/collaborator";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeCollaboratorEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidCollaboratorEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export async function listProjectCollaborators(
  projectId: string
): Promise<ProjectCollaborator[]> {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });
}

export async function toCollaboratorViews(
  collaborators: ProjectCollaborator[]
): Promise<ProjectCollaboratorView[]> {
  const profiles = await getClerkProfilesByEmail(
    collaborators.map((collaborator) => collaborator.email)
  );

  return collaborators.map((collaborator) => {
    const normalizedEmail = normalizeCollaboratorEmail(collaborator.email);
    const profile = profiles.get(normalizedEmail);

    return {
      id: collaborator.id,
      email: normalizedEmail,
      displayName: profile?.displayName ?? null,
      imageUrl: profile?.imageUrl ?? null,
      role: "collaborator",
      createdAt: collaborator.createdAt.toISOString(),
    };
  });
}

export async function toProjectMemberViews(
  ownerId: string,
  collaborators: ProjectCollaborator[]
): Promise<ProjectMemberView[]> {
  const [ownerProfile, collaboratorViews] = await Promise.all([
    getClerkProfileByUserId(ownerId),
    toCollaboratorViews(collaborators),
  ]);

  const owner: ProjectMemberView = {
    id: ownerId,
    email: ownerProfile.email,
    displayName: ownerProfile.displayName,
    imageUrl: ownerProfile.imageUrl,
    role: "owner",
  };

  return [owner, ...collaboratorViews];
}

export type InviteCollaboratorResult =
  | { status: "ok"; collaborator: ProjectCollaboratorView }
  | { status: "invalid_email" }
  | { status: "conflict" };

export async function inviteProjectCollaborator(
  projectId: string,
  email: string
): Promise<InviteCollaboratorResult> {
  const normalizedEmail = normalizeCollaboratorEmail(email);

  if (!isValidCollaboratorEmail(normalizedEmail)) {
    return { status: "invalid_email" };
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email: normalizedEmail,
      },
    });

    const [view] = await toCollaboratorViews([collaborator]);
    return { status: "ok", collaborator: view };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { status: "conflict" };
    }

    throw error;
  }
}

export async function removeProjectCollaborator(
  projectId: string,
  collaboratorId: string
): Promise<boolean> {
  const { count } = await prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });

  return count > 0;
}
