# MCP Tool Connection Manager

A Next.js application for managing MCP (Model Context Protocol) tool connections. This application allows you to:

- Add new MCP tool connections
- Edit existing tool configurations
- Test connections to MCP tools
- View connection status and details

## Features

- **Tool Management**: Add, edit, and remove MCP tool connections
- **Connection Testing**: Verify tool connectivity before saving
- **Multiple Authentication Methods**: Support for none, basic auth, token, and API key authentication
- **Responsive UI**: Works on desktop and mobile devices
- **Type Safety**: Built with TypeScript for better developer experience

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Project Structure

- `src/app/api/tools/` - API routes for tool management
- `src/components/mcp/` - MCP-specific React components
- `src/components/ui/` - Reusable UI components
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utility functions and API clients

## API Endpoints

### Get All Tools
- **GET** `/api/tools` - Retrieve a list of all configured tools

### Create a Tool
- **POST** `/api/tools` - Add a new tool
  ```json
  {
    "name": "Example Tool",
    "connectionType": "http",
    "endpoint": "https://api.example.com",
    "authMethod": "none"
  }
  ```

### Test Tool Connection
- **POST** `/api/tools/test-connection` - Test a tool connection
  ```json
  {
    "name": "Example Tool",
    "connectionType": "http",
    "endpoint": "https://api.example.com",
    "authMethod": "none"
  }
  ```

## Development

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Check TypeScript types

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
