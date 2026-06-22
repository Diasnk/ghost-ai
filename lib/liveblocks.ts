import { Liveblocks } from "@liveblocks/node";

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

function createLiveblocksClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
  }

  return new Liveblocks({ secret });
}

export function getLiveblocks(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = createLiveblocksClient();
  }

  return globalForLiveblocks.liveblocks;
}

export async function ensureLiveblocksRoom(
  projectId: string,
  userId: string
): Promise<void> {
  const liveblocks = getLiveblocks();

  await liveblocks.getOrCreateRoom(projectId, {
    defaultAccesses: [],
  });

  await liveblocks.updateRoom(projectId, {
    usersAccesses: {
      [userId]: ["room:write"],
    },
  });
}
