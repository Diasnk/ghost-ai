"use client";

import { Plus } from "lucide-react";

import { useEditorProjects } from "@/components/editor/editor-projects-context";
import { Button } from "@/components/ui/button";

export function EditorHome() {
  const { openCreateDialog } = useEditorProjects();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="max-w-md text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the sidebar
      </p>
      <Button onClick={openCreateDialog} type="button">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
