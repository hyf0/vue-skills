---
title: Type-Safe Dynamic Route Configuration
impact: MEDIUM
impactDescription: prevents runtime errors when adding routes dynamically
type: efficiency
tags: vue-router, dynamic-routing, addRoute, typescript, RouteRecordRaw
---

# Type-Safe Dynamic Route Configuration

**Impact: MEDIUM** - prevents runtime errors when adding routes dynamically

When dynamically adding routes with `router.addRoute()`, TypeScript doesn't provide adequate type checking, leading to runtime errors like "path is required".

## Symptoms

- Runtime error: "path is required in route config"
- Missing required properties not caught at compile time
- Route metadata not type-checked
- Unclear error messages

## Fix

**Use RouteRecordRaw for type safety**
```typescript
import { type RouteRecordRaw } from 'vue-router'
import { router } from './router'

// Properly typed route configuration
const dynamicRoute: RouteRecordRaw = {
  path: '/dashboard/:tenantId',
  name: 'tenant-dashboard',
  component: () => import('@/views/TenantDashboard.vue'),
  meta: {
    requiresAuth: true,
    title: 'Dashboard'
  },
  children: [
    {
      path: 'settings',
      name: 'tenant-settings',
      component: () => import('@/views/TenantSettings.vue')
    }
  ]
}

// Add route with type safety
router.addRoute(dynamicRoute)

// Add as child of existing route
router.addRoute('parent-route-name', dynamicRoute)
```

## Helper Function for Type Safety

```typescript
function createRoute(config: RouteRecordRaw): RouteRecordRaw {
  // Validate required fields at runtime for extra safety
  if (!config.path) {
    throw new Error('Route path is required')
  }
  if (!config.component && !config.redirect && !config.children?.length) {
    throw new Error('Route must have component, redirect, or children')
  }
  return config
}

// Usage
const route = createRoute({
  path: '/new-feature',
  component: () => import('@/views/NewFeature.vue')
})
router.addRoute(route)
```

## Route Management Patterns

```typescript
// Remove route by name
router.removeRoute('tenant-dashboard')

// Check if route exists
if (!router.hasRoute('tenant-dashboard')) {
  router.addRoute(dynamicRoute)
}

// Get all routes
const routes = router.getRoutes()

// Replace existing route (remove + add)
function replaceRoute(name: string, newRoute: RouteRecordRaw) {
  if (router.hasRoute(name)) {
    router.removeRoute(name)
  }
  router.addRoute(newRoute)
}
```

## Common Use Cases

**Micro-frontend routing:**
```typescript
// Load routes from remote module
async function loadRemoteRoutes(moduleUrl: string) {
  const module = await import(/* webpackIgnore: true */ moduleUrl)
  const routes: RouteRecordRaw[] = module.routes

  routes.forEach(route => {
    router.addRoute(route)
  })
}
```

**Permission-based routes:**
```typescript
function addRoutesForRole(role: string) {
  const roleRoutes = getRoutesForRole(role)
  roleRoutes.forEach(route => {
    if (!router.hasRoute(route.name as string)) {
      router.addRoute(route)
    }
  })
}
```

## Reference

- [Vue Router Issue #3856](https://github.com/vuejs/vue-router/issues/3856)
- [Vue Router Dynamic Routing](https://router.vuejs.org/guide/advanced/dynamic-routing.html)
