import { currentUser } from "@clerk/nextjs/server";

import { EditorLayout } from "@/components/editor/editor-layout";
import { getEditorProjectLists } from "@/lib/projects";

export default async function EditorRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const userId = user?.id ?? "";
  const email = user?.primaryEmailAddress?.emailAddress;

  const { owned, shared } = await getEditorProjectLists(userId, email);
  const initialProjects = [...owned, ...shared];

  return (
    <EditorLayout initialProjects={initialProjects}>{children}</EditorLayout>
  );
}
