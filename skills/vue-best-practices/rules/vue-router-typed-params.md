---
title: Vue Router useRoute Params Union Type Narrowing
impact: MEDIUM
impactDescription: fixes "Property does not exist" errors with typed route params
type: capability
tags: vue-router, useRoute, unplugin-vue-router, typed-routes, params
---

# Vue Router useRoute Params Union Type Narrowing

**Impact: MEDIUM** - fixes "Property does not exist" errors with typed route params

With `unplugin-vue-router` typed routes, `route.params` becomes a union of ALL page param types. TypeScript cannot narrow `Record<never, never> | { id: string }` properly, causing "Property 'id' does not exist" errors even on the correct page.

## Symptoms

- "Property 'id' does not exist on type 'RouteParams'"
- `route.params.id` shows as `string | undefined` everywhere
- Union type of all route params instead of specific route
- Type narrowing with `if (route.name === 'users-id')` doesn't work

## Root Cause

`unplugin-vue-router` generates a union type of all possible route params. TypeScript's control flow analysis can't narrow this union based on route name checks.

## Fix

**Option 1: Pass route name to useRoute (recommended)**
```typescript
// pages/users/[id].vue
import { useRoute } from 'vue-router/auto'

// Specify the route path for proper typing
const route = useRoute('/users/[id]')

// Now properly typed as { id: string }
console.log(route.params.id)  // string, not string | undefined
```

**Option 2: Type assertion with specific route**
```typescript
import { useRoute } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router/auto-routes'

const route = useRoute() as RouteLocationNormalized<'/users/[id]'>
route.params.id  // Properly typed
```

**Option 3: Define route-specific param type**
```typescript
// In your page component
interface UserRouteParams {
  id: string
}

const route = useRoute()
const { id } = route.params as UserRouteParams
```

## Required tsconfig Setting

Ensure `moduleResolution: "bundler"` for unplugin-vue-router:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

## Caveat: Route Name Format

The route name matches the file path pattern:
- `pages/users/[id].vue` → `/users/[id]`
- `pages/posts/[slug]/comments.vue` → `/posts/[slug]/comments`

## Reference

- [unplugin-vue-router#337](https://github.com/posva/unplugin-vue-router/issues/337)
- [unplugin-vue-router#176](https://github.com/posva/unplugin-vue-router/discussions/176)
- [unplugin-vue-router TypeScript docs](https://uvr.esm.is/guide/typescript.html)
