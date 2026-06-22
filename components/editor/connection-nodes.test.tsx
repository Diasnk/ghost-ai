// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CanvasConnectionProvider, useCanvasConnection } from "@/components/editor/canvas-connection-context";
import { ConnectionNodes } from "@/components/editor/connection-nodes";

vi.mock("@xyflow/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@xyflow/react")>();
  return {
    ...actual,
    useStore: (
      selector: (state: { transform: [number, number, number] }) => unknown
    ) => selector({ transform: [0, 0, 1] }),
    Handle: ({
      children,
      className,
      style,
      "aria-label": ariaLabel,
    }: {
      children?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      "aria-label"?: string;
    }) => (
      <div
        aria-label={ariaLabel}
        className={className}
        data-testid="connection-handle"
        style={style}
      >
        {children}
      </div>
    ),
  };
});

function StartConnectingOnMount({ nodeId }: { nodeId: string }) {
  const { startConnecting } = useCanvasConnection();

  useEffect(() => {
    startConnecting(nodeId);
  }, [nodeId, startConnecting]);

  return null;
}

function renderConnectionNodes({
  nodeId,
  connectingFromNodeId = null,
}: {
  nodeId: string;
  connectingFromNodeId?: string | null;
}) {
  return render(
    <ReactFlowProvider>
      <CanvasConnectionProvider>
        {connectingFromNodeId ? (
          <StartConnectingOnMount nodeId={connectingFromNodeId} />
        ) : null}
        <div className="group" data-testid="node-group">
          <ConnectionNodes
            height={80}
            nodeId={nodeId}
            shape="rectangle"
            width={160}
          />
        </div>
      </CanvasConnectionProvider>
    </ReactFlowProvider>
  );
}

describe("ConnectionNodes", () => {
  afterEach(() => {
    cleanup();
  });

  it("reveals interactive handles on node hover", () => {
    renderConnectionNodes({ nodeId: "node-a" });

    const group = screen.getByTestId("node-group");
    const handles = screen.getAllByTestId("connection-handle");
    expect(handles.every((handle) => handle.className.includes("pointer-events-none"))).toBe(
      true
    );

    fireEvent.mouseEnter(group);

    expect(handles.some((handle) => handle.className.includes("group-hover:pointer-events-auto"))).toBe(
      true
    );
    expect(screen.getAllByLabelText("Connect from top").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Connect from right").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Connect from bottom").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Connect from left").length).toBeGreaterThan(0);
  });

  it("forces handles visible while another node is connecting", () => {
    renderConnectionNodes({ nodeId: "node-a", connectingFromNodeId: "node-b" });

    const handles = screen.getAllByTestId("connection-handle");
    expect(handles.every((handle) => handle.className.includes("pointer-events-auto"))).toBe(
      true
    );
    expect(handles.every((handle) => handle.className.includes("opacity-100"))).toBe(
      true
    );
  });
});
