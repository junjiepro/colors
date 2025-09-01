'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const connectionTypes = [
  { value: 'http' as const, label: 'HTTP' },
  { value: 'stdio' as const, label: 'STDIO' },
] as const;

type ConnectionType = typeof connectionTypes[number]['value'];

const authMethods = [
  { value: 'none' as const, label: 'None' },
  { value: 'basic' as const, label: 'Basic Auth' },
  { value: 'token' as const, label: 'Token' },
  { value: 'api_key' as const, label: 'API Key' },
] as const;

type AuthMethod = typeof authMethods[number]['value'];

type ToolFormValues = {
  name: string;
  connectionType: ConnectionType;
  endpoint: string;
  authMethod: AuthMethod;
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
};

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  connectionType: z.string().refine(
    (val) => connectionTypes.some((t) => t.value === val),
    'Please select a valid connection type'
  ),
  endpoint: z.string().min(1, 'Endpoint or command is required'),
  authMethod: z.string().refine(
    (val) => authMethods.some((m) => m.value === val),
    'Please select a valid authentication method'
  ),
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
  apiKey: z.string().optional(),
}).refine(
  (data) => {
    if (data.authMethod === 'basic') {
      return Boolean(data.username && data.password);
    } else if (data.authMethod === 'token') {
      return Boolean(data.token);
    } else if (data.authMethod === 'api_key') {
      return Boolean(data.apiKey);
    }
    return true;
  },
  {
    message: 'Required field for selected authentication method',
    path: ['authMethod'],
  }
);

interface ToolFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ToolFormValues> & { id?: string };
  isEditing?: boolean;
}

export function ToolForm({ onSuccess, onCancel, initialData, isEditing = false }: ToolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      connectionType: (initialData?.connectionType as ConnectionType) || 'http',
      endpoint: initialData?.endpoint || '',
      authMethod: (initialData?.authMethod as AuthMethod) || 'none',
      username: initialData?.username || '',
      password: '',
      token: initialData?.token || '',
      apiKey: initialData?.apiKey || '',
    },
  });

  const authMethod = form.watch('authMethod') as AuthMethod;
  const connectionType = form.watch('connectionType') as ConnectionType;

  const handleTestConnection = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();
    setIsTesting(true);

    try {
      // Prepare the request data with proper typing
      const requestData: Record<string, unknown> = {
        name: formData.name,
        connectionType: formData.connectionType,
        endpoint: formData.endpoint,
        authMethod: formData.authMethod,
      };

      // Add authentication data based on the selected method
      if (formData.authMethod === 'basic') {
        if (formData.username) requestData.username = formData.username;
        if (formData.password) requestData.password = formData.password;
      } else if (formData.authMethod === 'token' && formData.token) {
        requestData.token = formData.token;
      } else if (formData.authMethod === 'api_key' && formData.apiKey) {
        requestData.apiKey = formData.apiKey;
      }

      // Send test request to the API
      const response = await fetch('/api/tools/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Connection test failed');
      }

      toast({
        title: 'Connection successful',
        description: 'Successfully connected to the MCP tool',
        variant: 'default',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Connection error',
        description: `Failed to test connection: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  type FormData = {
    name: string;
    connectionType: string;
    endpoint: string;
    authMethod: string;
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      
      // Prepare the data to send
      const requestData: Record<string, unknown> = {
        name: formData.name,
        connectionType: formData.connectionType,
        endpoint: formData.endpoint,
        authMethod: formData.authMethod
      };

      // Add auth-specific fields conditionally
      if (formData.authMethod === 'basic') {
        if (formData.username) requestData.username = formData.username;
        if (formData.password) requestData.password = formData.password;
      } else if (formData.authMethod === 'token' && formData.token) {
        requestData.token = formData.token;
      } else if (formData.authMethod === 'api_key' && formData.apiKey) {
        requestData.apiKey = formData.apiKey;
      }

      // Determine the URL and method
      const url = isEditing && initialData && 'id' in initialData
        ? `/api/tools/${initialData.id}`
        : '/api/tools';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      // Make the API request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to save tool');
      }

      toast({
        title: isEditing ? 'Tool updated' : 'Tool created',
        description: `Your tool has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: `Failed to save tool: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="My MCP Tool" 
                  {...field} 
                  disabled={isLoading || isTesting}
                />
              </FormControl>
              <FormDescription>
                A descriptive name for your MCP tool.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connectionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                How should we connect to this tool?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{connectionType === 'http' ? 'Endpoint URL' : 'Command'}</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    connectionType === 'http'
                      ? 'https://example.com/api'
                      : 'command --arg1 value1'
                  }
                  {...field}
                  disabled={isLoading || isTesting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Method</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an authentication method" />
                  </SelectTrigger>
                  <SelectContent>
                    {authMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                How should we authenticate with this tool?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {authMethod === 'basic' && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="username" 
                      {...field} 
                      disabled={isLoading || isTesting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      disabled={isLoading || isTesting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {authMethod === 'token' && (
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={isLoading || isTesting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {authMethod === 'api_key' && (
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Enter your API key" 
                    {...field} 
                    disabled={isLoading || isTesting}
                  />
                </FormControl>
                <FormDescription>
                  The API key will be securely stored and used for authentication.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isLoading || isTesting}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleTestConnection}
            disabled={isLoading || isTesting || !form.formState.isValid}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mr-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </button>
          <button 
            type="submit"
            disabled={isLoading || isTesting || !form.formState.isValid}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update Tool'
            ) : (
              'Create Tool'
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
