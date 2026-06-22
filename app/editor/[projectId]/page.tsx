import { CanvasRoom } from "@/components/editor/canvas-room";
import { ProjectCanvas } from "@/components/editor/project-canvas";

interface ProjectWorkspacePageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { projectId } = await params;

  return (
    <CanvasRoom roomId={projectId}>
      <ProjectCanvas />
    </CanvasRoom>
  );
}
