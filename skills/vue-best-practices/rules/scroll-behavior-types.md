---
title: Typing ScrollBehavior Functions
impact: MEDIUM
impactDescription: fixes type inference errors for router scrollBehavior
type: efficiency
tags: vue-router, scrollBehavior, typescript, scroll, navigation
---

# Typing ScrollBehavior Functions

**Impact: MEDIUM** - fixes type inference errors for router scrollBehavior

When defining `scrollBehavior` in TypeScript, the function signature isn't clear, leading to type errors and missing IDE autocomplete.

## Symptoms

- Type errors when defining scrollBehavior
- No autocomplete for function parameters
- `savedPosition` typed as `any`
- Return type not validated

## Fix

**Option 1: Use RouterOptions type extraction**
```typescript
import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

const scrollBehavior: RouterOptions['scrollBehavior'] = (to, from, savedPosition) => {
  // savedPosition is properly typed as ScrollPosition | null
  if (savedPosition) {
    return savedPosition
  }

  // Return type is validated
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' }
  }

  return { top: 0 }
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior
})
```

**Option 2: Inline with type assertion**
```typescript
export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // TypeScript infers types from context
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0 }
  }
})
```

## Async ScrollBehavior

For delayed scrolling (e.g., after transition):
```typescript
const scrollBehavior: RouterOptions['scrollBehavior'] = async (to, from, savedPosition) => {
  // Wait for transition
  await new Promise(resolve => setTimeout(resolve, 300))

  if (savedPosition) {
    return savedPosition
  }

  return { top: 0, behavior: 'smooth' }
}
```

## Return Type Reference

| Return Value | Behavior |
|--------------|----------|
| `{ top: 0 }` | Scroll to top |
| `{ top: 0, left: 0 }` | Scroll to position |
| `{ el: '#anchor' }` | Scroll to element |
| `{ el: '#anchor', top: 10 }` | Scroll to element with offset |
| `savedPosition` | Restore previous position (back/forward) |
| `false` | No scroll change |

## Note on savedPosition

`savedPosition` is only available for `popstate` navigations (back/forward buttons):
```typescript
scrollBehavior(to, from, savedPosition) {
  // savedPosition is null for programmatic navigation
  // savedPosition has value for browser back/forward
  if (savedPosition) {
    return savedPosition
  }
  return { top: 0 }
}
```

## Reference

- [Vue Router Issue #3196](https://github.com/vuejs/vue-router/issues/3196)
- [Vue Router Scroll Behavior](https://router.vuejs.org/guide/advanced/scroll-behavior.html)
