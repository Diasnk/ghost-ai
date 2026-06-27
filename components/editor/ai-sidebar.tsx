"use client";

import { Bot, X } from "lucide-react";

import { AiArchitectTab } from "@/components/editor/ai-architect-tab";
import { AiSpecsTab } from "@/components/editor/ai-specs-tab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AiSidebar({ isOpen, onClose, className }: AiSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      tabIndex={isOpen ? undefined : -1}
      className={cn(
        "fixed bottom-4 right-4 top-18 z-30 flex w-80 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-surface-border bg-base/95 p-4 shadow-2xl backdrop-blur transition duration-200 ease-out",
        isOpen
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-[calc(100%+1rem)] opacity-0",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-subtle">
            <Bot className="h-5 w-5 text-ai-text" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-copy-primary">AI Workspace</h2>
            <p className="text-xs text-copy-muted">Collaborate with Ghost AI</p>
          </div>
        </div>
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

      <Tabs
        className="flex min-h-0 flex-1 flex-col gap-3"
        defaultValue="architect"
      >
        <TabsList className="grid h-9 w-full grid-cols-2 bg-subtle/50 p-1">
          <TabsTrigger
            className="text-copy-muted data-active:bg-accent data-active:text-accent-foreground"
            value="architect"
          >
            AI Architect
          </TabsTrigger>
          <TabsTrigger
            className="text-copy-muted data-active:bg-accent data-active:text-accent-foreground"
            value="specs"
          >
            Specs
          </TabsTrigger>
        </TabsList>

        <TabsContent
          className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          value="architect"
        >
          <AiArchitectTab />
        </TabsContent>
        <TabsContent
          className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
          value="specs"
        >
          <AiSpecsTab />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
