import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useConnectionLogger, type LogLevel } from "./useConnectionLogger";

type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "connecting"
  | "retrying";

type ConnectionError = {
  code: string;
  message: string;
  timestamp: string;
  retryCount: number;
};

type TestConnectionResult = {
  success: boolean;
  error?: string;
  code?: string;
  shouldRetry?: boolean;
};

interface ToolConnection {
  id: string;
  status: ConnectionStatus;
  lastActive?: string;
  error?: ConnectionError;
  retryCount: number;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useToolConnection() {
  const [connections, setConnections] = useState<
    Record<string, ToolConnection>
  >({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const retryTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const { addLog } = useConnectionLogger();

  // Memoize the update function to avoid dependency issues
  const updateConnectionStatus = useCallback(
    (
      toolId: string,
      status: ConnectionStatus,
      error?: Partial<ConnectionError>
    ) => {
      setConnections((prev) => {
        const current = prev[toolId] || { id: toolId, retryCount: 0 };
        const retryCount =
          status === "retrying" ? (current.retryCount || 0) + 1 : 0;

        // Add log entry for status changes
        if (current.status !== status) {
          const logLevel: LogLevel =
            status === "error"
              ? "error"
              : status === "connected"
              ? "success"
              : "info";

          addLog(toolId, `Connection status changed to ${status}`, logLevel, {
            previousStatus: current.status,
            error,
          });
        }

        return {
          ...prev,
          [toolId]: {
            ...current,
            id: toolId,
            status,
            lastActive:
              status === "connected"
                ? new Date().toISOString()
                : current.lastActive,
            error: error
              ? {
                  code: error.code || "UNKNOWN_ERROR",
                  message: error.message || "An unknown error occurred",
                  timestamp: new Date().toISOString(),
                  retryCount,
                }
              : undefined,
            retryCount,
          },
        };
      });
    },
    [addLog]
  );

  // Test connection for a tool
  const testConnection = useCallback(
    async (
      toolId: string,
      toolData: {
        name: string;
        connectionType: string;
        endpoint: string;
        authMethod: string;
        [key: string]: unknown;
      },
      attempt = 1
    ): Promise<TestConnectionResult> => {
      // Clear any existing retry timeout
      if (retryTimeouts.current[toolId]) {
        clearTimeout(retryTimeouts.current[toolId]);
        delete retryTimeouts.current[toolId];
      }

      setIsLoading((prev) => ({ ...prev, [toolId]: true }));
      updateConnectionStatus(toolId, attempt > 1 ? "retrying" : "connecting");

      try {
        toast({
          title:
            attempt > 1
              ? `Retrying connection (${attempt})...`
              : "Testing connection...",
          description: `Connecting to ${toolData.name}`,
        });

        const response = await fetch("/api/tools/test-connection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolData),
        });

        const result = await response.json();

        if (!response.ok) {
          const error = new Error(
            result.error || "Connection test failed"
          ) as Error & { code?: string };
          error.code = result.code || "CONNECTION_FAILED";
          throw error;
        }

        toast({
          title: "Connection successful",
          description: `Successfully connected to ${toolData.name}`,
        });

        updateConnectionStatus(toolId, "connected");
        return { success: true };
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        const errorCode = err.code || "UNKNOWN_ERROR";
        const errorMessage = err.message || "Connection test failed";

        updateConnectionStatus(toolId, "error", {
          code: errorCode,
          message: errorMessage,
          timestamp: new Date().toISOString(),
          retryCount: attempt - 1,
        });

        // Determine if we should retry
        const shouldRetry =
          attempt < MAX_RETRY_ATTEMPTS &&
          errorCode !== "INVALID_CREDENTIALS" &&
          errorCode !== "INVALID_ENDPOINT";

        if (shouldRetry) {
          // Schedule a retry
          const timeoutId = setTimeout(() => {
            testConnection(toolId, toolData, attempt + 1);
          }, RETRY_DELAY * attempt);

          // Store timeout ID for cleanup
          retryTimeouts.current[toolId] = timeoutId;

          toast({
            title: "Connection failed - Retrying...",
            description: `${errorMessage} (Attempt ${attempt}/${MAX_RETRY_ATTEMPTS})`,
            variant: "destructive",
          });
        } else {
          // Final error
          toast({
            title: "Connection failed",
            description: `${errorMessage}${
              attempt > 1 ? ` (after ${attempt} attempts)` : ""
            }`,
            variant: "destructive",
          });
        }

        return {
          success: false,
          error: errorMessage,
          code: errorCode,
          shouldRetry,
        };
      } finally {
        setIsLoading((prev) => ({ ...prev, [toolId]: false }));
      }
    },
    [updateConnectionStatus]
  );

  // Get connection status for a tool
  const getConnectionStatus = useCallback(
    (toolId: string): ToolConnection => {
      return (
        connections[toolId] || {
          id: toolId,
          status: "disconnected" as const,
          retryCount: 0,
        }
      );
    },
    [connections]
  );

  // Check if a connection is currently being tested
  const isConnectionLoading = useCallback(
    (toolId: string): boolean => {
      return !!isLoading[toolId];
    },
    [isLoading]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = retryTimeouts.current;
    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return {
    connections,
    updateConnectionStatus,
    testConnection,
    getConnectionStatus,
    isConnectionLoading,
  };
}
