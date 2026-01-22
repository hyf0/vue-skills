---
title: defineModel Fires Update Event with Undefined
impact: MEDIUM
impactDescription: fixes runtime errors from unexpected undefined in model updates
type: capability
tags: defineModel, v-model, update-event, undefined, vue-3.5
---

# defineModel Fires Update Event with Undefined

**Impact: MEDIUM** - fixes runtime errors from unexpected undefined in model updates

> **Version Note (2025):** This issue may be resolved in Vue 3.5+. Testing with Vue 3.5.26 could not reproduce the double emission with `undefined`. If you're on Vue 3.5+, verify the issue exists in your specific scenario before applying workarounds.

Components using `defineModel` may fire the `@update:model-value` event with `undefined` in certain edge cases. TypeScript types don't always reflect this behavior, potentially causing runtime errors when the parent expects a non-nullable value.

## Symptoms

- Parent component receives `undefined` unexpectedly
- Runtime error: "Cannot read property of undefined"
- Type mismatch between expected `T` and received `T | undefined`
- Issue appears when clearing/resetting the model value

## Root Cause

`defineModel` returns `Ref<T | undefined>` by default, even when `T` is non-nullable. The update event can fire with `undefined` when:
- Component unmounts
- Model is explicitly cleared
- Internal state resets

## Fix

**Option 1: Use required option (Vue 3.5+)**
```typescript
// Returns Ref<Item> instead of Ref<Item | undefined>
const model = defineModel<Item>({ required: true })
```

**Option 2: Type parent handler to accept undefined**
```vue
<template>
  <MyComponent
    v-model="item"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
// Handle both value and undefined
const handleUpdate = (value: Item | undefined) => {
  if (value !== undefined) {
    item.value = value
  }
}
</script>
```

**Option 3: Use default value in defineModel**
```typescript
const model = defineModel<string>({ default: '' })
```

## Type Declaration Pattern

```typescript
// In child component
interface Props {
  modelValue: Item
}
const model = defineModel<Item>({ required: true })

// Emits will be typed as (value: Item) not (value: Item | undefined)
```

## Reference

- [vuejs/core#12817](https://github.com/vuejs/core/issues/12817)
- [vuejs/core#10103](https://github.com/vuejs/core/issues/10103)
- [defineModel docs](https://vuejs.org/api/sfc-script-setup.html#definemodel)
