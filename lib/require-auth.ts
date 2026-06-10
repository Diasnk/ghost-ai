import { auth } from "@clerk/nextjs/server";

interface AuthSuccess {
  userId: string;
}

export async function requireAuth(): Promise<AuthSuccess | Response> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { userId };
}
