"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

interface EditorLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);

  return (
    <div className={cn("flex min-h-screen flex-col bg-base text-copy-primary", className)}>
      <EditorNavbar
        isSidebarOpen={isProjectSidebarOpen}
        onToggleSidebar={() => setIsProjectSidebarOpen((isOpen) => !isOpen)}
      />
      <ProjectSidebar
        isOpen={isProjectSidebarOpen}
        onClose={() => setIsProjectSidebarOpen(false)}
      />
      <main className="relative min-h-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
