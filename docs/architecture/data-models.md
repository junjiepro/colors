# **Data Models**

### **Core Data Models**

#### **User Model**

```typescript
interface User {
  id: string;                    // UUID
  email: string;                // Unique email
  username: string;            // Unique username
  avatar_url?: string;         // Profile picture
  created_at: Date;
  updated_at: Date;
  
  // Preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}
```

#### **MCP Tool Configuration**

```typescript
interface MCPTool {
  id: string;                  // UUID
  name: string;               // Display name
  type: string;               // Tool type (server, client)
  connection_config: {
    host: string;
    port: number;
    auth?: {
      type: 'token' | 'key' | 'none';
      value?: string;
    };
  };
  status: 'connected' | 'disconnected' | 'error';
  metadata: {
    description: string;
    version: string;
    capabilities: string[];
  };
  user_id: string;            // Foreign key to users
  created_at: Date;
  updated_at: Date;
}
```

#### **API Key Management**

```typescript
interface APIKey {
  id: string;                 // UUID
  service: string;            // 'openai' | 'anthropic' | 'google' | etc.
  encrypted_key: string;      // Encrypted API key
  name: string;              // User-friendly name
  is_shared: boolean;        // Whether to share with others
  usage_limits?: {
    requests_per_day?: number;
    requests_per_hour?: number;
  };
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
```

#### **Application Model**

```typescript
interface Application {
  id: string;                // UUID
  name: string;              // Application name
  description: string;       // User description
  html_content: string;      // Generated HTML
  css_content?: string;      // Optional CSS
  js_content?: string;       // Optional JavaScript
  prompt: string;            // Original prompt used
  mcp_tools: string[];       // Tools used in creation
  api_keys: string[];        // API keys required
  visibility: 'private' | 'public' | 'shared';
  share_url?: string;        // Generated share link
  usage_stats: {
    views: number;
    uses: number;
    bookmarks: number;
  };
  user_id: string;          // Creator
  created_at: Date;
  updated_at: Date;
}
```

#### **Conversation Model**

```typescript
interface Conversation {
  id: string;               // UUID
  title: string;           // Generated title
  messages: Message[];
  application_id?: string; // If created app
  mcp_tools: string[];     // Tools used
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tool_calls?: any[];
    tokens?: number;
  };
}
```
