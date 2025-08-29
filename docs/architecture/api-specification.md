# **API Specification**

### **REST API + WebSocket Endpoints**

#### **Authentication Endpoints**

```yaml
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session
```

#### **MCP Tool Management**

```yaml
GET    /api/mcp-tools           # List user's MCP tools
POST   /api/mcp-tools           # Add new MCP tool
GET    /api/mcp-tools/:id       # Get tool details
PUT    /api/mcp-tools/:id       # Update tool config
DELETE /api/mcp-tools/:id       # Remove tool
POST   /api/mcp-tools/:id/test  # Test connection
```

#### **API Key Management**

```yaml
GET    /api/api-keys            # List API keys
POST   /api/api-keys            # Add new API key
PUT    /api/api-keys/:id        # Update key settings
DELETE /api/api-keys/:id        # Remove API key
```

#### **Applications**

```yaml
GET    /api/applications        # Browse applications
POST   /api/applications        # Create new application
GET    /api/applications/:id    # Get application details
PUT    /api/applications/:id    # Update application
DELETE /api/applications/:id    # Remove application
POST   /api/applications/:id/share # Generate share link
```

#### **Agent Conversations**

```yaml
POST   /api/conversations       # Start new conversation
GET    /api/conversations       # List conversations
GET    /api/conversations/:id   # Get conversation
POST   /api/conversations/:id/message # Send message
```

#### **WebSocket Endpoints**

```yaml
ws://api/colors/mcp-debug/:tool_id  # Real-time MCP debugging
ws://api/colors/agent-chat/:conversation_id  # Streaming chat
```
