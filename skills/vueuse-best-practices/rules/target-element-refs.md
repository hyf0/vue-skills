---
title: Target Element Refs for VueUse
impact: MEDIUM
impactDescription: fixes undefined target errors with VueUse element composables
type: efficiency
tags: vueuse, ref, template-ref, element, MaybeElementRef
---

# Target Element Refs for VueUse

**Impact: MEDIUM** - fixes undefined target errors with VueUse element composables

VueUse composables that target DOM elements need proper ref handling to avoid "Cannot read properties of undefined" errors.

## Symptoms

- "Cannot read properties of undefined (reading 'addEventListener')"
- Composable returns zeros or null values
- Works on second render but not first
- TypeScript errors with element refs

## Fix

**Pattern 1: Use template ref properly**
```vue
<template>
  <div ref="elementRef">Content</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

// Define ref with correct type
const elementRef = ref<HTMLElement | null>(null)

// Pass ref directly - VueUse handles null
const { width, height } = useElementSize(elementRef)
</script>
```

**Pattern 2: Use useTemplateRef (Vue 3.5+)**
```vue
<template>
  <div ref="element">Content</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useElementBounding } from '@vueuse/core'

const element = useTemplateRef<HTMLElement>('element')
const { x, y, width, height } = useElementBounding(element)
</script>
```

**Pattern 3: MaybeElementRef type**
```typescript
import type { MaybeElementRef } from '@vueuse/core'
import { useElementSize } from '@vueuse/core'

// Accept flexible element ref types
function useCustomFeature(target: MaybeElementRef) {
  const { width, height } = useElementSize(target)
  // ... custom logic
  return { width, height }
}
```

## With Component Refs

VueUse expects DOM elements, not component instances:

```vue
<template>
  <MyComponent ref="componentRef" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useElementSize } from '@vueuse/core'

const componentRef = ref<ComponentPublicInstance | null>(null)

// Extract $el from component
const elementRef = computed(() => componentRef.value?.$el)

const { width, height } = useElementSize(elementRef)
</script>
```

## Conditional Elements

For conditionally rendered elements:
```vue
<template>
  <div v-if="show" ref="elementRef">Content</div>
</template>

<script setup lang="ts">
const elementRef = ref<HTMLElement | null>(null)
const show = ref(false)

// VueUse handles null gracefully
// Values update when element appears/disappears
const { width } = useElementSize(elementRef)
</script>
```

## Reference

- [VueUse Element Utilities](https://vueuse.org/core/#elements)
- [MaybeElementRef type](https://vueuse.org/shared/unrefElement/#type-declarations)
