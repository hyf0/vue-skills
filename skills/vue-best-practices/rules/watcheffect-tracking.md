---
title: watchEffect Conditional Dependency Tracking
impact: MEDIUM
impactDescription: fixes watchEffect missing updates due to conditional access
type: efficiency
tags: watchEffect, watch, dependencies, tracking, reactivity
---

# watchEffect Conditional Dependency Tracking

**Impact: MEDIUM** - fixes watchEffect missing updates due to conditional access

`watchEffect` only tracks dependencies that are accessed during execution. If a dependency is in a conditional branch that doesn't execute, it won't be tracked.

## Symptoms

- watchEffect doesn't re-run when expected
- Updates missed when condition is false
- Inconsistent behavior based on execution path
- Works sometimes but not always

## Problem Pattern

```typescript
const isVisible = ref(true)
const data = ref('initial')

watchEffect(() => {
  if (isVisible.value) {
    // data.value only tracked when isVisible is true
    console.log(data.value)
  }
})

isVisible.value = false  // Triggers re-run, data no longer tracked

data.value = 'updated'  // NO re-run! data wasn't accessed last time

isVisible.value = true  // Triggers re-run, now data is tracked again
```

## Fix

**Option 1: Use watch() with explicit dependencies**
```typescript
// Explicitly list all dependencies
watch(
  [isVisible, data],
  ([visible, value]) => {
    if (visible) {
      console.log(value)
    }
  },
  { immediate: true }
)
```

**Option 2: Access all dependencies unconditionally**
```typescript
watchEffect(() => {
  // Access both at the top, before conditionals
  const visible = isVisible.value
  const value = data.value

  if (visible) {
    console.log(value)
  }
})
```

**Option 3: Use computed for derived values**
```typescript
const displayData = computed(() => {
  return isVisible.value ? data.value : null
})

// Now watch the computed
watch(displayData, (value) => {
  if (value !== null) {
    console.log(value)
  }
})
```

## watch vs watchEffect

| Feature | watch | watchEffect |
|---------|-------|-------------|
| Dependencies | Explicit | Auto-tracked |
| Initial run | No (unless immediate) | Yes |
| Old value access | Yes | No |
| Conditional deps | All tracked | Only accessed |

**Use watch when:**
- You need explicit dependency control
- You need access to old values
- Conditional logic affects which values matter

**Use watchEffect when:**
- All dependencies are always accessed
- You want simpler syntax
- Initial execution is needed

## Reference

- [Vue watch vs watchEffect](https://vuejs.org/guide/essentials/watchers.html#watch-vs-watcheffect)
- [watchEffect API](https://vuejs.org/api/reactivity-core.html#watcheffect)
