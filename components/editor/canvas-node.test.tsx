// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import {
  applyNodeChanges,
  ReactFlow,
  ReactFlowProvider,
  type NodeChange,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { CanvasNode } from "@/components/editor/canvas-node";
import {
  CanvasConnectionProvider,
  useCanvasConnection,
} from "@/components/editor/canvas-connection-context";
import { CANVAS_NODE_TYPE, type CanvasNode as CanvasNodeType } from "@/types/canvas";

function SelectNodeOnMount({ nodeId }: { nodeId: string }) {
  const { setLocalSelectedNodeId } = useCanvasConnection();

  useEffect(() => {
    setLocalSelectedNodeId(nodeId);
  }, [nodeId, setLocalSelectedNodeId]);

  return null;
}

function getNodeElement(nodeId = "node-a"): HTMLElement {
  const node = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`);
  if (!(node instanceof HTMLElement)) {
    throw new Error(`Node ${nodeId} not found`);
  }
  return node;
}

function StatefulCanvas({
  label,
  selected,
  locallySelect,
}: {
  label: string;
  selected: boolean;
  locallySelect: boolean;
}) {
  const [nodes, setNodes] = useState<CanvasNodeType[]>([
    {
      id: "node-a",
      type: CANVAS_NODE_TYPE,
      position: { x: 0, y: 0 },
      data: { label, color: "#1F1F1F", shape: "rectangle" },
      width: 160,
      height: 80,
      selected,
    },
  ]);

  const onNodesChange = useCallback((changes: NodeChange<CanvasNodeType>[]) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, []);

  return (
    <ReactFlowProvider>
      <CanvasConnectionProvider>
        {locallySelect ? <SelectNodeOnMount nodeId="node-a" /> : null}
        <ReactFlow
          nodes={nodes}
          nodeTypes={{ [CANVAS_NODE_TYPE]: CanvasNode }}
          onNodesChange={onNodesChange}
          proOptions={{ hideAttribution: true }}
        />
      </CanvasConnectionProvider>
    </ReactFlowProvider>
  );
}

function renderCanvasNode({
  label = "Hello",
  selected = true,
  locallySelect = true,
}: {
  label?: string;
  selected?: boolean;
  locallySelect?: boolean;
} = {}) {
  render(
    <StatefulCanvas
      label={label}
      locallySelect={locallySelect}
      selected={selected}
    />
  );
}

describe("CanvasNode", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders four connection handles on node hover", () => {
    renderCanvasNode({ locallySelect: false });

    const node = getNodeElement();
    expect(within(node).getByText("Hello")).toBeTruthy();

    fireEvent.mouseEnter(node);

    expect(screen.getByLabelText("Connect from top")).toBeTruthy();
    expect(screen.getByLabelText("Connect from right")).toBeTruthy();
    expect(screen.getByLabelText("Connect from bottom")).toBeTruthy();
    expect(screen.getByLabelText("Connect from left")).toBeTruthy();
  });

  it("shows resize controls when locally selected", () => {
    renderCanvasNode();

    const node = getNodeElement();
    expect(node.querySelectorAll(".react-flow__resize-control").length).toBeGreaterThan(0);
  });

  it("hides resize controls when not locally selected", () => {
    renderCanvasNode({ locallySelect: false });

    const node = getNodeElement();
    expect(node.querySelectorAll(".react-flow__resize-control")).toHaveLength(0);
  });

  it("shows placeholder text when label is empty", () => {
    renderCanvasNode({ label: "" });

    const node = getNodeElement();
    expect(within(node).getByText("Add label…")).toBeTruthy();
  });

  it("opens inline editing on double-click and updates label as user types", () => {
    renderCanvasNode({ label: "Hello" });

    const node = getNodeElement();
    fireEvent.doubleClick(within(node).getByText("Hello"));

    const textarea = within(node).getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();
    expect(textarea.className).toContain("nodrag");
    expect(textarea.className).toContain("nopan");

    fireEvent.change(textarea, { target: { value: "Updated" } });
    expect(within(node).getByDisplayValue("Updated")).toBeTruthy();
  });

  it("closes inline editing on Escape", () => {
    renderCanvasNode({ label: "Hello" });

    const node = getNodeElement();
    fireEvent.doubleClick(within(node).getByText("Hello"));
    const textarea = within(node).getByRole("textbox");
    fireEvent.keyDown(textarea, { key: "Escape" });

    expect(within(node).queryByRole("textbox")).toBeNull();
    expect(within(node).getByText("Hello")).toBeTruthy();
  });

  it("closes inline editing on blur", () => {
    renderCanvasNode({ label: "Hello" });

    const node = getNodeElement();
    fireEvent.doubleClick(within(node).getByText("Hello"));
    const textarea = within(node).getByRole("textbox");
    fireEvent.blur(textarea);

    expect(within(node).queryByRole("textbox")).toBeNull();
    expect(within(node).getByText("Hello")).toBeTruthy();
  });

  it("shows color toolbar with eight swatches when locally selected", () => {
    renderCanvasNode();

    const swatches = screen.getAllByRole("button", { name: /^Set node color / });
    expect(swatches).toHaveLength(8);
    expect(swatches[0]?.className).toContain("nodrag");
    expect(swatches[0]?.className).toContain("nopan");
  });

  it("hides color toolbar when not locally selected", () => {
    renderCanvasNode({ locallySelect: false });

    expect(screen.queryAllByRole("button", { name: /^Set node color / })).toHaveLength(
      0
    );
  });

  it("updates node fill and paired text color when a swatch is selected", () => {
    renderCanvasNode({ label: "Hello" });

    fireEvent.click(screen.getByLabelText("Set node color blue"));

    const node = getNodeElement();
    const label = within(node).getByText("Hello");
    expect(label.style.color).toBe("rgb(82, 168, 255)");
    expect(screen.getByLabelText("Set node color blue").getAttribute("aria-pressed")).toBe(
      "true"
    );
  });
});
