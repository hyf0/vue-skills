---
title: Pinia Getters Circular Type Reference
impact: MEDIUM
impactDescription: fixes TypeScript any or circular errors in getters using this
type: efficiency
tags: pinia, getters, circular-reference, typescript, this-type
---

# Pinia Getters Circular Type Reference

**Impact: MEDIUM** - fixes TypeScript `any` or circular errors in getters using `this`

When a Pinia getter references another getter via `this`, TypeScript shows `any` type or circular reference errors. Using `ReturnType<typeof useMyStore>` causes circular errors for getters (works for actions only).

## Symptoms

- Getter returns `any` when using `this.otherGetter`
- "Type 'Store' is not assignable to type..." circular error
- `ReturnType<typeof useStore>` breaks with getters
- IDE shows no autocomplete for getter values

## Root Cause

TypeScript's `ThisType` inference cannot resolve getter return types when they reference each other. The type system needs explicit annotations to break the circular dependency.

## Fix

**Option 1: Always define explicit return types for getters**
```typescript
// store.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    // Explicit return type required when using this
    doubleCount(): number {
      return this.count * 2
    },
    quadrupleCount(): number {
      return this.doubleCount * 2  // Now properly typed
    }
  }
})
```

**Option 2: Use Setup Store syntax**
```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  // No this-typing issues with computed
  const doubleCount = computed(() => count.value * 2)
  const quadrupleCount = computed(() => doubleCount.value * 2)

  return { count, doubleCount, quadrupleCount }
})
```

**Option 3: For store-to-store dependencies, use delayed access**
```typescript
// In store A
getters: {
  combined(): number {
    // Access store B lazily to avoid circular import
    const storeB = useStoreB()
    return this.value + storeB.value
  }
}
```

## Anti-Pattern: ReturnType with Getters

```typescript
// DON'T DO THIS - causes circular errors
type StoreType = ReturnType<typeof useCounterStore>
const doubleCount = computed((): StoreType['doubleCount'] => ...)

// DO THIS - explicit return type
const doubleCount = computed((): number => ...)
```

## Reference

- [Pinia Discussion #983](https://github.com/vuejs/pinia/discussions/983)
- [Pinia Getters Docs](https://pinia.vuejs.org/core-concepts/getters.html)
