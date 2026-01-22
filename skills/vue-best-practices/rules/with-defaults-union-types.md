---
title: withDefaults Incorrect Default with Union Types
impact: MEDIUM
impactDescription: fixes incorrect default value behavior with union type props
type: capability
tags: withDefaults, defineProps, union-types, defaults, vue-3.5
---

# withDefaults Incorrect Default with Union Types

**Impact: MEDIUM** - fixes spurious "Missing required prop" warning with union type props

Using `withDefaults` with union types like `false | string` may produce a Vue runtime warning "Missing required prop" even when a default is provided. The runtime value IS applied correctly, but the warning can be confusing.

## Symptoms

- Vue warns "Missing required prop" despite default being set
- Warning appears only with union types like `false | string`
- TypeScript types are correct
- Runtime value IS correct (the default is applied)

## Problematic Pattern

```typescript
// This produces a spurious warning (but works at runtime)
interface Props {
  value: false | string  // Union type
}

const props = withDefaults(defineProps<Props>(), {
  value: 'default'  // Runtime value IS correct, but Vue warns about missing prop
})
```

## Fix

**Option 1: Use Reactive Props Destructure (Vue 3.5+)**
```vue
<script setup lang="ts">
interface Props {
  value: false | string
}

// Preferred in Vue 3.5+
const { value = 'default' } = defineProps<Props>()
</script>
```

**Option 2: Use runtime declaration**
```vue
<script setup lang="ts">
const props = defineProps({
  value: {
    type: [Boolean, String] as PropType<false | string>,
    default: 'default'
  }
})
</script>
```

**Option 3: Split into separate props**
```typescript
interface Props {
  enabled: boolean
  customValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  enabled: false,
  customValue: 'default'
})
```

## Why Reactive Props Destructure Works

Vue 3.5's Reactive Props Destructure handles default values at the destructuring level, bypassing the type inference issues with `withDefaults`.

```typescript
// The default is applied during destructuring, not type inference
const { prop = 'default' } = defineProps<{ prop?: string }>()
```

## Enable Reactive Props Destructure

This is enabled by default in Vue 3.5+. For older versions:
```javascript
// vite.config.js
export default {
  plugins: [
    vue({
      script: {
        propsDestructure: true
      }
    })
  ]
}
```

## Reference

- [vuejs/core#12897](https://github.com/vuejs/core/issues/12897)
- [Reactive Props Destructure RFC](https://github.com/vuejs/rfcs/discussions/502)
