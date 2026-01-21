---
title: Runtime Environment Variables for Vue
impact: HIGH
impactDescription: enables build-once deploy-anywhere pattern with runtime config
type: efficiency
tags: vite, environment, env, runtime, deployment, docker
---

# Runtime Environment Variables for Vue

**Impact: HIGH** - enables build-once deploy-anywhere pattern with runtime config

Vite replaces environment variables at build time, not runtime. Setting `VITE_API_URL=value` on a server after deployment has no effect - it was baked into the bundle at build time.

## Symptoms

- Environment variables ignored after deployment
- Same build behaves identically in staging and production
- Docker containers can't use different env vars per environment
- `import.meta.env.VITE_*` returns build-time values

## Root Cause

Vite statically replaces `import.meta.env.VITE_*` during build. This is intentional for optimization but breaks the "build once, deploy anywhere" pattern.

## Fix

**Option 1: Runtime config endpoint**

Create a config endpoint that serves environment variables:

```typescript
// server/api/config.ts (or public/config.js)
// This file is generated at container startup

window.__APP_CONFIG__ = {
  apiUrl: 'https://api.production.com',
  featureFlags: { newDashboard: true }
}
```

```html
<!-- index.html -->
<script src="/config.js"></script>
```

```typescript
// src/config.ts
interface AppConfig {
  apiUrl: string
  featureFlags: Record<string, boolean>
}

export function getConfig(): AppConfig {
  // Runtime config (from server)
  if (window.__APP_CONFIG__) {
    return window.__APP_CONFIG__
  }

  // Fallback to build-time config (dev mode)
  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    featureFlags: {}
  }
}
```

**Option 2: Docker entrypoint script**

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

```bash
#!/bin/sh
# docker-entrypoint.sh
cat > /usr/share/nginx/html/config.js << EOF
window.__APP_CONFIG__ = {
  apiUrl: "${API_URL:-http://localhost:3000}",
  sentryDsn: "${SENTRY_DSN:-}"
};
EOF
exec "$@"
```

**Option 3: SSR with server-side injection**

For Nuxt/SSR apps, inject config during server render:

```typescript
// server/plugins/config.ts
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html, { event }) => {
    html.head.push(`<script>window.__CONFIG__=${JSON.stringify({
      apiUrl: process.env.API_URL
    })}</script>`)
  })
})
```

## Type Safety

```typescript
// src/env.d.ts
declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiUrl: string
      featureFlags: Record<string, boolean>
    }
  }
}

export {}
```

## Reference

- [Vite Issue #16069](https://github.com/vitejs/vite/issues/16069)
- [Vite Env Variables Guide](https://vite.dev/guide/env-and-mode)
