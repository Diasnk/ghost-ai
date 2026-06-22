"use client";

import { EditorDialogContent } from "@/components/editor/editor-dialog";
import {
  CANVAS_TEMPLATES,
  type CanvasTemplate,
} from "@/components/editor/starter-templates";
import { useStarterTemplates } from "@/components/editor/starter-templates-context";
import { TemplateDiagramPreview } from "@/components/editor/template-diagram-preview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function StarterTemplatesModal() {
  const { isOpen, isImportReady, closeModal, requestImport } =
    useStarterTemplates();

  const handleImport = (template: CanvasTemplate) => {
    const didImport = requestImport(template);

    if (didImport) {
      closeModal();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <EditorDialogContent
        className="w-full max-w-3xl sm:max-w-3xl min-w-0 overflow-hidden [&>*]:min-w-0"
        description="Import a starter diagram to replace the current canvas."
        title="Starter templates"
      >
        <ScrollArea className="max-h-[min(70vh,560px)] pr-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CANVAS_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className="gap-0 overflow-hidden border-surface-border bg-surface py-0 ring-0"
              >
                <CardHeader className="gap-2 border-b border-surface-border px-4 py-3">
                  <CardTitle className="text-sm text-copy-primary">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-copy-muted">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center bg-base px-4 py-4">
                  <TemplateDiagramPreview
                    edges={template.edges}
                    nodes={template.nodes}
                  />
                </CardContent>
                <CardFooter className="border-t border-surface-border bg-surface px-4 py-3">
                  <Button
                    className="w-full"
                    disabled={!isImportReady}
                    onClick={() => handleImport(template)}
                    size="sm"
                    type="button"
                  >
                    Import
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </EditorDialogContent>
    </Dialog>
  );
}
