"use client";

import { UserMinus } from "lucide-react";

import { EditorDialogContent } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UseShareDialogReturn } from "@/hooks/use-share-dialog";
import { cn } from "@/lib/utils";
import type { ProjectMemberView } from "@/types/collaborator";

interface ShareProjectDialogProps {
  shareDialog: UseShareDialogReturn;
}

function getMemberLabel(member: ProjectMemberView): string {
  if (member.displayName) {
    return member.displayName;
  }

  if (member.email) {
    return member.email;
  }

  return member.role === "owner" ? "Workspace owner" : "Collaborator";
}

function getMemberInitial(member: ProjectMemberView): string {
  return getMemberLabel(member).charAt(0).toUpperCase();
}

function getRoleLabel(role: ProjectMemberView["role"]): string {
  return role === "owner" ? "Owner" : "Collaborator";
}

function MemberAvatar({ member }: { member: ProjectMemberView }) {
  if (member.imageUrl) {
    return (
      <img
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
        src={member.imageUrl}
      />
    );
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-copy-secondary">
      {getMemberInitial(member)}
    </div>
  );
}

export function ShareProjectDialog({ shareDialog }: ShareProjectDialogProps) {
  const {
    isOpen,
    members,
    isOwner,
    inviteEmail,
    isLoading,
    isInviting,
    isRemovingId,
    copyFeedback,
    projectUrl,
    setInviteEmail,
    closeDialog,
    inviteCollaborator,
    removeCollaborator,
    copyProjectLink,
  } = shareDialog;

  const canInvite = inviteEmail.trim().length > 0 && !isInviting && !isLoading;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <EditorDialogContent
        className="w-full max-w-2xl sm:max-w-2xl min-w-0 overflow-hidden [&>*]:min-w-0"
        description={
          isOwner
            ? "Invite collaborators and share access to this workspace."
            : "People with access to this workspace."
        }
        title="Share project"
      >
        <div className="min-w-0 space-y-5">
          {isOwner ? (
            <>
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-medium text-copy-secondary">
                  Project link
                </p>
                <div className="flex min-w-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      readOnly
                      className="truncate"
                      value={
                        typeof window === "undefined"
                          ? projectUrl
                          : `${window.location.origin}${projectUrl}`
                      }
                    />
                  </div>
                  <Button
                    className="shrink-0"
                    onClick={() => void copyProjectLink()}
                    type="button"
                    variant="outline"
                  >
                    {copyFeedback}
                  </Button>
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                <p className="text-sm font-medium text-copy-secondary">
                  Invite by email
                </p>
                <div className="flex min-w-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      disabled={isInviting || isLoading}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && canInvite) {
                          event.preventDefault();
                          void inviteCollaborator();
                        }
                      }}
                      placeholder="name@example.com"
                      type="email"
                      value={inviteEmail}
                    />
                  </div>
                  <Button
                    className="shrink-0"
                    disabled={!canInvite}
                    onClick={() => void inviteCollaborator()}
                    type="button"
                  >
                    {isInviting ? "Inviting..." : "Invite"}
                  </Button>
                </div>
              </div>
            </>
          ) : null}

          <div className="min-w-0 space-y-2">
            <p className="text-sm font-medium text-copy-secondary">
              People with access
            </p>

            {isLoading ? (
              <p className="text-sm text-copy-muted">Loading access list...</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-copy-muted">No members found.</p>
            ) : (
              <ScrollArea className="max-h-56 w-full min-w-0 overflow-hidden rounded-2xl border border-surface-border bg-surface">
                <ul className="w-full min-w-0 divide-y divide-surface-border">
                  {members.map((member) => (
                    <li
                      key={member.id}
                      className="flex min-w-0 items-center gap-2 overflow-hidden px-3 py-2.5"
                    >
                      <MemberAvatar member={member} />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-copy-primary">
                          {getMemberLabel(member)}
                        </p>
                        {member.displayName && member.email ? (
                          <p className="truncate text-xs text-copy-muted">
                            {member.email}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <span className="rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-copy-muted">
                          {getRoleLabel(member.role)}
                        </span>

                        {isOwner && member.role === "collaborator" ? (
                          <Button
                            aria-label={`Remove ${member.email ?? member.id}`}
                            className={cn(
                              "text-copy-muted hover:text-state-error",
                              isRemovingId === member.id &&
                                "pointer-events-none opacity-50"
                            )}
                            disabled={isRemovingId === member.id}
                            onClick={() => void removeCollaborator(member.id)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>
      </EditorDialogContent>
    </Dialog>
  );
}
