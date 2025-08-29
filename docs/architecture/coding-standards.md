# **Coding Standards**

### **Critical Fullstack Rules**

1. **Type Safety**: All boundaries use shared types from `packages/shared`
2. **Error Handling**: Never expose sensitive data in errors
3. **API Consistency**: All endpoints return standardized response format
4. **Security**: All inputs validated with Zod schemas
5. **Performance**: Cache expensive operations with TTL
6. **Testing**: Write tests for all business logic
7. **Logging**: Include correlation IDs in all logs

### **Naming Conventions**

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `MCPDashboard.tsx` |
| API Routes | kebab-case | kebab-case | `/api/mcp-tools` |
| Database Tables | - | snake_case | `mcp_tools` |
| Files | camelCase | camelCase | `mcpService.ts` |
| Variables | camelCase | camelCase | `mcpToolStatus` |

### **Security Requirements**

#### **Input Validation**

- **Library**: Zod for schema validation
- **Location**: API boundary before processing
- **Required Rules**:
  - All external inputs MUST be validated
  - Validation at API boundary before processing
  - Whitelist approach preferred over blacklist

#### **Authentication & Authorization**

- **Auth Method**: Supabase Auth with JWT
- **Session Management**: JWT tokens with 24h expiration
- **Required Patterns**:
  - Row-level security for all user data
  - API key encryption with AES-256
  - Rate limiting per user

#### **Secrets Management**

- **Development**: `.env` files (never committed)
- **Production**: Vercel environment variables
- **Code Requirements**:
  - NEVER hardcode secrets
  - Access via configuration service only
  - No secrets in logs or error messages

#### **API Security**

- **Rate Limiting**: 100 requests per minute per user
- **CORS Policy**: Restricted to known origins
- **Security Headers**: All standard security headers via Next.js

#### **Data Protection**

- **Encryption at Rest**: Supabase built-in encryption
- **Encryption in Transit**: HTTPS everywhere
- **PII Handling**: Minimal PII collection, encrypted storage
