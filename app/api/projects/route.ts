import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

const DEFAULT_PROJECT_NAME = "Untitled Project";
const PROJECT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface CreateProjectBody {
  name?: string;
  id?: string;
}

function isValidProjectId(id: string): boolean {
  return PROJECT_ID_PATTERN.test(id);
}

export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: authResult.userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  let body: CreateProjectBody = {};

  try {
    body = (await request.json()) as CreateProjectBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const trimmedName = typeof body.name === "string" ? body.name.trim() : "";
  const name = trimmedName || DEFAULT_PROJECT_NAME;

  if (body.id !== undefined) {
    if (typeof body.id !== "string" || !isValidProjectId(body.id)) {
      return Response.json({ error: "Invalid project ID" }, { status: 400 });
    }
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        ownerId: authResult.userId,
        name,
      },
    });

    return Response.json({ project }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "Project ID already exists" },
        { status: 409 }
      );
    }

    throw error;
  }
}
