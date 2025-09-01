import { useState, useCallback } from 'react';

export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface ConnectionLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  toolId: string;
  details?: unknown;
}

interface UseConnectionLoggerProps {
  maxLogs?: number;
}

export function useConnectionLogger({ maxLogs = 1000 }: UseConnectionLoggerProps = {}) {
  const [logs, setLogs] = useState<ConnectionLog[]>([]);

  const addLog = useCallback((
    toolId: string,
    message: string,
    level: LogLevel = 'info',
    details?: unknown
  ) => {
    setLogs(prevLogs => {
      const newLog: ConnectionLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        toolId,
        level,
        message,
        details
      };
      
      // Keep only the most recent logs up to maxLogs
      return [newLog, ...prevLogs].slice(0, maxLogs);
    });
  }, [maxLogs]);

  const getToolLogs = useCallback((toolId: string) => {
    return logs.filter(log => log.toolId === toolId);
  }, [logs]);

  const clearLogs = useCallback((toolId?: string) => {
    if (toolId) {
      setLogs(prev => prev.filter(log => log.toolId !== toolId));
    } else {
      setLogs([]);
    }
  }, []);

  return {
    logs,
    addLog,
    getToolLogs,
    clearLogs
  };
}
