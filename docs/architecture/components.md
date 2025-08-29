# **Components**

### **Frontend Components**

#### **Core Components**

**MCPDashboard** (apps/web/src/components/mcp/)

- **Responsibility**: MCP tool management interface
- **Key Interfaces**:
  - `useMCPTools()` hook for state management
  - `MCPConnectionTester` for connection validation
- **Dependencies**: Zustand store, Supabase realtime
- **Technology**: React 18, Tailwind, shadcn/ui

**AgentChat** (apps/web/src/components/agent/)

- **Responsibility**: Conversational AI interface
- **Key Interfaces**:
  - `useAgentChat()` hook for conversation state
  - `MessageRenderer` for displaying messages
- **Dependencies**: Vercel AI SDK, WebSocket connection
- **Technology**: React 18, Vercel AI SDK, TypeScript

**ApplicationGallery** (apps/web/src/components/gallery/)

- **Responsibility**: Application browsing and management
- **Key Interfaces**:
  - `useApplications()` hook for app data
  - `AppPreview` component for live previews
- **Dependencies**: Supabase queries, CDN for previews
- **Technology**: React 18, Tailwind, shadcn/ui

### **Backend Services**

#### **MCP Service** (apps/server/src/services/mcp.ts)

- **Responsibility**: MCP tool management and debugging
- **Key Interfaces**:
  - `connectMCP(config: MCPToolConfig)`
  - `testConnection(toolId: string)`
  - `getToolLogs(toolId: string)`
- **Dependencies**: MCP client libraries, WebSocket server
- **Technology**: Deno, TypeScript, WebSocket

#### **API Router Service** (apps/server/src/services/api-router.ts)

- **Responsibility**: AI API key management and routing
- **Key Interfaces**:
  - `storeAPIKey(service: string, key: string)`
  - `routeRequest(service: string, request: any)`
  - `validateUsage(keyId: string)`
- **Dependencies**: Encryption library, rate limiting
- **Technology**: Deno, TypeScript, Supabase

#### **Application Generator** (apps/server/src/services/app-generator.ts)

- **Responsibility**: Generate applications from conversations
- **Key Interfaces**:
  - `generateApp(prompt: string, tools: string[])`
  - `validateApp(html: string)`
  - `createShareLink(appId: string)`
- **Dependencies**: AI SDK, HTML validation
- **Technology**: Deno, Vercel AI SDK, TypeScript

### **CLI Components**

#### **MCPToolCommand** (apps/cli/src/commands/mcp.ts)

- **Responsibility**: MCP tool debugging in CLI
- **Key Interfaces**:
  - `connectTool(config: MCPToolConfig)`
  - `debugTool(toolId: string)`
  - `listTools()`
- **Dependencies**: MCP client, terminal UI
- **Technology**: Deno, TypeScript, terminal libraries
