---
title: Reactive Destructuring Loss Pattern
impact: HIGH
impactDescription: prevents silent reactivity loss when destructuring reactive objects
type: efficiency
tags: reactive, destructuring, toRefs, reactivity, composition-api
---

# Reactive Destructuring Loss Pattern

**Impact: HIGH** - prevents silent reactivity loss when destructuring reactive objects

Destructuring a reactive object extracts primitive values, losing their reactive connection. This causes silent bugs where UI doesn't update.

## Symptoms

- Component doesn't re-render when state changes
- Destructured values stay at initial value
- Works with `state.property` but not destructured `property`
- No error messages, just silent failure

## Problem Pattern

```typescript
// This loses reactivity!
const state = reactive({ count: 0, name: 'Vue' })
const { count, name } = state

// count is now just the number 0, not reactive
count  // Always 0, even after state.count changes

// These don't work as expected:
watch(count, () => { /* Never fires */ })
```

## Fix

**Option 1: Use toRefs() for destructuring**
```typescript
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: 'Vue' })
const { count, name } = toRefs(state)

// count is now Ref<number>, linked to state
count.value++  // Updates state.count too
state.count++  // Updates count.value too
```

**Option 2: Use toRef() for single property**
```typescript
import { reactive, toRef } from 'vue'

const state = reactive({ count: 0 })
const count = toRef(state, 'count')

count.value++  // Works, updates state.count
```

**Option 3: Don't destructure, use refs from start**
```typescript
import { ref } from 'vue'

// Instead of reactive + destructure, just use refs
const count = ref(0)
const name = ref('Vue')

// No destructuring needed, no reactivity loss
```

## In Templates

```vue
<template>
  <!-- Both work in templates -->
  <span>{{ state.count }}</span>
  <span>{{ count }}</span>  <!-- If count is from toRefs -->
</template>

<script setup lang="ts">
const state = reactive({ count: 0 })
const { count } = toRefs(state)  // Required for destructured use
</script>
```

## Why This Happens

JavaScript destructuring extracts values at the moment of execution:
```typescript
const state = reactive({ count: 0 })
const { count } = state  // count = 0 (primitive, not proxy)
```

Vue's reactivity uses Proxies that track property access. Destructuring bypasses the proxy.

## Reference

- [Vue Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#additional-ref-unwrapping-details)
- [toRefs API](https://vuejs.org/api/reactivity-utilities.html#torefs)
