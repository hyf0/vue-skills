---
title: Extending Route Meta Types
impact: HIGH
impactDescription: enables type-safe custom route metadata with IDE autocomplete
type: efficiency
tags: vue-router, meta, typescript, module-augmentation, type-safe
---

# Extending Route Meta Types

**Impact: HIGH** - enables type-safe custom route metadata with IDE autocomplete

The `meta` field in Vue Router routes defaults to `Record<string, unknown>`, preventing type-safe metadata. Module augmentation allows you to define custom typed metadata.

## Symptoms

- No autocomplete for `route.meta.propertyName`
- TypeScript allows any property on `meta`
- "Property does not exist on type 'RouteMeta'" errors
- Need to cast `meta` everywhere

## Fix

**Step 1: Create type declaration file**
```typescript
// src/router/types.ts or src/types/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
    layout?: 'default' | 'admin' | 'blank'
  }
}
```

**Step 2: Ensure the file is included in tsconfig**
```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.vue",
    "src/types/*.d.ts"
  ]
}
```

**Step 3: Use typed meta in routes**
```typescript
// src/router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Admin Dashboard'
    }
  }
]
```

**Step 4: Access typed meta in navigation guards**
```typescript
router.beforeEach((to, from) => {
  // Fully typed - IDE shows autocomplete
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login'
  }

  if (to.meta.roles && !hasRoles(to.meta.roles)) {
    return '/unauthorized'
  }
})
```

## In Components

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Typed access
const pageTitle = route.meta.title
const requiresAuth = route.meta.requiresAuth
</script>
```

## Optional vs Required Properties

Use optional properties (`?`) for meta that may not be present on all routes:
```typescript
interface RouteMeta {
  requiresAuth?: boolean  // Optional - some routes are public
  title: string           // Required - all routes need a title
}
```

## Reference

- [Vue Router Issue #3183](https://github.com/vuejs/vue-router/issues/3183)
- [Vue Router Meta Fields](https://router.vuejs.org/guide/advanced/meta.html)
- [Vue Router TypeScript](https://router.vuejs.org/guide/advanced/typescript.html)
