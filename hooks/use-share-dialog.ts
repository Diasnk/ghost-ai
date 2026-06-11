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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isRemovingId, setIsRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
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
    setLoadError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);

      if (!response.ok) {
        setLoadError("Could not load collaborators. Please try again.");
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as CollaboratorsResponse;
      setMembers(data.members);
      setResolvedIsOwner(data.isOwner);
      setLoadError(null);
      setIsLoading(false);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load collaborators. Please try again."
      );
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
    setLoadError(null);
    setInviteError(null);
    setRemoveError(null);
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
    setInviteError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        let message = "Could not send invite. Please try again.";

        try {
          const errorData = (await response.json()) as { error?: string };
          if (typeof errorData.error === "string") {
            message = errorData.error;
          }
        } catch {
          // Keep fallback message when error body is not JSON.
        }

        setInviteError(message);
        setIsInviting(false);
        return;
      }

      const data = (await response.json()) as {
        collaborator: ProjectMemberView & { createdAt: string };
      };

      setMembers((current) => [...current, data.collaborator]);
      setInviteEmail("");
      setInviteError(null);
      setIsInviting(false);
    } catch (error) {
      setInviteError(
        error instanceof Error ? error.message : "Unknown error"
      );
      setIsInviting(false);
    }
  }, [inviteEmail, isInviting, projectId]);

  const removeCollaborator = useCallback(
    async (collaboratorId: string) => {
      if (isRemovingId) {
        return;
      }

      setIsRemovingId(collaboratorId);
      setRemoveError(null);

      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          let message = "Could not remove collaborator. Please try again.";

          try {
            const errorText = await response.text();
            if (errorText) {
              try {
                const errorData = JSON.parse(errorText) as { error?: string };
                message =
                  typeof errorData.error === "string"
                    ? errorData.error
                    : errorText;
              } catch {
                message = errorText;
              }
            }
          } catch {
            // Keep fallback message when error body cannot be read.
          }

          setRemoveError(message);
          setIsRemovingId(null);
          return;
        }

        setMembers((current) =>
          current.filter((member) => member.id !== collaboratorId)
        );
        setRemoveError(null);
        setIsRemovingId(null);
      } catch (error) {
        setRemoveError(
          error instanceof Error ? error.message : String(error)
        );
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
    loadError,
    isInviting,
    inviteError,
    isRemovingId,
    removeError,
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
