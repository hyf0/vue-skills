---
title: CSS v-bind for Reactive Styles
impact: MEDIUM
impactDescription: safely use reactive JavaScript values in CSS
type: efficiency
tags: css, v-bind, scoped, styles, reactive
---

# CSS v-bind for Reactive Styles

**Impact: MEDIUM** - safely use reactive JavaScript values in CSS

Vue 3 supports `v-bind()` in `<style>` blocks to use reactive values in CSS. Understanding the patterns prevents common pitfalls.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const color = ref('red')
const fontSize = ref(16)
</script>

<template>
  <p class="text">Hello</p>
</template>

<style scoped>
.text {
  color: v-bind(color);
  font-size: v-bind(fontSize + 'px');
}
</style>
```

## Computed Properties for Complex Values

```vue
<script setup lang="ts">
const theme = ref({
  primary: '#42b883',
  secondary: '#35495e'
})

// Use computed for derived values
const primaryColor = computed(() => theme.value.primary)
const gradient = computed(() =>
  `linear-gradient(to right, ${theme.value.primary}, ${theme.value.secondary})`
)
</script>

<style scoped>
.button {
  background: v-bind(primaryColor);
}
.hero {
  background: v-bind(gradient);
}
</style>
```

## Gotchas

**1. Quotes for complex expressions**
```vue
<style scoped>
/* Simple variable - no quotes needed */
.text { color: v-bind(color); }

/* Expression with operators - use quotes */
.box { width: v-bind('size + "px"'); }

/* Nested property access - use quotes */
.card { color: v-bind('theme.primary'); }
</style>
```

**2. Initial render flash**
```vue
<script setup lang="ts">
// Provide fallback to prevent flash
const color = ref('blue')  // Has initial value
</script>

<style scoped>
.text {
  /* Fallback for SSR/initial render */
  color: blue;
  color: v-bind(color);
}
</style>
```

**3. Performance with many bindings**
```vue
<script setup lang="ts">
// Instead of many individual refs...
const primaryColor = ref('#000')
const secondaryColor = ref('#fff')
const borderRadius = ref('4px')

// Consider a single theme object
const theme = reactive({
  primaryColor: '#000',
  secondaryColor: '#fff',
  borderRadius: '4px'
})
</script>
```

## With Scoped Styles

v-bind works with scoped styles:
```vue
<style scoped>
/* These CSS custom properties are scoped to component */
.element {
  --dynamic-color: v-bind(color);
  background: var(--dynamic-color);
}
</style>
```

## SSR Considerations

v-bind in CSS is SSR-compatible - values are inlined during server render.

## Reference

- [Vue CSS v-bind](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)
- [Vue SFC CSS Features](https://vuejs.org/api/sfc-css-features.html)
