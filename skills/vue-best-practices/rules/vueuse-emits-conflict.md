---
title: VueUse Composables Type Conflict with defineEmits
impact: MEDIUM
impactDescription: fixes $emit type incompatibility with VueUse element composables
type: capability
tags: vueuse, defineEmits, component-ref, typescript, $emit
---

# VueUse Composables Type Conflict with defineEmits

**Impact: MEDIUM** - fixes $emit type incompatibility with VueUse element composables

Using VueUse composables like `useElementBounding` with component refs that have `defineEmits` causes TypeScript errors: "Types of property '$emit' are incompatible".

## Symptoms

- "Types of property '$emit' are incompatible" error
- VueUse composable ref typing fails with custom components
- Works with native elements but not Vue components
- Error appears only in TypeScript, runtime works fine

## Root Cause

VueUse expects element refs with standard DOM event types. Vue components with `defineEmits` have a customized `$emit` type that conflicts with VueUse's expected type signature.

## Fix

**Option 1: Use element refs instead of component refs**
```vue
<template>
  <!-- Use ref on wrapper element, not component -->
  <div ref="elementRef">
    <MyComponent />
  </div>
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'

const elementRef = ref<HTMLElement | null>(null)
const { width, height } = useElementBounding(elementRef)
</script>
```

**Option 2: Access $el from component ref**
```vue
<template>
  <MyComponent ref="componentRef" />
</template>

<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { computed } from 'vue'

const componentRef = ref<ComponentPublicInstance | null>(null)
const elementRef = computed(() => componentRef.value?.$el as HTMLElement | undefined)
const { width, height } = useElementBounding(elementRef)
</script>
```

**Option 3: Type assertion (workaround)**
```typescript
const componentRef = ref<any>(null)  // Bypass type checking
const { width, height } = useElementBounding(componentRef)
```

## Vue 2.7 Specific Issue

In Vue 2.7, VueUse types use `Ref<T, T>` (two type params) but Vue 2 only has `Ref<T>`, causing `any` inference:

```typescript
// Vue 2.7 workaround - upgrade to Vue 3 or use assertion
const elementRef = ref(null) as Ref<HTMLElement | null>
```

## Affected VueUse Composables

- `useElementBounding`
- `useElementSize`
- `useElementVisibility`
- `useIntersectionObserver`
- Any composable expecting `MaybeElementRef`

## Reference

- [vuejs/language-tools#5155](https://github.com/vuejs/language-tools/issues/5155)
- [vueuse/vueuse#4343](https://github.com/vueuse/vueuse/issues/4343)
