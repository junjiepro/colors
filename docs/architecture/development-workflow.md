# **Development Workflow**

### **Local Development Setup**

**Prerequisites**:

```bash
# Install dependencies
npm install -g pnpm
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys
```

**Development Commands**:

```bash
# Start all services
pnpm dev

# Start specific services
pnpm dev:web        # Next.js frontend
pnpm dev:server     # Deno backend
pnpm dev:cli        # CLI tool

# Run tests
pnpm test
pnpm test:e2e

# Build for production
pnpm build
```

### **Environment Configuration**

**.env.local**:

```bash
# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# CLI
COLORS_ENV=development
COLORS_API_URL=http://localhost:8000
```
