import type { EditorProject } from "@/types/project";

export function sortEditorProjectsByCreatedAt(
  projects: EditorProject[]
): EditorProject[] {
  return [...projects].sort((a, b) => {
    const aTime = Date.parse(a.createdAt) || 0;
    const bTime = Date.parse(b.createdAt) || 0;
    if (bTime !== aTime) {
      return bTime - aTime;
    }
    return b.id.localeCompare(a.id);
  });
}
