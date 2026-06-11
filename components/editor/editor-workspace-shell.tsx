"use client";

import { useState } from "react";

import { AiSidebarPlaceholder } from "@/components/editor/ai-sidebar-placeholder";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareProjectDialog } from "@/components/editor/share-project-dialog";
import { useShareDialog } from "@/hooks/use-share-dialog";
import { cn } from "@/lib/utils";

interface EditorWorkspaceShellProps {
  children?: React.ReactNode;
  activeProjectId: string;
  isOwner: boolean;
  projectName: string;
  className?: string;
}

export function EditorWorkspaceShell({
  children,
  activeProjectId,
  isOwner,
  projectName,
  className,
}: EditorWorkspaceShellProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const shareDialog = useShareDialog({ projectId: activeProjectId, isOwner });

  return (
    <div className={cn("flex min-h-screen flex-col bg-base text-copy-primary", className)}>
      <EditorNavbar
        isAiSidebarOpen={isAiSidebarOpen}
        isSidebarOpen={isProjectSidebarOpen}
        onShareClick={shareDialog.openDialog}
        onToggleAiSidebar={() => setIsAiSidebarOpen((isOpen) => !isOpen)}
        onToggleSidebar={() => setIsProjectSidebarOpen((isOpen) => !isOpen)}
        projectName={projectName}
      />

      {isProjectSidebarOpen ? (
        <button
          aria-label="Close project sidebar"
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsProjectSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <div className="relative flex min-h-0 flex-1">
        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isProjectSidebarOpen}
          onClose={() => setIsProjectSidebarOpen(false)}
        />
        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
        <AiSidebarPlaceholder
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
      </div>

      <ShareProjectDialog shareDialog={shareDialog} />
    </div>
  );
}
