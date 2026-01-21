---
title: Script Setup Best Practices
impact: HIGH
impactDescription: optimal patterns for Vue 3 script setup syntax
type: efficiency
tags: script-setup, sfc, composition-api, typescript, macros
---

# Script Setup Best Practices

**Impact: HIGH** - optimal patterns for Vue 3 script setup syntax

Script setup has unique patterns and macros that differ from standard composition API usage.

## Key Patterns

**1. Compiler macros don't need imports**
```vue
<script setup lang="ts">
// These are compiler macros - don't import them!
// import { defineProps, defineEmits } from 'vue'  // WRONG

const props = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'close'): void
}>()
</script>
```

**2. Use defineOptions for component options**
```vue
<script setup lang="ts">
// Component name, inheritAttrs, etc.
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false
})
</script>
```

**3. defineExpose for public API**
```vue
<script setup lang="ts">
const internalState = ref(0)
const publicMethod = () => { /* ... */ }

// Only expose what's needed
defineExpose({
  publicMethod
  // internalState not exposed
})
</script>
```

**4. Top-level await support**
```vue
<script setup lang="ts">
// Top-level await makes component async
const data = await fetchData()

// Parent must use Suspense
</script>
```

## Props with Defaults

```vue
<script setup lang="ts">
// Type-only props with defaults
interface Props {
  title: string
  count?: number
  items?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []  // Factory for non-primitives
})

// Or use reactive destructure (Vue 3.5+)
const { title, count = 0 } = defineProps<Props>()
</script>
```

## Generic Components

```vue
<script setup lang="ts" generic="T extends string | number">
defineProps<{
  items: T[]
  selected: T
}>()

defineEmits<{
  (e: 'select', item: T): void
}>()
</script>
```

## Template Refs

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

// Option 1: ref with same name as template ref
const inputEl = ref<HTMLInputElement | null>(null)

// Option 2: useTemplateRef (Vue 3.5+)
const buttonEl = useTemplateRef<HTMLButtonElement>('button')
</script>

<template>
  <input ref="inputEl" />
  <button ref="button">Click</button>
</template>
```

## Reference

- [Script Setup Documentation](https://vuejs.org/api/sfc-script-setup.html)
- [defineOptions RFC](https://github.com/vuejs/rfcs/discussions/430)
