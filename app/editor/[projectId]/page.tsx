interface ProjectWorkspacePageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params;

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-copy-muted">Workspace: {projectId}</p>
    </div>
  );
}
