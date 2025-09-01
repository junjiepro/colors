# MCP Tool Setup Guide

This guide explains how to set up and manage MCP (Model Context Protocol) tools in the application.

## Table of Contents

- [Introduction](#introduction)
- [Adding a New MCP Tool](#adding-a-new-mcp-tool)
- [Connection Types](#connection-types)
- [Authentication Methods](#authentication-methods)
- [Testing Connections](#testing-connections)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

## Introduction

MCP Tools allow the application to connect to various external services and tools. Each tool can be configured with different connection types and authentication methods.

## Adding a New MCP Tool

1. Navigate to the MCP Tools section in the application
2. Click the "Add Tool" button
3. Fill in the following details:
   - **Name**: A descriptive name for the tool
   - **Connection Type**: HTTP or STDIO
   - **Endpoint**: The URL or command to connect to the tool
   - **Authentication Method**: Select the appropriate authentication method

## Connection Types

### HTTP

- **Endpoint Format**: `http://` or `https://` URL
- **Use Case**: For tools that expose a REST API
- **Requirements**:
  - Must be accessible from the application server
  - Should support CORS if running in a browser

### STDIO

- **Endpoint Format**: Command to execute
- **Use Case**: For command-line tools
- **Requirements**:
  - Must be installed on the server
  - Should be in the system PATH

## Authentication Methods

### None

- No authentication required
- Use only for non-sensitive tools in development

### Basic Auth

- **Username**: Your username for the service
- **Password**: Your password
- **Security**: Passwords are encrypted at rest

### API Key

- **API Key**: Your API key for the service
- **Security**: Keys are encrypted at rest

### Token

- **Token**: Your authentication token
- **Security**: Tokens are encrypted at rest

## Testing Connections

1. After configuring a tool, click the "Test Connection" button
2. The system will attempt to connect to the tool
3. Results will be displayed with one of the following statuses:
   - ✅ Connected: Successfully connected
   - 🔄 Connecting: Connection in progress
   - ❌ Error: Connection failed (see error details)
   - ⚠️ Retrying: Automatic retry in progress

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Verify the endpoint is correct
   - Check if the service is running
   - Verify network connectivity

2. **Authentication Failed**
   - Double-check credentials
   - Verify token/API key has correct permissions
   - Check if the token has expired

3. **CORS Issues**
   - Ensure the server allows requests from your domain
   - Check server CORS configuration

## Security Considerations

1. **Sensitive Data**
   - All credentials are encrypted at rest
   - API keys and tokens are never logged
   - Connections use HTTPS where available

2. **Best Practices**
   - Use the principle of least privilege for API keys
   - Rotate credentials regularly
   - Store development credentials in environment variables

3. **Development vs Production**
   - Use different credentials for development and production
   - Never commit production credentials to version control

## API Reference

### Connection Status Object

```typescript
{
  id: string;           // Unique identifier for the tool
  status: 'connected' | 'disconnected' | 'error' | 'connecting' | 'retrying';
  lastActive?: string;  // ISO timestamp of last successful connection
  error?: {
    code: string;      // Error code
    message: string;   // Human-readable error message
    timestamp: string; // When the error occurred
    retryCount: number;// Number of retry attempts
  };
  retryCount: number;  // Total number of retry attempts
}
```

## Support

For additional help, contact the development team or refer to the [API documentation](./api-specification.md).
