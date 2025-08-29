# **Error Handling Strategy**

### **General Approach**

- **Error Model**: Typed errors with consistent structure
- **Exception Hierarchy**: Business errors vs system errors
- **Error Propagation**: Graceful degradation with user-friendly messages

### **Logging Standards**

**Library**: Built-in Deno logging for server, browser console for frontend
**Format**: JSON structured logs with correlation IDs
**Levels**: ERROR, WARN, INFO, DEBUG

**Required Context**:

- Correlation ID: UUID per request
- Service Context: Component, function, user ID
- User Context: User ID, session ID (no sensitive data)

### **Error Handling Patterns**

#### **External API Errors**

- **Retry Policy**: 3 attempts with exponential backoff (1s, 2s, 4s)
- **Circuit Breaker**: Open after 5 consecutive failures
- **Timeout Configuration**: 30s for MCP tools, 10s for AI APIs
- **Error Translation**: User-friendly messages for API failures

#### **Business Logic Errors**

- **Custom Exceptions**: `MCPError`, `APIKeyError`, `ValidationError`
- **User-Facing Errors**: Clear action items for resolution
- **Error Codes**: Consistent error codes for debugging

#### **Data Consistency**

- **Transaction Strategy**: Supabase RLS for data integrity
- **Compensation Logic**: Rollback on failed operations
- **Idempotency**: UUID-based request deduplication
