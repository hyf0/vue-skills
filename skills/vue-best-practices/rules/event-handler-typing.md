---
title: Event Handler Typing
impact: MEDIUM
impactDescription: correctly type native and custom event handlers
type: efficiency
tags: typescript, events, emit, handlers, native-events
---

# Event Handler Typing

**Impact: MEDIUM** - correctly type native and custom event handlers

Event handlers in Vue templates need proper typing for both native DOM events and custom component events.

## Native DOM Events

```vue
<template>
  <input @input="handleInput" @keydown="handleKeydown" />
  <button @click="handleClick">Click</button>
</template>

<script setup lang="ts">
// Native events are typed automatically
const handleClick = (event: MouseEvent) => {
  console.log(event.clientX, event.clientY)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  console.log(target.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    // handle enter
  }
}
</script>
```

## Custom Component Events

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
  (e: 'change', payload: { old: string; new: string }): void
}>()
</script>

<!-- ParentComponent.vue -->
<template>
  <ChildComponent
    @update="handleUpdate"
    @delete="handleDelete"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
// Types inferred from child's defineEmits
const handleUpdate = (value: string) => {
  console.log(value)
}

const handleDelete = (id: number) => {
  console.log(id)
}

const handleChange = (payload: { old: string; new: string }) => {
  console.log(payload.old, payload.new)
}
</script>
```

## v-model Event Typing

```vue
<script setup lang="ts">
// Single v-model
const modelValue = defineModel<string>()

// Named v-models
const title = defineModel<string>('title')
const count = defineModel<number>('count', { default: 0 })
</script>
```

## Event Modifiers and Types

```vue
<template>
  <!-- Modifier events still properly typed -->
  <input @keydown.enter="handleEnter" />
  <form @submit.prevent="handleSubmit" />
</template>

<script setup lang="ts">
const handleEnter = (event: KeyboardEvent) => {
  // event.key is 'Enter' due to modifier
}

const handleSubmit = (event: Event) => {
  // preventDefault already called by modifier
  const form = event.target as HTMLFormElement
}
</script>
```

## Typing with Refs

```typescript
// For programmatic event handling
const buttonRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  buttonRef.value?.addEventListener('click', (e: MouseEvent) => {
    // Properly typed
  })
})
```

## Common Event Types

| Event | Type |
|-------|------|
| click | MouseEvent |
| dblclick | MouseEvent |
| mouseenter/leave | MouseEvent |
| keydown/keyup | KeyboardEvent |
| input | Event (use target.value) |
| change | Event |
| submit | Event or SubmitEvent |
| focus/blur | FocusEvent |
| scroll | Event |
| drag* | DragEvent |
| touch* | TouchEvent |

## Reference

- [Vue Events Guide](https://vuejs.org/guide/essentials/event-handling.html)
- [TypeScript DOM Types](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html)
