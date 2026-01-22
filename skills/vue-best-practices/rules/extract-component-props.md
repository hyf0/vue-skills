---
title: Extract Component Props
impact: HIGH
impactDescription: extract props, emits, slots types from .vue components
type: capability
tags: typescript, props, emits, slots, vue-component-type-helpers, wrapper, ComponentProps
---

# Extract Component Props

**Impact: HIGH** - extract props, emits, slots types from .vue components

Use `vue-component-type-helpers` to extract types from `.vue` components:

```bash
npm install -D vue-component-type-helpers
```

```typescript
import type { ComponentProps, ComponentEmit, ComponentSlots, ComponentExposed } from 'vue-component-type-helpers'
import MyButton from './MyButton.vue'

type Props = ComponentProps<typeof MyButton>
type Emits = ComponentEmit<typeof MyButton>
type Slots = ComponentSlots<typeof MyButton>
type Exposed = ComponentExposed<typeof MyButton>
```

## Wrapper Component Pattern

```typescript
import type { ComponentProps } from 'vue-component-type-helpers'
import BaseButton from './BaseButton.vue'

type BaseProps = ComponentProps<typeof BaseButton>

interface Props extends BaseProps {
  size: 'sm' | 'md' | 'lg'
}

defineProps<Props>()
```

## Do NOT Use

```typescript
// ❌ Includes Vue internal properties (onUpdate:*, class, style, etc.)
type Props = InstanceType<typeof MyButton>['$props']

// ❌ Cannot export from <script setup>
export interface Props { ... }
```

## Note

Vue's built-in `ExtractPropTypes` is for runtime props objects (`props: { foo: String }`), not for `.vue` components.

## Reference

- [vue-component-type-helpers](https://github.com/vuejs/language-tools/tree/master/packages/component-type-helpers)
