---
title: JSDoc Documentation for Script Setup Components
impact: MEDIUM
impactDescription: enables proper documentation for composition API components
type: capability
tags: jsdoc, script-setup, documentation, composition-api, component
---

# JSDoc Documentation for Script Setup Components

**Impact: MEDIUM** - enables proper documentation for composition API components

`<script setup>` doesn't have an obvious place to attach JSDoc comments for the component itself. Use a dual-script pattern.

## Problem

**Incorrect:**
```vue
<script setup lang="ts">
/**
 * This comment doesn't appear in IDE hover or docs
 * @component
 */
import { ref } from 'vue'

const count = ref(0)
</script>
```

JSDoc comments inside `<script setup>` don't attach to the component export because there's no explicit export statement.

## Solution

Use both `<script>` and `<script setup>` blocks:

**Correct:**
```vue
<script lang="ts">
/**
 * A counter component that displays and increments a value.
 *
 * @example
 * ```vue
 * <Counter :initial="5" @update="handleUpdate" />
 * ```
 *
 * @component
 */
export default {}
</script>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  /** Starting value for the counter */
  initial?: number
}>()

const emit = defineEmits<{
  /** Emitted when counter value changes */
  update: [value: number]
}>()

const count = ref(props.initial ?? 0)
</script>
```

## How It Works

- The regular `<script>` block's default export is merged with `<script setup>`
- JSDoc on `export default {}` attaches to the component
- Props and emits JSDoc in `<script setup>` still work normally

## What Gets Documented

| Location | Shows In |
|----------|----------|
| `export default {}` JSDoc | Component import hover |
| `defineProps` JSDoc | Prop hover in templates |
| `defineEmits` JSDoc | Event handler hover |

## Reference

- [Vue Language Tools Discussion #5932](https://github.com/vuejs/language-tools/discussions/5932)
