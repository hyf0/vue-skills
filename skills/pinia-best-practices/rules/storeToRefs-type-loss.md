---
title: storeToRefs Type Loss with Vue 3.5+
impact: HIGH
impactDescription: fixes incorrect double Ref wrapping in storeToRefs with Vue 3.5+
type: capability
tags: pinia, storeToRefs, vue-3.5, ref, typescript, nested-refs
---

# storeToRefs Type Loss with Vue 3.5+

**Impact: HIGH** - fixes incorrect double Ref wrapping in storeToRefs with Vue 3.5+

When using `storeToRefs()` with Pinia stores in Vue 3.5+, TypeScript returns incorrect types for nested refs - wrapping them in double `Ref` types (e.g., `Ref<number, number>` instead of `Ref<number>`). Setup stores may also lose original typings.

## Symptoms

- `storeToRefs` returns `Ref<T, T>` instead of `Ref<T>`
- IDE shows incorrect type like `Ref<number, number>`
- Setup store properties typed as `any`
- Works at runtime but TypeScript complains

## Root Cause

If Pinia depends on Vue 3.2 but your project uses Vue 3.5+, npm/yarn may install two Vue versions. The Ref type signature changed in Vue 3.5, causing type conflicts.

## Fix

**Step 1: Check for duplicate Vue versions**
```bash
npm ls vue
# Should show only one version
```

**Step 2: If duplicates exist, reinstall**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Step 3: Explicit type annotation (workaround)**
```typescript
import { storeToRefs, type ToRefs } from 'pinia'

interface StoreReturn {
  product: Ref<Product>
  count: Ref<number>
}

const { product, count }: ToRefs<Pick<StoreReturn, 'product' | 'count'>> =
  storeToRefs(useProductStore())
```

**Step 4: Update Pinia to latest version**
```bash
npm install pinia@latest
```

## Alternative: Destructure Directly

For simple cases, destructure store state directly with `toRef`:
```typescript
import { toRef } from 'vue'

const store = useProductStore()
const product = toRef(store, 'product')  // Properly typed Ref<Product>
```

## When NOT to Apply

- If `npm ls vue` shows only one Vue version
- If types work correctly (no double Ref wrapping)

## Reference

- [Pinia Issue #2769](https://github.com/vuejs/pinia/issues/2769)
- [Pinia Issue #2574](https://github.com/vuejs/pinia/issues/2574)
