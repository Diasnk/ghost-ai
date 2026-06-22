"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";

interface CanvasRoomProps {
  roomId: string;
  children: ReactNode;
}

interface CanvasErrorBoundaryProps {
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Liveblocks canvas connection error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-base px-6 text-center">
          <p className="text-sm text-copy-secondary">
            Unable to connect to the collaborative canvas.
          </p>
          <Link className="text-sm font-medium text-brand hover:underline" href="/editor">
            Back to editor
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

function CanvasLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Loading canvas…</p>
    </div>
  );
}

export function CanvasRoom({ roomId, children }: CanvasRoomProps) {
  return (
    <div className="h-full w-full">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{
            cursor: null,
            isThinking: false,
          }}
        >
          <CanvasErrorBoundary>
            <ClientSideSuspense fallback={<CanvasLoadingFallback />}>
              {children}
            </ClientSideSuspense>
          </CanvasErrorBoundary>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  );
}
