"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

   interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function EmptyProjectState({ label }: { label: string }) {
  return (
    <div className="flex min-h-56 flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/40 px-6 text-center">
      <p className="text-sm text-copy-muted">{label}</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      tabIndex={isOpen ? undefined : -1}
      className={cn(
        "fixed bottom-4 left-4 top-18 z-30 flex w-80 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur transition duration-200 ease-out",
        isOpen
          ? "translate-x-0 opacity-100"
          : "pointer-events-none -translate-x-[calc(100%+1rem)] opacity-0",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-copy-primary">Projects</h2>
        <Button
          aria-label="Close project sidebar"
          onClick={onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs className="min-h-0 flex-1" defaultValue="my-projects">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-projects">My projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-3 flex" value="my-projects">
          <EmptyProjectState label="No projects yet." />
        </TabsContent>
        <TabsContent className="mt-3 flex" value="shared">
          <EmptyProjectState label="No shared projects yet." />
        </TabsContent>
      </Tabs>

      <Button className="mt-4 w-full" type="button">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </aside>
  );
}
 