"use client";

import { UserButton } from "@clerk/nextjs";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  centerContent?: React.ReactNode;
  projectName?: string;
  onShareClick?: () => void;
  isAiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  className?: string;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  centerContent,
  projectName,
  onShareClick,
  isAiSidebarOpen,
  onToggleAiSidebar,
  className,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;
  const isWorkspace = projectName !== undefined;

  return (
    <header
      className={cn(
        "editor-navbar flex h-navbar min-h-navbar shrink-0 items-center justify-between border-b border-surface-border bg-surface px-4",
        className
      )}
      style={{ height: "var(--navbar-height)", minHeight: "var(--navbar-height)" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Button
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          className="text-copy-muted hover:bg-subtle hover:text-copy-secondary"
          onClick={onToggleSidebar}
          size="icon"
          type="button"
          variant="ghost"
        >
          <SidebarIcon className="h-4 w-4" />
        </Button>

        {isWorkspace ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-copy-primary">
              {projectName}
            </p>
            <p className="text-xs leading-tight text-copy-muted">Workspace</p>
          </div>
        ) : centerContent ? (
          <div className="min-w-0 truncate text-sm font-medium text-copy-secondary">
            {centerContent}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {isWorkspace ? (
          <>
            <Button
              aria-label="Share project"
              className="rounded-full bg-subtle px-3 text-copy-secondary hover:bg-elevated hover:text-copy-primary"
              onClick={onShareClick}
              size="default"
              type="button"
              variant="ghost"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
              aria-pressed={isAiSidebarOpen}
              className={cn(
                "rounded-full px-3.5 font-medium",
                isAiSidebarOpen && "ring-2 ring-brand/30 ring-offset-1 ring-offset-surface"
              )}
              onClick={onToggleAiSidebar}
              size="default"
              type="button"
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        ) : null}
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 32,
                width: 32,
              },
            },
          }}
        />
      </div>
    </header>
  );
}
