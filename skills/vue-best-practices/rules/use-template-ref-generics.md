---
title: useTemplateRef with Generic Components
impact: MEDIUM
impactDescription: fixes incorrect type inference for refs to generic components
type: capability
tags: useTemplateRef, generics, ref, template-ref, vue-3.5, ComponentExposed
---

# useTemplateRef with Generic Components

**Impact: MEDIUM** - fixes incorrect type inference for refs to generic components

When using `useTemplateRef` on a generic component (one with `generic="T"` attribute), the returned type only contains `defineExpose` functions, missing the HTML element type.

## Symptoms

- `useTemplateRef` returns type with only exposed methods
- Missing HTMLElement methods like `focus()`, `scrollIntoView()`
- TypeScript errors when accessing DOM element properties
- Type inference works for non-generic components but breaks for generic ones

## Root Cause

This is a known bug in @vue/language-tools. The automatic type inference only works correctly for non-generic components. Generic components lose their element type information.

## Fix

**Use ComponentExposed helper type:**
```typescript
import { useTemplateRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import MyGenericModal from './MyGenericModal.vue'

// Incorrect - returns incomplete type for generic components
const modal = useTemplateRef('modal')

// Correct - explicit type with ComponentExposed
const modal = useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')
```

## Install Helper Package

```bash
npm install -D vue-component-type-helpers
```

## Alternative: Type Assertion

If you don't want the helper package:
```typescript
import type { ComponentPublicInstance } from 'vue'

const modal = useTemplateRef('modal') as Ref<ComponentPublicInstance & {
  open: () => void
  close: () => void
} | null>
```

## When This Is Fixed

Check [vuejs/language-tools#5120](https://github.com/vuejs/language-tools/issues/5120) for status. Once fixed, you can remove the explicit type annotation.

## Reference

- [vuejs/language-tools#5120](https://github.com/vuejs/language-tools/issues/5120)
- [vue-component-type-helpers](https://www.npmjs.com/package/vue-component-type-helpers)
