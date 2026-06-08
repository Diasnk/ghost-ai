"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EditorDialogContent } from "@/components/editor/editor-dialog";
import { useEditorProjects } from "@/components/editor/editor-projects-context";

export function DeleteProjectDialog() {
  const {
    activeDialog,
    selectedProject,
    isLoading,
    closeDialog,
    handleDelete,
  } = useEditorProjects();

  const isOpen = activeDialog === "delete";

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
        title="Delete project"
        description={
          selectedProject
            ? `Are you sure you want to delete "${selectedProject.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this project? This action cannot be undone."
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
              disabled={isLoading}
              onClick={() => void handleDelete()}
              type="button"
              variant="destructive"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}
