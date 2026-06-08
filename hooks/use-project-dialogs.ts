"use client";

import { useCallback, useMemo, useState } from "react";

import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { slugify } from "@/lib/slugify";
import type { MockProject } from "@/types/project";

export type ProjectDialogType = "create" | "rename" | "delete" | null;

const MOCK_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateProjectId(): string {
  return `proj-${crypto.randomUUID()}`;
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(MOCK_PROJECTS);
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [formName, setFormName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const slugPreview = useMemo(() => slugify(formName), [formName]);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedProjectId(null);
    setFormName("");
    setIsLoading(false);
  }, []);

  const openCreateDialog = useCallback(() => {
    setActiveDialog("create");
    setSelectedProjectId(null);
    setFormName("");
  }, []);

  const openRenameDialog = useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);
      if (!project) {
        return;
      }

      setActiveDialog("rename");
      setSelectedProjectId(projectId);
      setFormName(project.name);
    },
    [projects]
  );

  const openDeleteDialog = useCallback((projectId: string) => {
    setActiveDialog("delete");
    setSelectedProjectId(projectId);
    setFormName("");
  }, []);

  const handleCreate = useCallback(async () => {
    const trimmedName = formName.trim();
    if (!trimmedName) {
      return;
    }

    setIsLoading(true);
    await delay(MOCK_DELAY_MS);

    const slug = slugify(trimmedName) || "untitled-project";

    setProjects((current) => [
      ...current,
      {
        id: generateProjectId(),
        name: trimmedName,
        slug,
        ownership: "owned",
      },
    ]);

    closeDialog();
  }, [closeDialog, formName]);

  const handleRename = useCallback(async () => {
    if (!selectedProjectId) {
      return;
    }

    const trimmedName = formName.trim();
    if (!trimmedName) {
      return;
    }

    setIsLoading(true);
    await delay(MOCK_DELAY_MS);

    const slug = slugify(trimmedName) || "untitled-project";

    setProjects((current) =>
      current.map((project) =>
        project.id === selectedProjectId
          ? { ...project, name: trimmedName, slug }
          : project
      )
    );

    closeDialog();
  }, [closeDialog, formName, selectedProjectId]);

  const handleDelete = useCallback(async () => {
    if (!selectedProjectId) {
      return;
    }

    setIsLoading(true);
    await delay(MOCK_DELAY_MS);

    setProjects((current) =>
      current.filter((project) => project.id !== selectedProjectId)
    );

    closeDialog();
  }, [closeDialog, selectedProjectId]);

  return {
    projects,
    activeDialog,
    selectedProject,
    formName,
    isLoading,
    slugPreview,
    setFormName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleCreate,
    handleRename,
    handleDelete,
  };
}

export type UseProjectDialogsReturn = ReturnType<typeof useProjectDialogs>;
