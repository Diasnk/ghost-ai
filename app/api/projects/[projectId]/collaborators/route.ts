import {
  inviteProjectCollaborator,
  listProjectCollaborators,
  toProjectMemberViews,
} from "@/lib/collaborators";
import {
  findProjectForUser,
  getClerkIdentity,
} from "@/lib/project-access";
import { findProjectForOwner, projectAccessResponse } from "@/lib/projects";
import { requireAuth } from "@/lib/require-auth";

interface InviteCollaboratorBody {
  email?: string;
}

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const identity = await getClerkIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await findProjectForUser(projectId, identity);

  if (access.status !== "ok") {
    return projectAccessResponse(access);
  }

  const collaborators = await listProjectCollaborators(projectId);
  const members = await toProjectMemberViews(
    access.project.ownerId,
    collaborators
  );

  return Response.json({
    isOwner: access.project.ownerId === identity.userId,
    members,
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const { projectId } = await params;
  const access = await findProjectForOwner(projectId, authResult.userId);

  if (access.status !== "ok") {
    return projectAccessResponse(access);
  }

  let body: InviteCollaboratorBody;

  try {
    body = (await request.json()) as InviteCollaboratorBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.email !== "string"
  ) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const result = await inviteProjectCollaborator(projectId, body.email);

  if (result.status === "invalid_email") {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (result.status === "conflict") {
    return Response.json(
      { error: "Collaborator already invited" },
      { status: 409 }
    );
  }

  return Response.json({ collaborator: result.collaborator }, { status: 201 });
}
