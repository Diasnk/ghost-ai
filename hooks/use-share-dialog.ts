"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ProjectMemberView } from "@/types/collaborator";

interface UseShareDialogOptions {
  projectId: string;
  isOwner: boolean;
}

interface CollaboratorsResponse {
  isOwner: boolean;
  members: ProjectMemberView[];
}

export function useShareDialog({ projectId, isOwner }: UseShareDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<ProjectMemberView[]>([]);
  const [resolvedIsOwner, setResolvedIsOwner] = useState(isOwner);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isRemovingId, setIsRemovingId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<"Copy link" | "Copied!">(
    "Copy link"
  );
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setResolvedIsOwner(isOwner);
  }, [isOwner]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);

      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as CollaboratorsResponse;
      setMembers(data.members);
      setResolvedIsOwner(data.isOwner);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, [projectId]);

  const openDialog = useCallback(() => {
    setIsOpen(true);
    setCopyFeedback("Copy link");
    void fetchCollaborators();
  }, [fetchCollaborators]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setInviteEmail("");
    setIsInviting(false);
    setIsRemovingId(null);
    setCopyFeedback("Copy link");

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }
  }, []);

  const inviteCollaborator = useCallback(async () => {
    const trimmedEmail = inviteEmail.trim();
    if (!trimmedEmail || isInviting) {
      return;
    }

    setIsInviting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        setIsInviting(false);
        return;
      }

      const data = (await response.json()) as {
        collaborator: ProjectMemberView & { createdAt: string };
      };

      setMembers((current) => [...current, data.collaborator]);
      setInviteEmail("");
      setIsInviting(false);
    } catch {
      setIsInviting(false);
    }
  }, [inviteEmail, isInviting, projectId]);

  const removeCollaborator = useCallback(
    async (collaboratorId: string) => {
      if (isRemovingId) {
        return;
      }

      setIsRemovingId(collaboratorId);

      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          setIsRemovingId(null);
          return;
        }

        setMembers((current) =>
          current.filter((member) => member.id !== collaboratorId)
        );
        setIsRemovingId(null);
      } catch {
        setIsRemovingId(null);
      }
    },
    [isRemovingId, projectId]
  );

  const copyProjectLink = useCallback(async () => {
    const projectUrl = `${window.location.origin}/editor/${projectId}`;

    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopyFeedback("Copied!");

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopyFeedback("Copy link");
        copyTimeoutRef.current = null;
      }, 2000);
    } catch {
      setCopyFeedback("Copy link");
    }
  }, [projectId]);

  return {
    isOpen,
    members,
    isOwner: resolvedIsOwner,
    inviteEmail,
    isLoading,
    isInviting,
    isRemovingId,
    copyFeedback,
    projectUrl: `/editor/${projectId}`,
    setInviteEmail,
    openDialog,
    closeDialog,
    inviteCollaborator,
    removeCollaborator,
    copyProjectLink,
  };
}

export type UseShareDialogReturn = ReturnType<typeof useShareDialog>;
