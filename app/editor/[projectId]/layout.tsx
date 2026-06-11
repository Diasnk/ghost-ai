import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell";
import { clerkSignInUrl } from "@/lib/clerk-routes";
import { findProjectForUser, getClerkIdentity } from "@/lib/project-access";

interface ProjectWorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

export default async function ProjectWorkspaceLayout({
  children,
  params,
}: ProjectWorkspaceLayoutProps) {
  const identity = await getClerkIdentity();

  if (!identity) {
    redirect(clerkSignInUrl);
  }

  const { projectId } = await params;
  const access = await findProjectForUser(projectId, identity);

  if (access.status !== "ok") {
    return <AccessDenied />;
  }

  return (
    <EditorWorkspaceShell
      activeProjectId={access.project.id}
      projectName={access.project.name}
    >
      {children}
    </EditorWorkspaceShell>
  );
}
