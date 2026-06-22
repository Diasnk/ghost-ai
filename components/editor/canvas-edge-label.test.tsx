// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CanvasEdgeLabel } from "@/components/editor/canvas-edge-label";

const updateEdge = vi.fn();

vi.mock("@xyflow/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@xyflow/react")>();
  return {
    ...actual,
    useReactFlow: () => ({ updateEdge }),
  };
});

function renderEdgeLabel({
  edgeId = "edge-1",
  label = "",
  selected = false,
}: {
  edgeId?: string;
  label?: string;
  selected?: boolean;
} = {}) {
  return render(
    <ReactFlowProvider>
      <CanvasEdgeLabel edgeId={edgeId} label={label} selected={selected} />
    </ReactFlowProvider>
  );
}

describe("CanvasEdgeLabel", () => {
  afterEach(() => {
    cleanup();
    updateEdge.mockReset();
  });

  it("shows a faint hint when selected and label is empty", () => {
    renderEdgeLabel({ selected: true });

    expect(screen.getByText("Add label…")).toBeTruthy();
  });

  it("opens inline editing on double-click and updates label via updateEdge", () => {
    renderEdgeLabel({ label: "Flow" });

    fireEvent.doubleClick(screen.getByText("Flow"));

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.className).toContain("field-sizing-content");

    fireEvent.change(input, { target: { value: "Updated" } });
    expect(updateEdge).toHaveBeenCalled();
  });

  it("closes inline editing on Enter", () => {
    renderEdgeLabel({ label: "Flow" });

    fireEvent.doubleClick(screen.getByText("Flow"));
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByText("Flow")).toBeTruthy();
  });

  it("closes inline editing on Escape", () => {
    renderEdgeLabel({ label: "Flow" });

    fireEvent.doubleClick(screen.getByText("Flow"));
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByText("Flow")).toBeTruthy();
  });

  it("uses nodrag and nopan guards on the label container", () => {
    renderEdgeLabel({ label: "Flow" });

    const container = screen.getByText("Flow").parentElement;
    expect(container?.className).toContain("nodrag");
    expect(container?.className).toContain("nopan");
    expect(container?.className).toContain("nowheel");
  });
});
