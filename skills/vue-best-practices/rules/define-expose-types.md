---
title: defineExpose TypeScript Type Inference
impact: MEDIUM
impactDescription: fixes "Property does not exist" errors when accessing exposed component methods
type: efficiency
tags: defineExpose, expose, component-ref, typescript, InstanceType
---

# defineExpose TypeScript Type Inference

**Impact: MEDIUM** - fixes "Property does not exist" errors when accessing exposed component methods

When using `defineExpose({ method: fn })`, accessing the exposed method via parent ref (`childRef.value.method`) works at runtime but TypeScript shows "Property 'method' does not exist on type" errors.

## Symptoms

- `InstanceType<typeof Component>` doesn't include exposed properties
- "Property 'X' does not exist" even though it works at runtime
- Exposed methods/properties have type `any`
- Type errors only in parent component, not child

## Root Cause

TypeScript's `InstanceType<typeof Component>` reflects the component's internal type, not the publicly exposed interface. `defineExpose` creates a runtime API that TypeScript cannot automatically infer.

## Fix

**Option 1: Export and use explicit interface**
```vue
<!-- Child.vue -->
<script setup lang="ts">
export interface ChildExposed {
  open: () => void
  close: () => void
}

const open = () => { /* ... */ }
const close = () => { /* ... */ }

defineExpose<ChildExposed>({ open, close })
</script>
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import Child, { type ChildExposed } from './Child.vue'

const childRef = ref<ChildExposed | null>(null)

// Now properly typed
childRef.value?.open()
</script>

<template>
  <Child ref="childRef" />
</template>
```

**Option 2: Use ComponentExposed helper**
```typescript
import type { ComponentExposed } from 'vue-component-type-helpers'
import Child from './Child.vue'

const childRef = ref<ComponentExposed<typeof Child> | null>(null)
```

## Critical: defineExpose Position

`defineExpose` must be called BEFORE any top-level `await`:

```vue
<script setup lang="ts">
// WRONG - defineExpose after await loses types
await fetchData()
defineExpose({ method })

// CORRECT - defineExpose before await
defineExpose({ method })
await fetchData()
</script>
```

## When Using with Generic Components

See [use-template-ref-generics](use-template-ref-generics.md) for additional patterns.

## Reference

- [vuejs/core#4397](https://github.com/vuejs/core/issues/4397)
- [vuejs/core#10978](https://github.com/vuejs/core/issues/10978)
- [defineExpose docs](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
