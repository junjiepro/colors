# **Infrastructure and Deployment**

### **Infrastructure as Code**

**Tool**: Terraform with Vercel and Supabase providers
**Location**: `infrastructure/terraform/`

**Key Resources**:

- Vercel project with environment variables
- Supabase project with database and auth
- DNS configuration for custom domain
- Environment-specific configurations

### **Deployment Strategy**

**Strategy**: Git-based deployment with automatic CI/CD
**CI/CD Platform**: GitHub Actions

**Pipeline Configuration**: `.github/workflows/deploy.yml`

**Environment Promotion Flow**:

```
Git Push → GitHub Actions → Vercel Preview → Manual Review → Vercel Production
```

**Rollback Strategy**:

- **Primary**: Vercel instant rollback via dashboard
- **Secondary**: Git revert and redeploy
- **Database**: Supabase point-in-time recovery
- **CLI**: npm package version rollback

### **Environments**

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|---------|
| Development | localhost:3000 | localhost:8000 | Local development |
| Preview | *.vercel.app | *.vercel.app | Pull request previews |
| Production | colors.app | api.colors.app | Live environment |
