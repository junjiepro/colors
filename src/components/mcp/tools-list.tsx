'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ToolForm } from './tool-form';
import { useToolConnection } from '@/hooks/useToolConnection';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Tool = {
  id: string;
  name: string;
  connectionType: 'http' | 'stdio';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting' | 'retrying';
  lastActive?: string;
  authMethod?: 'none' | 'basic' | 'token' | 'api_key';
  retryCount?: number;
  error?: {
    code: string;
    message: string;
    timestamp: string;
    retryCount: number;
  };
};

// Helper function to format last active time
const formatLastActive = (timestamp?: string): string => {
  if (!timestamp) return 'Never';
  return new Date(timestamp).toLocaleString();
};


export function ToolsList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  // Use the tool connection hook
  const {
    testConnection,
    getConnectionStatus,
    isConnectionLoading,
  } = useToolConnection();

  // Mock data - replace with actual data from your API
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Local MCP Server',
      connectionType: 'http',
      endpoint: 'http://localhost:3000',
      status: 'connected',
      lastActive: new Date().toISOString(),
      authMethod: 'none',
    },
    {
      id: '2',
      name: 'Production MCP',
      connectionType: 'http',
      endpoint: 'https://api.example.com/mcp',
      status: 'disconnected',
      lastActive: '2023-05-14T09:15:00Z',
      authMethod: 'api_key',
    },
  ]);

  const handleAddTool = () => {
    setEditingTool(null);
    setIsDialogOpen(true);
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setIsDialogOpen(true);
  };

  const handleDeleteTool = (id: string) => {
    // TODO: Implement delete functionality
    setTools(tools.filter((tool) => tool.id !== id));
  };

  // Save tool implementation is used in the ToolForm component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSaveTool = useCallback(
    (toolData: Omit<Tool, 'id' | 'status' | 'lastActive'>) => {
      if (editingTool) {
        // Update existing tool
        setTools(
          tools.map((t) =>
            t.id === editingTool.id
              ? { ...t, ...toolData, status: t.status, lastActive: t.lastActive }
              : t
          )
        );
      } else {
        // Add new tool
        setTools([
          ...tools,
          {
            ...toolData,
            id: Date.now().toString(),
            status: 'disconnected',
            lastActive: undefined,
          },
        ]);
      }
      setIsDialogOpen(false);
    },
    [editingTool, tools]
  );

  const handleTestConnection = async (tool: Tool) => {
    try {
      const { success, error } = await testConnection(tool.id, {
        name: tool.name,
        connectionType: tool.connectionType,
        endpoint: tool.endpoint,
        authMethod: tool.authMethod || 'none',
      });

      if (!success) {
        console.error('Connection test failed:', error);
        toast({
          title: 'Connection failed',
          description: error || 'Failed to connect to the tool',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while testing the connection',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (tool: Tool) => {
    const connection = getConnectionStatus(tool.id);
    const status = connection.status;
    const isLoading = isConnectionLoading(tool.id);

    if (isLoading) {
      return (
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
          <Badge variant="outline">Testing...</Badge>
        </div>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            <Badge variant="destructive">Error</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-gray-400 mr-2" />
            <Badge variant="outline">Disconnected</Badge>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">MCP Tools</h2>
          <p className="text-muted-foreground">
            Manage your connected MCP tools and configurations
          </p>
        </div>
        <Button onClick={handleAddTool}>
          <Zap className="mr-2 h-4 w-4" />
          Add New Tool
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Authentication</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.length > 0 ? (
              tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>{tool.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {tool.connectionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {tool.authMethod ? tool.authMethod.replace('_', ' ') : 'none'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(tool)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatLastActive(tool.lastActive)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleTestConnection(tool)}
                        disabled={isConnectionLoading(tool.id)}
                        title={
                          isConnectionLoading(tool.id) 
                            ? 'Testing connection...' 
                            : 'Test Connection'
                        }
                        className="relative"
                      >
                        {isConnectionLoading(tool.id) ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Zap 
                            className={`h-4 w-4 ${
                              getConnectionStatus(tool.id).status === 'connected' 
                                ? 'text-green-500' 
                                : getConnectionStatus(tool.id).status === 'error'
                                ? 'text-destructive'
                                : ''
                            }`} 
                            aria-hidden="true"
                          />
                        )}
                        <span className="sr-only">
                          {isConnectionLoading(tool.id) 
                            ? 'Testing connection...' 
                            : 'Test Connection'}
                        </span>
                        
                        {/* Connection status indicator */}
                        {!isConnectionLoading(tool.id) && (
                          <span 
                            className={`absolute -right-1 -top-1 h-2 w-2 rounded-full ${
                              getConnectionStatus(tool.id).status === 'connected' 
                                ? 'bg-green-500' 
                                : getConnectionStatus(tool.id).status === 'error'
                                ? 'bg-destructive'
                                : 'bg-muted-foreground'
                            }`}
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditTool(tool)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => tool.id && handleDeleteTool(tool.id)}
                        aria-label="Delete tool"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tools connected yet. Click &quot;Add New Tool&quot; to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTool ? 'Edit Tool' : 'Add New Tool'}
            </DialogTitle>
            <DialogDescription>
              {editingTool 
                ? 'Update the tool configuration.'
                : 'Configure a new MCP tool connection.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ToolForm 
              initialData={editingTool || undefined}
              onSuccess={() => {
                setIsDialogOpen(false);
                // Refresh the tools list or update state as needed
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
