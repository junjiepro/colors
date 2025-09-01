import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ConnectionType, AuthMethod, CreateToolDto, Tool, ToolStatus } from '@/types/mcp';

// Mock database
let tools: Tool[] = [
  {
    id: '1',
    name: 'Local MCP Server',
    connectionType: 'http',
    endpoint: 'http://localhost:3000',
    authMethod: 'none',
    status: 'connected',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const toolSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  connectionType: z.enum(['http', 'stdio']),
  endpoint: z.string().min(1, 'Endpoint is required'),
  authMethod: z.enum(['none', 'basic', 'token', 'api_key']),
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
  apiKey: z.string().optional(),
}) satisfies z.ZodType<Omit<CreateToolDto, 'id' | 'status' | 'createdAt' | 'updatedAt'>>;

export async function GET() {
  return NextResponse.json({
    success: true,
    data: tools,
    message: 'Tools retrieved successfully'
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validation = toolSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: validation.error.format()
        },
        { status: 400 }
      );
    }

    const newTool: Tool = {
      ...validation.data,
      id: crypto.randomUUID(),
      status: 'disconnected',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tools.push(newTool);
    
    return NextResponse.json({
      success: true,
      data: newTool,
      message: 'Tool created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create tool',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
