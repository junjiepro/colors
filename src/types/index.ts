export type ConnectionType = 'http' | 'stdio';
export type AuthMethod = 'none' | 'basic' | 'token' | 'api_key';
export type ToolStatus = 'connected' | 'disconnected' | 'error';

export interface Tool {
  id: string;
  name: string;
  connectionType: ConnectionType;
  endpoint: string;
  authMethod: AuthMethod;
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
  status: ToolStatus;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateToolDto {
  name: string;
  connectionType: ConnectionType;
  endpoint: string;
  authMethod: AuthMethod;
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
}

export interface UpdateToolDto extends Partial<CreateToolDto> {}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  status?: number;
  data?: any;
}
