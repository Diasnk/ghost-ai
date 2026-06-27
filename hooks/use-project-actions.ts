"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { buildRoomIdPreview } from "@/lib/room-id";
import { sortEditorProjectsByCreatedAt } from "@/lib/sort-projects";
import type { EditorProject } from "@/types/project";

export type ProjectDialogType = "create" | "rename" | "delete" | null;

function generateRoomIdSuffix(): string {
  return crypto.randomUUID().slice(0, 6);
}

export function useProjectActions(initialProjects: EditorProject[]) {
  const router = useRouter();
  const pathname = usePathname();

  const [projects, setProjects] = useState<EditorProject[]>(initialProjects);
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [formName, setFormName] = useState("");
  const [roomIdSuffix, setRoomIdSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const roomIdPreview = useMemo(
    () => (roomIdSuffix ? buildRoomIdPreview(formName, roomIdSuffix) : ""),
    [formName, roomIdSuffix]
  );

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedProjectId(null);
    setFormName("");
    setRoomIdSuffix("");
    setIsLoading(false);
  }, []);

  const openCreateDialog = useCallback(() => {
    setActiveDialog("create");
    setSelectedProjectId(null);
    setFormName("");
    setRoomIdSuffix(generateRoomIdSuffix());
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
      setRoomIdSuffix("");
    },
    [projects]
  );

  const openDeleteDialog = useCallback((projectId: string) => {
    setActiveDialog("delete");
    setSelectedProjectId(projectId);
    setFormName("");
    setRoomIdSuffix("");
  }, []);

  const handleCreate = useCallback(async () => {
    const trimmedName = formName.trim();
    if (!trimmedName || !roomIdSuffix) {
      return;
    }

    const roomId = buildRoomIdPreview(trimmedName, roomIdSuffix);

    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, id: roomId }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const { project } = (await response.json()) as {
        project: { id: string; name: string; createdAt: string };
      };

      setProjects((current) =>
        sortEditorProjectsByCreatedAt([
          ...current,
          {
            id: project.id,
            name: project.name,
            ownership: "owned",
            createdAt: project.createdAt,
          },
        ])
      );
      closeDialog();
      router.push(`/editor/${roomId}`);
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  }, [closeDialog, formName, roomIdSuffix, router]);

  const handleRename = useCallback(async () => {
    if (!selectedProjectId) {
      return;
    }

    const trimmedName = formName.trim();
    if (!trimmedName) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${selectedProjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      setProjects((current) =>
        current.map((project) =>
          project.id === selectedProjectId
            ? { ...project, name: trimmedName }
            : project
        )
      );
      closeDialog();
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  }, [closeDialog, formName, router, selectedProjectId]);

  const handleDelete = useCallback(async () => {
    if (!selectedProjectId) {
      return;
    }

    const projectId = selectedProjectId;
    const isActiveWorkspace = pathname === `/editor/${projectId}`;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      setProjects((current) =>
        current.filter((project) => project.id !== projectId)
      );
      closeDialog();

      if (isActiveWorkspace) {
        router.push("/editor");
      }

      router.refresh();
    } catch {
      setIsLoading(false);
    }
  }, [closeDialog, pathname, router, selectedProjectId]);

  return {
    projects,
    activeDialog,
    selectedProject,
    formName,
    isLoading,
    roomIdPreview,
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

export type UseProjectActionsReturn = ReturnType<typeof useProjectActions>;
