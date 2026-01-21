---
title: VueUse SSR Compatibility
impact: HIGH
impactDescription: prevents SSR errors with browser-only VueUse composables
type: efficiency
tags: vueuse, ssr, nuxt, hydration, browser-api
---

# VueUse SSR Compatibility

**Impact: HIGH** - prevents SSR errors with browser-only VueUse composables

Many VueUse composables use browser APIs (window, document, localStorage) that don't exist during SSR, causing hydration mismatches or errors.

## Symptoms

- "window is not defined" during SSR
- "document is not defined" errors
- Hydration mismatch warnings
- Different values between server and client

## Fix

**Pattern 1: Use built-in SSR-safe variants**
```typescript
import {
  useLocalStorage,  // Already SSR-safe
  useSessionStorage,  // Already SSR-safe
  useMouse  // NOT SSR-safe
} from '@vueuse/core'

// These composables have built-in SSR handling
const stored = useLocalStorage('key', 'default')  // Safe
```

**Pattern 2: Client-only with onMounted**
```typescript
import { useMouse } from '@vueuse/core'
import { ref, onMounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)

onMounted(() => {
  // Only runs on client
  const { x, y } = useMouse()

  watchEffect(() => {
    mouseX.value = x.value
    mouseY.value = y.value
  })
})
```

**Pattern 3: Use isClient check**
```typescript
import { useMouse, isClient } from '@vueuse/core'

// Only use browser APIs on client
const mouse = isClient
  ? useMouse()
  : { x: ref(0), y: ref(0) }
```

**Pattern 4: Nuxt <ClientOnly> component**
```vue
<template>
  <ClientOnly>
    <MouseTracker />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </ClientOnly>
</template>
```

## Composables with SSR Support

| Composable | SSR Safe | Notes |
|------------|----------|-------|
| useLocalStorage | Yes | Returns initial value on server |
| useSessionStorage | Yes | Returns initial value on server |
| useDark | Partial | Needs cookie/header for initial |
| useMouse | No | Client only |
| useScroll | No | Client only |
| useWindowSize | No | Use with fallback |
| useIntersectionObserver | No | Client only |

## Nuxt Integration

```typescript
// composables/useBrowserFeature.ts
export function useBrowserFeature() {
  if (import.meta.server) {
    // Return mock/default values for SSR
    return { value: ref(null) }
  }

  // Real implementation for client
  return useSomeBrowserApi()
}
```

## Reference

- [VueUse SSR Guide](https://vueuse.org/guide/#ssr-support)
- [Nuxt Client-Only Components](https://nuxt.com/docs/api/components/client-only)
