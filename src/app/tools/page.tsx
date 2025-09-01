import { ToolsList } from '@/components/mcp/tools-list';

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">MCP Tools Management</h1>
          <p className="text-muted-foreground">
            Connect and manage your MCP tools for seamless integration
          </p>
        </div>
        
        <ToolsList />
      </div>
    </div>
  );
}
