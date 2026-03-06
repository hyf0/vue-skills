---
name: vue-pinia-best-practices
description: "Helps create Pinia stores, define getters and actions, implement store composition, and handle reactive state in Vue 3 applications. Use when the user asks about Pinia, Vue state management, defineStore, useStore, creating or modifying stores, store destructuring, storeToRefs, .store.ts files, Vue 3 state patterns, or troubleshooting common Pinia errors such as reactivity loss or missing DevTools state."
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
---

Pinia best practices, common gotchas, and state management patterns.

### Quick Fixes

Most common one-liner solutions:

```js
// Destructuring a store? Use storeToRefs to preserve reactivity
const { count, name } = storeToRefs(useCounterStore())
```

```js
// Calling a store method in a template? Always bind with parentheses
<button @click="store.increment()">Click</button>
```

### Store Setup

Basic store definition with `defineStore`:

```js
// counter.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getter
  const double = computed(() => count.value * 2)

  // action
  function increment() {
    count.value++
  }

  // Must return all state, getters, and actions for DevTools and SSR
  return { count, double, increment }
})
```

Common setup issues:
- Getting "getActivePinia was called" error at startup → See [pinia-no-active-pinia-error](reference/pinia-no-active-pinia-error.md)
- Setup stores missing state in DevTools or SSR → See [pinia-setup-store-return-all-state](reference/pinia-setup-store-return-all-state.md)

### Reactivity
- Store destructuring stops updating UI reactively → See [pinia-store-destructuring-breaks-reactivity](reference/pinia-store-destructuring-breaks-reactivity.md)
- Store methods lose context in template calls → See [store-method-binding-parentheses](reference/store-method-binding-parentheses.md)

### State Patterns
- Filters reset on refresh or can't be shared → See [state-url-for-ephemeral-filters](reference/state-url-for-ephemeral-filters.md)
- Building production app without DevTools or conventions → See [state-use-pinia-for-large-apps](reference/state-use-pinia-for-large-apps.md)
