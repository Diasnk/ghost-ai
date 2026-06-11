"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiSidebarPlaceholderProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AiSidebarPlaceholder({
  isOpen,
  onClose,
  className,
}: AiSidebarPlaceholderProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      tabIndex={isOpen ? undefined : -1}
      className={cn(
        "fixed bottom-4 right-4 top-18 z-30 flex w-80 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur transition duration-200 ease-out",
        isOpen
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-[calc(100%+1rem)] opacity-0",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-copy-primary">AI Assistant</h2>
        <Button
          aria-label="Close AI sidebar"
          onClick={onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex min-h-56 flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/40 px-6 text-center">
        <p className="text-sm text-copy-muted">AI chat coming soon</p>
      </div>
    </aside>
  );
}
