"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useOthers } from "@liveblocks/react/suspense";
import { useMemo } from "react";

import { getPresenceInitial } from "@/lib/presence-avatar";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_COLLABORATORS = 5;
const USER_BUTTON_APPEARANCE = {
  elements: {
    avatarBox: {
      height: 32,
      width: 32,
    },
  },
};

interface CollaboratorAvatarProps {
  avatarURL: string;
  name: string;
}

function CollaboratorAvatar({ avatarURL, name }: CollaboratorAvatarProps) {
  if (avatarURL) {
    return (
      <img
        alt=""
        className="size-8 shrink-0 rounded-full object-cover ring-2 ring-base"
        src={avatarURL}
      />
    );
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-copy-secondary ring-2 ring-base">
      {getPresenceInitial(name)}
    </div>
  );
}

interface CanvasPresenceAvatarsProps {
  className?: string;
}

export function CanvasPresenceAvatars({ className }: CanvasPresenceAvatarsProps) {
  const { userId } = useAuth();
  const others = useOthers();

  const collaborators = useMemo(
    () => others.filter((other) => other.id !== userId),
    [others, userId]
  );

  const visibleCollaborators = collaborators.slice(0, MAX_VISIBLE_COLLABORATORS);
  const overflowCount = collaborators.length - visibleCollaborators.length;

  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className={cn(
        "nodrag nopan nowheel flex items-center gap-2 rounded-full border border-surface-border bg-surface/95 px-2 py-1.5 shadow-2xl backdrop-blur",
        className
      )}
      onPointerDown={handlePointerDown}
    >
      {collaborators.length > 0 ? (
        <>
          <div className="pointer-events-none flex items-center">
            {visibleCollaborators.map((collaborator, index) => (
              <div
                className={cn(index > 0 && "-ml-2")}
                key={collaborator.connectionId}
              >
                <CollaboratorAvatar
                  avatarURL={collaborator.info.avatarURL}
                  name={collaborator.info.name}
                />
              </div>
            ))}
            {overflowCount > 0 ? (
              <div className="-ml-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-copy-secondary ring-2 ring-base">
                +{overflowCount}
              </div>
            ) : null}
          </div>
          <div aria-hidden className="h-6 w-px bg-surface-border" />
        </>
      ) : null}
      <UserButton appearance={USER_BUTTON_APPEARANCE} />
    </div>
  );
}
