import { removeProjectCollaborator } from "@/lib/collaborators";
import { findProjectForOwner, projectAccessResponse } from "@/lib/projects";
import { requireAuth } from "@/lib/require-auth";

interface RouteContext {
  params: Promise<{ projectId: string; collaboratorId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const { projectId, collaboratorId } = await params;
  const access = await findProjectForOwner(projectId, authResult.userId);

  if (access.status !== "ok") {
    return projectAccessResponse(access);
  }

  const removed = await removeProjectCollaborator(projectId, collaboratorId);

  if (!removed) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
