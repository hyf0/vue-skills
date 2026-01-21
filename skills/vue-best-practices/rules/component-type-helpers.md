---
title: Component Type Helpers
impact: HIGH
impactDescription: extract and use component prop, emit, and slot types
type: efficiency
tags: typescript, props, emits, slots, InstanceType, ComponentPublicInstance
---

# Component Type Helpers

**Impact: HIGH** - extract and use component prop, emit, and slot types

Vue provides type utilities to extract prop, emit, and other types from components.

## Extract Prop Types

```typescript
import type { ComponentProps } from 'vue'
import MyComponent from './MyComponent.vue'

// Get props type from component
type Props = ComponentProps<typeof MyComponent>

// Use in parent component
const props: Props = {
  title: 'Hello',
  count: 5
}
```

## Extract Emit Types

```typescript
import type { ComponentEmit } from 'vue'
import MyComponent from './MyComponent.vue'

type Emits = ComponentEmit<typeof MyComponent>

// Use to type event handlers
const handleUpdate: Emits['update'] = (value) => {
  // value is properly typed
}
```

## Instance Type

```typescript
import type { ComponentPublicInstance } from 'vue'
import MyComponent from './MyComponent.vue'

// For template refs
const componentRef = ref<InstanceType<typeof MyComponent> | null>(null)

// Access component methods/properties
componentRef.value?.someMethod()
```

## Using vue-component-type-helpers

```bash
npm install -D vue-component-type-helpers
```

```typescript
import type {
  ComponentProps,
  ComponentEmit,
  ComponentSlots,
  ComponentExposed
} from 'vue-component-type-helpers'
import MyComponent from './MyComponent.vue'

type Props = ComponentProps<typeof MyComponent>
type Emits = ComponentEmit<typeof MyComponent>
type Slots = ComponentSlots<typeof MyComponent>
type Exposed = ComponentExposed<typeof MyComponent>
```

## Typing Slots

```vue
<script setup lang="ts">
// Define typed slots
defineSlots<{
  default(props: { item: Item }): any
  header(): any
  footer(props: { count: number }): any
}>()
</script>
```

## Generic Component Props

```typescript
// Extract props from generic component
import type { ComponentProps } from 'vue'
import GenericList from './GenericList.vue'

// For generic components, specify the type parameter
type ListProps<T> = {
  items: T[]
  selected?: T
}
```

## Wrapper Component Pattern

```vue
<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

type BaseProps = ComponentProps<typeof BaseButton>

// Extend base props
interface Props extends BaseProps {
  variant?: 'primary' | 'secondary'
}

const props = defineProps<Props>()

// Pass through base props
const baseProps = computed((): BaseProps => ({
  disabled: props.disabled,
  // ... other base props
}))
</script>

<template>
  <BaseButton v-bind="baseProps" :class="variant">
    <slot />
  </BaseButton>
</template>
```

## Reference

- [Vue Utility Types](https://vuejs.org/api/utility-types.html)
- [vue-component-type-helpers](https://www.npmjs.com/package/vue-component-type-helpers)
