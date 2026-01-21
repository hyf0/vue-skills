---
title: Composable Cleanup and Memory Leaks
impact: HIGH
impactDescription: prevents memory leaks in composables with proper cleanup
type: efficiency
tags: composable, cleanup, memory-leak, onUnmounted, lifecycle
---

# Composable Cleanup and Memory Leaks

**Impact: HIGH** - prevents memory leaks in composables with proper cleanup

Composables using timers, event listeners, or subscriptions can create memory leaks if cleanup isn't handled properly, especially with multiple component instances or keep-alive.

## Symptoms

- Memory usage grows over time
- Event handlers fire after component unmount
- Intervals/timers continue running
- Multiple handlers attached on re-mount
- Issues worse with keep-alive components

## Problem Pattern

```typescript
// Incomplete cleanup
export function useAutoSave() {
  let interval: NodeJS.Timer | null = null

  const start = () => {
    interval = setInterval(() => {
      console.log('Saving...')
    }, 5000)
  }

  // Only cleans up on unmount, misses keep-alive
  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { start }
}
```

## Fix

**Pattern 1: Complete lifecycle cleanup**
```typescript
export function useAutoSave() {
  const intervalId = ref<NodeJS.Timer | null>(null)

  const start = () => {
    stop()  // Clear any existing interval first
    intervalId.value = setInterval(() => {
      console.log('Saving...')
    }, 5000)
  }

  const stop = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  // Handle all cleanup scenarios
  onUnmounted(stop)
  onDeactivated(stop)  // For keep-alive

  return { start, stop }
}
```

**Pattern 2: Use tryOnScopeDispose (VueUse pattern)**
```typescript
import { tryOnScopeDispose } from '@vueuse/core'

export function useEventListener(target: EventTarget, event: string, handler: EventListener) {
  target.addEventListener(event, handler)

  // Automatically cleans up when scope is disposed
  tryOnScopeDispose(() => {
    target.removeEventListener(event, handler)
  })
}
```

**Pattern 3: Effect scope for grouped cleanup**
```typescript
import { effectScope, onScopeDispose } from 'vue'

export function useFeature() {
  const scope = effectScope()

  scope.run(() => {
    const interval = setInterval(() => {}, 1000)

    // Cleanup registered to scope
    onScopeDispose(() => {
      clearInterval(interval)
    })
  })

  // Manual cleanup if needed
  const dispose = () => scope.stop()

  onUnmounted(dispose)

  return { dispose }
}
```

## Cleanup Checklist

| Resource | Cleanup Method |
|----------|---------------|
| setInterval | clearInterval |
| setTimeout | clearTimeout |
| addEventListener | removeEventListener |
| ResizeObserver | disconnect() |
| IntersectionObserver | disconnect() |
| WebSocket | close() |
| Subscriptions | unsubscribe() |

## Testing for Leaks

```typescript
// In your composable tests
describe('useAutoSave', () => {
  it('cleans up on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    const wrapper = mount({
      setup() {
        const { start } = useAutoSave()
        start()
        return {}
      },
      template: '<div />'
    })

    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
```

## Reference

- [Vue Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [VueUse tryOnScopeDispose](https://vueuse.org/shared/tryOnScopeDispose/)
- [Effect Scope RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)
