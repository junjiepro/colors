# **High Level Architecture**

### **Technical Summary**

Colors employs a **Jamstack architecture** with serverless functions, combining Next.js frontend with Deno edge functions backend. The system uses Supabase for data persistence and real-time features, with a Deno-compiled CLI tool for local development. This architecture prioritizes rapid development, scalability, and the unique requirement of supporting both web interfaces and CLI tooling.

### **Platform and Infrastructure Choice**

**Platform**: **Vercel + Supabase Stack**

- **Primary Reason**: Optimal for 1-2 week MVP timeline with built-in scaling
- **Key Services**:
  - Vercel: Frontend hosting, edge functions, CDN
  - Supabase: Database (PostgreSQL), authentication, real-time subscriptions
  - Deno Deploy: CLI backend for edge computing
  - npm: CLI package distribution

**Deployment Strategy**:

- **Frontend**: Vercel with global edge CDN
- **Backend**: Supabase edge functions + Deno Deploy
- **CLI**: npm package with `npx` support

### **Repository Structure**

**Monorepo with Turborepo**

```
colors/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   ├── components/    # React components
│   │   │   ├── lib/          # Frontend utilities
│   │   │   └── styles/       # Tailwind + custom styles
│   │   ├── public/           # Static assets
│   │   └── package.json
│   │
│   ├── server/               # Deno backend API
│   │   ├── src/
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── services/     # Business logic
│   │   │   ├── middleware/   # Auth, logging
│   │   │   └── utils/        # Server utilities
│   │   └── deno.json
│   │
│   └── cli/                  # Deno CLI tool
│       ├── src/
│       │   ├── commands/     # CLI commands
│       │   ├── services/     # MCP management
│       │   └── utils/        # CLI utilities
│       └── deno.json
│
├── packages/
│   ├── shared/               # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/        # TypeScript types
│   │   │   ├── schemas/      # Validation schemas
│   │   │   └── constants/    # Shared constants
│   │   └── package.json
│   │
│   └── ui/                   # Shared UI components
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   └── hooks/        # Custom React hooks
│       └── package.json
│
├── infrastructure/           # Deployment configurations
│   ├── terraform/           # IaC for resources
│   └── docker/             # Container configs
│
├── scripts/                 # Build and deployment scripts
├── docs/                    # Documentation
│   ├── prd.md
│   ├── front-end-spec.md
│   └── fullstack-architecture.md
│
├── .env.example             # Environment template
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json
└── README.md
```
