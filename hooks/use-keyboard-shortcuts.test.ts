// @vitest-environment jsdom

import { cleanup, fireEvent, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

function dispatchKeyDown(
  key: string,
  target: EventTarget = document.body,
  options: Partial<KeyboardEventInit> = {}
) {
  fireEvent.keyDown(target, {
    key,
    ...options,
  });
}

describe("useKeyboardShortcuts", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("calls zoom and history handlers for canvas shortcuts", () => {
    const zoomIn = vi.fn();
    const zoomOut = vi.fn();
    const undo = vi.fn();
    const redo = vi.fn();

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        zoomIn,
        zoomOut,
        undo,
        redo,
      })
    );

    dispatchKeyDown("+");
    dispatchKeyDown("=");
    dispatchKeyDown("-");
    dispatchKeyDown("z", document.body, { ctrlKey: true });
    dispatchKeyDown("z", document.body, { ctrlKey: true, shiftKey: true });
    dispatchKeyDown("y", document.body, { ctrlKey: true });

    expect(zoomIn).toHaveBeenCalledTimes(2);
    expect(zoomOut).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).toHaveBeenCalledTimes(2);

    unmount();
  });

  it("ignores shortcuts while typing in editable fields", () => {
    const zoomIn = vi.fn();
    const zoomOut = vi.fn();
    const undo = vi.fn();
    const redo = vi.fn();

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        zoomIn,
        zoomOut,
        undo,
        redo,
      })
    );

    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");

    document.body.append(input, textarea, editable);

    dispatchKeyDown("+", input);
    dispatchKeyDown("-", textarea);
    dispatchKeyDown("z", input, { ctrlKey: true });
    dispatchKeyDown("y", textarea, { ctrlKey: true });
    dispatchKeyDown("z", editable, { ctrlKey: true, shiftKey: true });

    input.remove();
    textarea.remove();
    editable.remove();
    unmount();

    expect(zoomIn).not.toHaveBeenCalled();
    expect(zoomOut).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
    expect(redo).not.toHaveBeenCalled();
  });
});
