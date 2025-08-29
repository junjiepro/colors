# **REST API Specification**

```yaml
openapi: 3.0.0
info:
  title: Colors API
  version: 1.0.0
  description: AI-powered MCP management and application sharing platform

servers:
  - url: https://colors-api.vercel.app
    description: Production server

paths:
  /api/mcp-tools:
    get:
      summary: List MCP tools
      security:
        - bearerAuth: []
      responses:
        200:
          description: List of MCP tools
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MCPTool'
    
    post:
      summary: Add MCP tool
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MCPToolConfig'
      responses:
        201:
          description: Tool added successfully

components:
  schemas:
    MCPTool:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        status:
          type: string
          enum: [connected, disconnected, error]
        connection_config:
          type: object
          
    MCPToolConfig:
      type: object
      required: [name, type, connection_config]
      properties:
        name:
          type: string
        type:
          type: string
        connection_config:
          type: object
```
