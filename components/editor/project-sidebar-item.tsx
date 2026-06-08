"use client";

import { Pencil, Trash2 } from "lucide-react";

import { useEditorProjects } from "@/components/editor/editor-projects-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MockProject } from "@/types/project";

interface ProjectSidebarItemProps {
  project: MockProject;
  className?: string;
}

export function ProjectSidebarItem({
  project,
  className,
}: ProjectSidebarItemProps) {
  const { openRenameDialog, openDeleteDialog } = useEditorProjects();
  const showActions = project.ownership === "owned";

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-xl border border-surface-border bg-subtle/40 px-3 py-2",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-copy-primary">
          {project.name}
        </p>
        <p className="truncate text-xs text-copy-muted">{project.slug}</p>
      </div>

      {showActions ? (
        <div className="flex shrink-0 items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <Button
            aria-label={`Rename ${project.name}`}
            onClick={() => openRenameDialog(project.id)}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            aria-label={`Delete ${project.name}`}
            onClick={() => openDeleteDialog(project.id)}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
