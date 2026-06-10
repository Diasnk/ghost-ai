import { prisma } from "@/lib/prisma";
import {
  findProjectForOwner,
  projectAccessResponse,
} from "@/lib/projects";
import { requireAuth } from "@/lib/require-auth";

interface RenameProjectBody {
  name?: string;
}

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const { projectId } = await params;

  let body: RenameProjectBody;

  try {
    body = (await request.json()) as RenameProjectBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.name !== "string") {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const name = body.name.trim();
  if (!name) {
    return Response.json({ error: "Name cannot be empty" }, { status: 400 });
  }

  const { count } = await prisma.project.updateMany({
    where: { id: projectId, ownerId: authResult.userId },
    data: { name },
  });

  if (count === 0) {
    const access = await findProjectForOwner(projectId, authResult.userId);
    if (access.status !== "ok") {
      return projectAccessResponse(access);
    }
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
  });

  return Response.json({ project });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const { projectId } = await params;

  const { count } = await prisma.project.deleteMany({
    where: { id: projectId, ownerId: authResult.userId },
  });

  if (count === 0) {
    const access = await findProjectForOwner(projectId, authResult.userId);
    if (access.status !== "ok") {
      return projectAccessResponse(access);
    }
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
