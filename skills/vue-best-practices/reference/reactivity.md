---
title: Reactivity Core Patterns (ref, reactive, shallowRef, computed, watch)
impact: MEDIUM
impactDescription: Clear reactivity choices keep state predictable and reduce unnecessary updates in Vue 3 apps
type: efficiency
tags: [vue3, reactivity, ref, reactive, shallowRef, computed, watch, watchEffect, external-state, best-practice]
---

# Reactivity Core Patterns (ref, reactive, shallowRef, computed, watch)

**Impact: MEDIUM** - Choose the right reactive primitive first, derive with `computed`, and use watchers only for side effects.

This reference covers the core reactivity decisions for local state, external data, derived values, and effects.

## Table of Contents

- Task Checklist
- State primitives
- Derived state with `computed`
- Side effects with `watch` and `watchEffect`

## Task Checklist

- [ ] Default to `ref()` for primitives and replaceable local state
- [ ] Use `reactive()` for related object state mutated in place
- [ ] Use `shallowRef()` for large payloads and external state snapshots
- [ ] Use `computed()` for derived values (totals, filtered lists, class maps)
- [ ] Keep expensive derivations out of templates (no inline filter/sort/method calls)
- [ ] Use `watch`/`watchEffect` only for side effects
- [ ] Avoid deep watching large objects; watch specific sources instead
- [ ] Use `{ immediate: true }` when a watcher must also run on initial load

## State primitives

### Default to `ref()` for primitives and replaceable state

**Incorrect:**
```ts
import { reactive } from 'vue'

const count = reactive(0)
let state = reactive({ items: [] })

state = reactive({ items: [1, 2, 3] })
```

**Correct:**
```ts
import { ref } from 'vue'

const count = ref(0)
const state = ref({ items: [] })

state.value = { items: [1, 2, 3] }
```

### Use `reactive()` for tightly related in-place mutations

**Incorrect:**
```ts
import { ref } from 'vue'

const firstName = ref('')
const lastName = ref('')
const email = ref('')

function resetForm() {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
}
```

**Correct:**
```ts
import { reactive } from 'vue'

const form = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

function resetForm() {
  form.firstName = ''
  form.lastName = ''
  form.email = ''
}
```

### Use `shallowRef()` for large or external data

**Incorrect:**
```ts
import { ref } from 'vue'

const users = ref(await fetchUsers())
```

**Correct:**
```ts
import { shallowRef } from 'vue'

const users = shallowRef(await fetchUsers())
users.value = await fetchUsers()
```

### External state integration pattern

**Incorrect:**
```ts
import { reactive } from 'vue'

const store = reactive(createExternalStore())
store.state.count++
```

**Correct:**
```ts
import { shallowRef, readonly } from 'vue'

const externalStore = createExternalStore()
const state = shallowRef(externalStore.getState())

function dispatch(action) {
  state.value = reduce(state.value, action)
}

export const store = {
  state: readonly(state),
  dispatch
}
```

## Derived state with `computed`

### Prefer `computed` over watcher-assigned derived refs

**Incorrect:**
```ts
import { ref, watchEffect } from 'vue'

const items = ref([{ price: 10 }, { price: 20 }])
const total = ref(0)

watchEffect(() => {
  total.value = items.value.reduce((sum, item) => sum + item.price, 0)
})
```

**Correct:**
```ts
import { ref, computed } from 'vue'

const items = ref([{ price: 10 }, { price: 20 }])
const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
)
```

### Keep filtered/sorted derivations out of templates

**Incorrect:**
```vue
<template>
  <li v-for="item in items.filter(item => item.active)" :key="item.id">
    {{ item.name }}
  </li>

  <li v-for="item in getSortedItems()" :key="item.id">
    {{ item.name }}
  </li>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'B', active: true },
  { id: 2, name: 'A', active: false }
])

function getSortedItems() {
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
}
</script>
```

**Correct:**
```vue
<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'B', active: true },
  { id: 2, name: 'A', active: false }
])

const visibleItems = computed(() =>
  items.value
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name))
)
</script>

<template>
  <li v-for="item in visibleItems" :key="item.id">
    {{ item.name }}
  </li>
</template>
```

### Use `computed` for reusable class/style logic

**Incorrect:**
```vue
<template>
  <button :class="{ btn: true, 'btn-primary': type === 'primary' && !disabled, 'btn-disabled': disabled }">
    {{ label }}
  </button>
</template>
```

**Correct:**
```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'primary' },
  disabled: Boolean,
  label: String
})

const buttonClasses = computed(() => ({
  btn: true,
  [`btn-${props.type}`]: !props.disabled,
  'btn-disabled': props.disabled
}))
</script>

<template>
  <button :class="buttonClasses">
    {{ label }}
  </button>
</template>
```

## Side effects with `watch` and `watchEffect`

### Avoid deep watchers on large objects

**Incorrect:**
```ts
import { reactive, watch } from 'vue'

const state = reactive({
  users: [],
  settings: { theme: 'dark', locale: 'en' }
})

watch(
  state,
  () => {
    console.log('State changed')
  },
  { deep: true }
)
```

**Correct:**
```ts
import { reactive, watch, watchEffect } from 'vue'

const state = reactive({
  users: [],
  settings: { theme: 'dark', locale: 'en' }
})

watch(() => state.settings.theme, (theme) => {
  applyTheme(theme)
})

watchEffect(() => {
  setLocale(state.settings.locale)
})
```

### Choose `watchEffect` vs `watch` based on control needs

**Use `watchEffect` when the callback should react to exactly what it reads:**
```ts
import { ref, watchEffect } from 'vue'

const todoId = ref(1)
const data = ref(null)

watchEffect(async () => {
  const response = await fetch(`/api/todos/${todoId.value}`)
  data.value = await response.json()
})
```

**Use `watch` when you need old values, explicit sources, or lazy execution:**
```ts
import { ref, watch } from 'vue'

const todoId = ref(1)

watch(todoId, (newId, oldId) => {
  console.log(`Changed from ${oldId} to ${newId}`)
})
```

### Use `immediate: true` instead of duplicate initial calls

**Incorrect:**
```ts
import { ref, watch, onMounted } from 'vue'

const userId = ref(1)

function loadUser(id) {
  // ...
}

onMounted(() => loadUser(userId.value))
watch(userId, (id) => loadUser(id))
```

**Correct:**
```ts
import { ref, watch } from 'vue'

const userId = ref(1)

watch(
  userId,
  (id) => loadUser(id),
  { immediate: true }
)
```

## Reference
- [Vue.js Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue.js shallowRef API](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [Vue.js reactive API](https://vuejs.org/api/reactivity-core.html#reactive)
- [Vue.js computed API](https://vuejs.org/api/reactivity-core.html#computed)
- [Vue.js watch API](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue.js watchEffect API](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue.js Computed Caching vs Methods](https://vuejs.org/guide/essentials/computed.html#computed-caching-vs-methods)
- [Vue.js Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style.html)
- [Vue.js Watchers](https://vuejs.org/guide/essentials/watchers.html)
