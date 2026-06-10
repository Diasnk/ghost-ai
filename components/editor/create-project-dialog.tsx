"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EditorDialogContent } from "@/components/editor/editor-dialog";
import { useEditorProjects } from "@/components/editor/editor-projects-context";

export function CreateProjectDialog() {
  const {
    activeDialog,
    formName,
    isLoading,
    roomIdPreview,
    setFormName,
    closeDialog,
    handleCreate,
  } = useEditorProjects();

  const isOpen = activeDialog === "create";
  const canSubmit = formName.trim().length > 0 && !isLoading;

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
        title="Create project"
        description="Give your architecture workspace a name."
        footerActions={
          <>
            <Button
              disabled={isLoading}
              onClick={closeDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!canSubmit}
              onClick={() => void handleCreate()}
              type="button"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            autoFocus
            disabled={isLoading}
            onChange={(event) => setFormName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canSubmit) {
                event.preventDefault();
                void handleCreate();
              }
            }}
            placeholder="Project name"
            value={formName}
          />
          <p className="text-sm text-copy-muted">
            Room ID: {roomIdPreview || "your-project-id"}
          </p>
        </div>
      </EditorDialogContent>
    </Dialog>
  );
}
