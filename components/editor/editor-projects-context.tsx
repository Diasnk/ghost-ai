"use client";

import { createContext, useContext } from "react";

import {
  useProjectDialogs,
  type UseProjectDialogsReturn,
} from "@/hooks/use-project-dialogs";

const EditorProjectsContext = createContext<UseProjectDialogsReturn | null>(
  null
);

export function EditorProjectsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useProjectDialogs();

  return (
    <EditorProjectsContext.Provider value={value}>
      {children}
    </EditorProjectsContext.Provider>
  );
}

export function useEditorProjects(): UseProjectDialogsReturn {
  const context = useContext(EditorProjectsContext);

  if (!context) {
    throw new Error(
      "useEditorProjects must be used within an EditorProjectsProvider"
    );
  }

  return context;
}
