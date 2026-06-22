"use client";

import { useEffect, useRef } from "react";

interface UseKeyboardShortcutsOptions {
  redo: () => void;
  undo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;

  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }

  if (target.isContentEditable) {
    return true;
  }

  return (
    target.closest("[contenteditable]:not([contenteditable='false'])") !== null
  );
}

export function useKeyboardShortcuts({
  redo,
  undo,
  zoomIn,
  zoomOut,
}: UseKeyboardShortcutsOptions) {
  const handlersRef = useRef({ redo, undo, zoomIn, zoomOut });

  useEffect(() => {
    handlersRef.current = { redo, undo, zoomIn, zoomOut };
  }, [redo, undo, zoomIn, zoomOut]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const { redo, undo, zoomIn, zoomOut } = handlersRef.current;
      const hasModifier = event.metaKey || event.ctrlKey;

      if (hasModifier && event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }

        return;
      }

      if (hasModifier && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
