"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { CanvasTemplate } from "@/components/editor/starter-templates";

type TemplateImportHandler = (template: CanvasTemplate) => void;

interface StarterTemplatesContextValue {
  isOpen: boolean;
  isImportReady: boolean;
  openModal: () => void;
  closeModal: () => void;
  requestImport: (template: CanvasTemplate) => boolean;
  registerImportHandler: (handler: TemplateImportHandler | null) => void;
}

const StarterTemplatesContext =
  createContext<StarterTemplatesContextValue | null>(null);

export function StarterTemplatesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImportReady, setIsImportReady] = useState(false);
  const importHandlerRef = useRef<TemplateImportHandler | null>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const registerImportHandler = useCallback(
    (handler: TemplateImportHandler | null) => {
      importHandlerRef.current = handler;
      setIsImportReady(handler !== null);
    },
    []
  );

  const requestImport = useCallback((template: CanvasTemplate) => {
    if (!importHandlerRef.current) {
      return false;
    }

    importHandlerRef.current(template);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      isImportReady,
      openModal,
      closeModal,
      requestImport,
      registerImportHandler,
    }),
    [
      closeModal,
      isImportReady,
      isOpen,
      openModal,
      registerImportHandler,
      requestImport,
    ]
  );

  return (
    <StarterTemplatesContext.Provider value={value}>
      {children}
    </StarterTemplatesContext.Provider>
  );
}

export function useStarterTemplates(): StarterTemplatesContextValue {
  const context = useContext(StarterTemplatesContext);

  if (!context) {
    throw new Error(
      "useStarterTemplates must be used within StarterTemplatesProvider"
    );
  }

  return context;
}
