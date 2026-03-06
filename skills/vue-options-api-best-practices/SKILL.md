---
name: vue-options-api-best-practices
description: "Provides code examples, solutions, and best practices for Vue.js components written in the Options API style (data(), methods, computed, lifecycle hooks, this context). Use when the user asks about Vue Options API patterns, needs help with reactive data, computed properties, TypeScript integration, prop typing, or lifecycle hooks in traditional Vue style — or prefers Options API over Composition API (non-Composition API, Vue options syntax, classic Vue components). Covers TypeScript with defineComponent, arrow function gotchas, stateful methods, provide/inject limitations, and event handler types. Each reference shows an Options API-only solution."
version: 2.0.0
license: MIT
author: github.com/vuejs-ai
---

Vue.js Options API best practices, TypeScript integration, and common gotchas.

### Quick Reference — Most Common Issues

| Problem | Fix |
|---|---|
| No TypeScript type inference on `this` | Wrap component with `defineComponent({...})` |
| Method loses `this` context | Use `function` keyword, not arrow functions, in `methods` |
| Debounced method shared across instances | Create the debounced function inside `created()`, not at definition time |

```ts
// Critical: always use defineComponent for TypeScript support
import { defineComponent } from 'vue'
export default defineComponent({
  data() { return { count: 0 } },
  methods: {
    increment() { this.count++ }   // ✅ regular function — this is typed
  }
})
```

---

### TypeScript
- Need to enable TypeScript type inference for component properties → See [ts-options-api-use-definecomponent](reference/ts-options-api-use-definecomponent.md)
- Enabling type safety for Options API this context → See [ts-strict-mode-options-api](reference/ts-strict-mode-options-api.md)
- Using old TypeScript versions with prop validators → See [ts-options-api-arrow-functions-validators](reference/ts-options-api-arrow-functions-validators.md)
- Event handler parameters need proper type safety → See [ts-options-api-type-event-handlers](reference/ts-options-api-type-event-handlers.md)
- Need to type object or array props with interfaces → See [ts-options-api-proptype-complex-types](reference/ts-options-api-proptype-complex-types.md)
- Injected properties missing TypeScript types completely → See [ts-options-api-provide-inject-limitations](reference/ts-options-api-provide-inject-limitations.md)
- Complex computed properties lack clear type documentation → See [ts-options-api-computed-return-types](reference/ts-options-api-computed-return-types.md)

### Methods & Lifecycle
- Methods aren't binding to component instance context → See [no-arrow-functions-in-methods](reference/no-arrow-functions-in-methods.md)
- Lifecycle hooks losing access to component data → See [no-arrow-functions-in-lifecycle-hooks](reference/no-arrow-functions-in-lifecycle-hooks.md)
- Debounced functions sharing state across component instances → See [stateful-methods-lifecycle](reference/stateful-methods-lifecycle.md)
