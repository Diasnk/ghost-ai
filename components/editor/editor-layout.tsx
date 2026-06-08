"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { EditorProjectsProvider } from "@/components/editor/editor-projects-context";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);

  return (
    <EditorProjectsProvider>
      <div className={cn("flex min-h-screen flex-col bg-base text-copy-primary", className)}>
        <EditorNavbar
          isSidebarOpen={isProjectSidebarOpen}
          onToggleSidebar={() => setIsProjectSidebarOpen((isOpen) => !isOpen)}
        />

        {isProjectSidebarOpen ? (
          <button
            aria-label="Close project sidebar"
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setIsProjectSidebarOpen(false)}
            type="button"
          />
        ) : null}

        <ProjectSidebar
          isOpen={isProjectSidebarOpen}
          onClose={() => setIsProjectSidebarOpen(false)}
        />
        <ProjectDialogs />
        <main className="relative min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </EditorProjectsProvider>
  );
}
