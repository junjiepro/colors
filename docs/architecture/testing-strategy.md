# **Testing Strategy**

### **Testing Philosophy**

- **Approach**: Test-driven development for critical paths
- **Coverage Goals**: 80% overall, 90% for business logic
- **Test Pyramid**: 70% unit, 20% integration, 10% e2e

### **Test Types and Organization**

#### **Unit Tests**

- **Framework**: Vitest (frontend), Deno Test (backend)
- **File Convention**: `*.test.ts` alongside source files
- **Location**: Within each package/app
- **Mocking Library**: MSW for API mocking
- **Coverage Requirement**: 80% for business logic

#### **Integration Tests**

- **Scope**: API endpoints, database operations
- **Location**: `apps/*/tests/integration/`
- **Test Infrastructure**:
  - **Database**: Supabase local development
  - **MCP**: Mock MCP servers
  - **AI APIs**: Mock AI responses

#### **E2E Tests**

- **Framework**: Playwright
- **Scope**: Critical user flows
- **Environment**: Preview deployments
- **Test Data**: Seeded test data

### **Test Examples**

#### **Frontend Component Test**

```typescript
// apps/web/src/components/mcp/MCPToolCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MCPToolCard } from './MCPToolCard';

describe('MCPToolCard', () => {
  it('displays connected status correctly', () => {
    render(<MCPToolCard tool={{ status: 'connected' }} />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });
});
```

#### **Backend API Test**

```typescript
// apps/server/src/routes/mcp-tools.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createMCPRoute } from "./mcp-tools.ts";

Deno.test("POST /api/mcp-tools creates new tool", async () => {
  const response = await createMCPRoute({
    method: "POST",
    body: { name: "test-tool", type: "server" }
  });
  assertEquals(response.status, 201);
});
```
