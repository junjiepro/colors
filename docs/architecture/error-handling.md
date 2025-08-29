# **Error Handling**

### **Error Response Format**

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

### **Frontend Error Handler**

```typescript
// apps/web/src/lib/error-handler.ts
export class ErrorHandler {
  static handle(error: ApiError) {
    // Log to monitoring service
    console.error(error);
    
    // Display user-friendly message
    toast.error(ErrorMessages[error.code] || 'Something went wrong');
  }
}
```

### **Backend Error Handler**

```typescript
// apps/server/src/middleware/error-handler.ts
export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    const requestId = crypto.randomUUID();
    
    logger.error('Request failed', {
      error,
      requestId,
      path: ctx.request.url.pathname,
    });
    
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }
}
```
