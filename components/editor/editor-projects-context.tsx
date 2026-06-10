"use client";

import { createContext, useContext } from "react";

import {
  useProjectActions,
  type UseProjectActionsReturn,
} from "@/hooks/use-project-actions";
import type { EditorProject } from "@/types/project";

const EditorProjectsContext = createContext<UseProjectActionsReturn | null>(
  null
);

export function EditorProjectsProvider({
  children,
  initialProjects,
}: {
  children: React.ReactNode;
  initialProjects: EditorProject[];
}) {
  const value = useProjectActions(initialProjects);

  return (
    <EditorProjectsContext.Provider value={value}>
      {children}
    </EditorProjectsContext.Provider>
  );
}

export function useEditorProjects(): UseProjectActionsReturn {
  const context = useContext(EditorProjectsContext);

  if (!context) {
    throw new Error(
      "useEditorProjects must be used within an EditorProjectsProvider"
    );
  }

  return context;
}
