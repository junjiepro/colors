# **Source Tree**

```plaintext
colors/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── mcp-tools/
│   │   │   │   │   └── settings/
│   │   │   │   ├── (agent)/
│   │   │   │   │   └── agent/
│   │   │   │   ├── (gallery)/
│   │   │   │   │   └── gallery/
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── mcp-tools/
│   │   │   │   │   ├── applications/
│   │   │   │   │   └── conversations/
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/          # shadcn/ui components
│   │   │   │   ├── mcp/         # MCP-specific components
│   │   │   │   ├── agent/       # Agent chat components
│   │   │   │   └── gallery/     # Gallery components
│   │   │   ├── lib/
│   │   │   │   ├── supabase/    # Supabase client
│   │   │   │   ├── hooks/       # Custom hooks
│   │   │   │   └── utils/       # Frontend utilities
│   │   │   └── store/           # Zustand stores
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── mcp-tools.ts
│   │   │   │   ├── applications.ts
│   │   │   │   ├── conversations.ts
│   │   │   │   └── websocket.ts
│   │   │   ├── services/
│   │   │   │   ├── mcp-service.ts
│   │   │   │   ├── ai-service.ts
│   │   │   │   └── app-generator.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rate-limit.ts
│   │   │   │   └── logging.ts
│   │   │   ├── utils/
│   │   │   │   ├── encryption.ts
│   │   │   │   └── validation.ts
│   │   │   └── main.ts
│   │   ├── deno.json
│   │   └── .env.example
│   │
│   └── cli/
│       ├── src/
│       │   ├── commands/
│       │   │   ├── dev.ts
│       │   │   ├── mcp.ts
│       │   │   └── config.ts
│       │   ├── services/
│       │   │   ├── mcp-debug.ts
│       │   │   └── config-manager.ts
│       │   └── main.ts
│       ├── deno.json
│       └── .env.example
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── mcp.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── application.ts
│   │   │   ├── schemas/
│   │   │   │   ├── validation.ts
│   │   │   │   └── api-schemas.ts
│   │   │   └── constants/
│   │   │       └── index.ts
│   │   └── package.json
│   │
│   ├── ui/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── package.json
│   │
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── infrastructure/
│   ├── terraform/
│   │   ├── vercel.tf
│   │   └── supabase.tf
│   └── github/
│       └── workflows/
│
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── dev.sh
│
├── docs/
│   ├── prd.md
│   ├── front-end-spec.md
│   ├── fullstack-architecture.md
│   └── api-docs.md
│
├── .env.example
├── turbo.json
├── package.json
└── README.md
```
