"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EditorDialogContent } from "@/components/editor/editor-dialog";
import { useEditorProjects } from "@/components/editor/editor-projects-context";

export function RenameProjectDialog() {
  const {
    activeDialog,
    selectedProject,
    formName,
    isLoading,
    setFormName,
    closeDialog,
    handleRename,
  } = useEditorProjects();

  const isOpen = activeDialog === "rename";
  const canSubmit =
    formName.trim().length > 0 &&
    formName.trim() !== selectedProject?.name &&
    !isLoading;

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
        title="Rename project"
        description={
          selectedProject
            ? `Rename "${selectedProject.name}"`
            : "Rename this project"
        }
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
              onClick={() => void handleRename()}
              type="button"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <Input
          autoFocus
          disabled={isLoading}
          onChange={(event) => setFormName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canSubmit) {
              event.preventDefault();
              void handleRename();
            }
          }}
          placeholder="Project name"
          value={formName}
        />
      </EditorDialogContent>
    </Dialog>
  );
}
