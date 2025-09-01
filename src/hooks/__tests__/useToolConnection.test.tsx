import { renderHook, act } from '@testing-library/react';
import { useToolConnection } from '../useToolConnection';
import { useConnectionLogger } from '../useConnectionLogger';

// Mock the useConnectionLogger hook
jest.mock('../useConnectionLogger');

// Create a simple response helper
function createMockResponse(ok: boolean, data: unknown, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers(),
    url: 'http://test.com',
    redirected: false,
    type: 'basic' as const,
    json: async () => data,
    text: async () => JSON.stringify(data),
    clone: function() { return this as Response; },
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
  } as Response;
}

// Mock the global fetch
const mockFetch = jest.fn<Promise<Response>, [RequestInfo, RequestInit?]>();

// Mocking global fetch
Object.defineProperty(global, 'fetch', {
  value: mockFetch,
  writable: true
});

describe('useToolConnection', () => {
  const mockAddLog = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup the mock implementation for useConnectionLogger
    (useConnectionLogger as jest.Mock).mockImplementation(() => ({
      addLog: mockAddLog,
      getToolLogs: jest.fn(),
      clearLogs: jest.fn(),
    }));
  });

  it('should initialize with empty connections', () => {
    const { result } = renderHook(() => useToolConnection());
    
    expect(result.current.connections).toEqual({});
    expect(result.current.isConnectionLoading('test-tool')).toBe(false);
    expect(result.current.getConnectionStatus('test-tool')).toEqual({
      id: 'test-tool',
      status: 'disconnected',
      retryCount: 0,
    });
  });

  it('should test a connection successfully', async () => {
    // Mock a successful fetch response
    mockFetch.mockResolvedValueOnce(createMockResponse(true, {}));

    const { result } = renderHook(() => useToolConnection());
    
    await act(async () => {
      const { success } = await result.current.testConnection('test-tool', {
        name: 'Test Tool',
        connectionType: 'http',
        endpoint: 'http://test.com',
        authMethod: 'none',
      });
      
      expect(success).toBe(true);
    });

    // Verify the connection status was updated
    expect(result.current.getConnectionStatus('test-tool').status).toBe('connected');
    
    // Verify the log was added
    expect(mockAddLog).toHaveBeenCalledWith(
      'test-tool',
      'Connection status changed to connecting',
      'info',
      { previousStatus: undefined }
    );
    
    expect(mockAddLog).toHaveBeenCalledWith(
      'test-tool',
      'Connection status changed to connected',
      'success',
      { previousStatus: 'connecting' }
    );
  });

  it('should handle connection errors', async () => {
    // Mock a failed fetch response
    const mockError = {
      error: 'Connection failed',
      code: 'CONNECTION_FAILED',
    };
    
    mockFetch.mockResolvedValueOnce(createMockResponse(false, mockError));

    const { result } = renderHook(() => useToolConnection());
    
    let testResult;
    await act(async () => {
      testResult = await result.current.testConnection('test-tool', {
        name: 'Test Tool',
        connectionType: 'http',
        endpoint: 'http://test.com',
        authMethod: 'none',
      });
      
      expect(testResult.success).toBe(false);
      expect(testResult.error).toBe('Connection failed');
    });

    const status = result.current.getConnectionStatus('test-tool');
    expect(status.status).toBe('error');
    expect(status.error?.message).toBe('Connection failed');
    expect(status.error?.code).toBe('CONNECTION_FAILED');
  });

  it('should retry failed connections', async () => {
    // Mock a failed fetch response that will be retried
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve(createMockResponse(true, {})), 1000)
        )
      );

    // Use fake timers
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useToolConnection());
    
    // Start the test connection (will fail first time)
    await act(async () => {
      result.current.testConnection('test-tool', {
        name: 'Test Tool',
        connectionType: 'http',
        endpoint: 'http://test.com',
        authMethod: 'none',
      });
      
      // Process any pending timers and microtasks
      jest.runAllTicks();
      await Promise.resolve();
    });

    // Verify the connection is in error state after initial failure
    expect(result.current.getConnectionStatus('test-tool').status).toBe('error');

    // Fast-forward timers to trigger the retry
    await act(async () => {
      jest.advanceTimersByTime(2000); // RETRY_DELAY * 1
      await Promise.resolve();
    });

    // Verify the connection is now in connecting state for retry
    expect(result.current.getConnectionStatus('test-tool').status).toBe('retrying');
    
    // Fast-forward to complete the delayed response
    await act(async () => {
      jest.advanceTimersByTime(1000); // Wait for the delayed response
      await Promise.resolve();
    });

    // Verify the connection was successful after retry
    expect(result.current.getConnectionStatus('test-tool').status).toBe('connected');
    
    // Verify the retry was logged
    expect(mockAddLog).toHaveBeenCalledWith(
      'test-tool',
      'Connection status changed to retrying',
      'info',
      expect.objectContaining({
        previousStatus: 'error'
      })
    );
    
    // Cleanup
    jest.useRealTimers();
  });
});
