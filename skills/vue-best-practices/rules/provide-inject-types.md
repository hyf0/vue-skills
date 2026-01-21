---
title: provide/inject Type Safety
impact: MEDIUM
impactDescription: enables type-safe dependency injection with InjectionKey
type: efficiency
tags: provide, inject, InjectionKey, typescript, dependency-injection
---

# provide/inject Type Safety

**Impact: MEDIUM** - enables type-safe dependency injection with InjectionKey

Using `inject` returns `unknown` type by default, and injected properties aren't type-inferred. `InjectionKey<T>` only works with Composition API.

## Symptoms

- `inject()` returns `unknown` or `T | undefined`
- Options API `inject` properties not typed
- No autocomplete for injected values
- Missing runtime error when injection fails

## Fix

**Option 1: Use InjectionKey with Composition API**
```typescript
// keys.ts
import type { InjectionKey, Ref } from 'vue'

interface User { id: number; name: string }

export const UserKey: InjectionKey<Ref<User>> = Symbol('user')

// Provider.vue
import { provide, ref } from 'vue'
import { UserKey } from './keys'

const user = ref({ id: 1, name: 'John' })
provide(UserKey, user)

// Consumer.vue
import { inject } from 'vue'
import { UserKey } from './keys'

const user = inject(UserKey)  // Ref<User> | undefined
```

**Option 2: Create strict inject helper**
```typescript
// inject-strict.ts
import { inject, type InjectionKey } from 'vue'

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T): T {
  const resolved = inject(key, fallback)
  if (resolved === undefined) {
    throw new Error(`Could not resolve injection: ${key.description}`)
  }
  return resolved
}

// Usage
const user = injectStrict(UserKey)  // Ref<User> - throws if not provided
```

**Option 3: Default value with type**
```typescript
const user = inject(UserKey, ref({ id: 0, name: 'Guest' }))
// Type is Ref<User> (not undefined) because default is provided
```

## Options API Limitation

`InjectionKey` doesn't work with Options API `inject`:

```typescript
// This won't type correctly in Options API
export default defineComponent({
  inject: {
    user: { from: UserKey }  // Still typed as unknown
  }
})

// Workaround: Use Composition API or manual type assertion
export default defineComponent({
  setup() {
    const user = inject(UserKey)!
    return { user }
  }
})
```

## Always Wrap in Reactive

Provided values should be reactive for proper updates:

```typescript
// WRONG - primitive loses reactivity
provide('count', 5)

// CORRECT - ref maintains reactivity
provide('count', ref(5))

// CORRECT - reactive object
provide('state', reactive({ count: 5 }))
```

## Reference

- [Vue provide/inject docs](https://vuejs.org/guide/components/provide-inject.html)
- [vuejs/core#10447](https://github.com/vuejs/core/discussions/10447)
