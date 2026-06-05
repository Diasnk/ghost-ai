import { EditorLayout } from "@/components/editor/editor-layout";

export default function EditorPage() {
  return (
    <EditorLayout>
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-copy-muted">Select or create a project to begin.</p>
      </div>
    </EditorLayout>
  );
}
