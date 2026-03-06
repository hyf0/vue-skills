---
name: vue-jsx-best-practices
description: Guides Vue JSX development by resolving syntax differences from React JSX, configuring the Vue JSX plugin, and fixing attribute type errors. Use when working with JSX or TSX in Vue, migrating React JSX to Vue, setting up @vue/babel-plugin-jsx or Vite JSX support, or encountering issues with class vs className, render functions, v-model, or event handler syntax in Vue.
version: 2.0.0
license: MIT
author: github.com/vuejs-ai
---

Vue JSX best practices and differences from React JSX.

## Key Syntax Differences: Vue JSX vs React JSX

| Concern | React JSX | Vue JSX |
|---|---|---|
| CSS class | `className="foo"` | `class="foo"` |
| Inline style | `style={{ color: 'red' }}` | `style={{ color: 'red' }}` (same) |
| Click handler | `onClick={handler}` | `onClick={handler}` (same) |
| Two-way binding | `value` + `onChange` | `v-model={ref}` |
| Conditional render | `{condition && <X />}` | `{condition && <X />}` (same) |
| Slots (children) | `props.children` | `slots.default?.()` |
| Fragment | `<></>` | `<></>` (same) |
| Key | `key={id}` | `key={id}` (same) |

## Quick Migration Workflow (React JSX → Vue JSX)

1. **Replace `className` with `class`** — Vue's JSX uses standard HTML attribute names.
2. **Update two-way bindings** — replace controlled `value`/`onChange` pairs with `v-model={ref}`.
3. **Replace `props.children`** — use `slots.default?.()` to render default slot content.
4. **Remove React imports** — delete `import React from 'react'`; Vue 3 JSX does not need it.
5. **Configure the plugin** — ensure `@vue/babel-plugin-jsx` (Babel) or the Vite equivalent is installed and active (see [render-function-jsx-vue-vs-react](reference/render-function-jsx-vue-vs-react.md)).

## Code Example

```tsx
// ✅ Correct Vue JSX
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const inputValue = ref('')

    return () => (
      <div class="container">
        <input v-model={inputValue.value} class="input-field" />
        <button onClick={() => console.log(inputValue.value)}>
          Submit
        </button>
      </div>
    )
  },
})
```

```tsx
// ❌ React patterns that break in Vue JSX
<div className="container">          {/* use class= instead */}
  <input value={val} onChange={fn} /> {/* use v-model={ref} instead */}
  {props.children}                    {/* use slots.default?.() instead */}
</div>
```

## Plugin Configuration

For Vite projects, add JSX support in `vite.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default {
  plugins: [vue(), vueJsx()],
}
```

For Babel-based projects, add to `babel.config.js`:

```js
module.exports = {
  plugins: ['@vue/babel-plugin-jsx'],
}
```

## Further Reference

- Migrating React JSX code to Vue or getting attribute type errors → See [render-function-jsx-vue-vs-react](reference/render-function-jsx-vue-vs-react.md)
