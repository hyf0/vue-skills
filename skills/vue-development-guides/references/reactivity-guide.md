# Reactivity Guide

## Tasks Checklist

- [ ] Declare reactive state correctly
- [ ] Avoid destructuring from `reactive()` directly
- [ ] Watch correctly for `reactive` state if needed
- [ ] Follow `computed()` best practices
- [ ] Clean up async effects for watchers

---

## Declare reactive state correctly in Vue.js

### Primitive values (string, number, boolean, null, etc.)

- Always use `shallowRef()` instead of `ref()` for better performance.

### Objects / arrays / Map / Set

- `ref()`:
  - Use when you often **replace the whole value** (`state.value = newObj`) and still want deep reactivity for nested fields.
- `reactive()`:
  - Use when you mainly **mutate properties** (`state.count++`, `state.nested.x = ...`) and full replacement is uncommon.
- `shallowRef()`:
  - Use for **opaque/non-reactive objects** (class instances, external libs, very large nested data).
  - Only triggers updates when you replace `state.value` (no deep tracking).
- `shallowReactive()`:
  - Use when you want **only top-level properties reactive**; nested objects stay raw.

Bad: using `reactive()` for replaceable state. ([Reference](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive))

```ts
let user = reactive({ id: 1, name: 'Tom' })

async function reload() {
  // ❌ Replacing the proxy breaks references held elsewhere
  user = reactive(await fetchUser())
}
```

Good: use a `ref()` for replaceable objects

```ts
const user = ref<{ id: number; name: string }>()

async function reload() {
  user.value = await fetchUser()
}
```
