import { forbidden, notFound, redirect } from "next/navigation";

import { clerkSignInUrl } from "@/lib/clerk-routes";
import { findProjectForOwner } from "@/lib/projects";
import { requireAuth } from "@/lib/require-auth";

interface ProjectWorkspacePageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const authResult = await requireAuth();
  if (authResult instanceof Response) {
    redirect(clerkSignInUrl);
  }

  const { projectId } = await params;
  const access = await findProjectForOwner(projectId, authResult.userId);

  if (access.status === "not_found") {
    notFound();
  }

  if (access.status === "forbidden") {
    forbidden();
  }

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-copy-muted">Workspace: {access.project.name}</p>
    </div>
  );
}
