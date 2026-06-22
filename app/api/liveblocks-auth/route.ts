import { getClerkProfileByUserId } from "@/lib/clerk-users";
import { getCursorColorForUserId } from "@/lib/cursor-color";
import { ensureLiveblocksRoom, getLiveblocks } from "@/lib/liveblocks";
import {
  findProjectForUser,
  getClerkIdentity,
} from "@/lib/project-access";
import { projectAccessResponse } from "@/lib/projects";
import { requireAuth } from "@/lib/require-auth";

interface LiveblocksAuthBody {
  room?: string;
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    return authResult;
  }

  const identity = await getClerkIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: LiveblocksAuthBody;

  try {
    body = (await request.json()) as LiveblocksAuthBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.room !== "string" ||
    body.room.trim().length === 0
  ) {
    return Response.json({ error: "Room is required" }, { status: 400 });
  }

  const room = body.room.trim();
  const access = await findProjectForUser(room, identity);

  if (access.status !== "ok") {
    return projectAccessResponse(access);
  }

  await ensureLiveblocksRoom(room, identity.userId);

  const profile = await getClerkProfileByUserId(identity.userId);
  const color = getCursorColorForUserId(identity.userId);

  const { status, body: responseBody } = await getLiveblocks().identifyUser(
    identity.userId,
    {
      userInfo: {
        name: profile.displayName ?? "Anonymous",
        avatarURL: profile.imageUrl ?? "",
        color,
      },
    }
  );

  return new Response(responseBody, { status });
}
