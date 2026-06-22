"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CanvasConnectionContextValue {
  localSelectedNodeId: string | null;
  setLocalSelectedNodeId: (nodeId: string | null) => void;
  isConnecting: boolean;
  connectingFromNodeId: string | null;
  startConnecting: (nodeId: string) => void;
  stopConnecting: () => void;
}

const CanvasConnectionContext =
  createContext<CanvasConnectionContextValue | null>(null);

export function CanvasConnectionProvider({ children }: { children: ReactNode }) {
  const [localSelectedNodeId, setLocalSelectedNodeId] = useState<string | null>(
    null
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFromNodeId, setConnectingFromNodeId] = useState<
    string | null
  >(null);

  const startConnecting = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectingFromNodeId(nodeId);
  }, []);

  const stopConnecting = useCallback(() => {
    setIsConnecting(false);
    setConnectingFromNodeId(null);
  }, []);

  const value = useMemo(
    () => ({
      localSelectedNodeId,
      setLocalSelectedNodeId,
      isConnecting,
      connectingFromNodeId,
      startConnecting,
      stopConnecting,
    }),
    [
      localSelectedNodeId,
      isConnecting,
      connectingFromNodeId,
      startConnecting,
      stopConnecting,
    ]
  );

  return (
    <CanvasConnectionContext.Provider value={value}>
      {children}
    </CanvasConnectionContext.Provider>
  );
}

export function useCanvasConnection(): CanvasConnectionContextValue {
  const context = useContext(CanvasConnectionContext);
  if (!context) {
    throw new Error(
      "useCanvasConnection must be used within CanvasConnectionProvider"
    );
  }
  return context;
}
