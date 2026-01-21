---
title: HMR Debugging for Vue SSR
impact: MEDIUM
impactDescription: fixes Hot Module Replacement breaking in Vue SSR applications
type: efficiency
tags: vite, hmr, ssr, vue, hot-reload, server-side-rendering
---

# HMR Debugging for Vue SSR

**Impact: MEDIUM** - fixes Hot Module Replacement breaking in Vue SSR applications

Hot Module Replacement breaks when modifying Vue component `<script setup>` sections in SSR applications. Changes cause errors instead of smooth updates, requiring full page reloads.

## Symptoms

- HMR works for `<template>` changes but breaks for `<script setup>`
- "Cannot read property of undefined" after saving
- Full page reload required after script changes
- HMR works in dev:client but not dev:ssr

## Root Cause

SSR mode has a different transformation pipeline. The Vue plugin's HMR boundary detection doesn't handle SSR modules the same way as client modules.

## Fix

**Step 1: Ensure correct SSR plugin configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  ssr: {
    // Don't externalize these for HMR to work
    noExternal: ['vue', '@vue/runtime-core', '@vue/runtime-dom']
  }
})
```

**Step 2: Configure dev server for SSR HMR**
```typescript
// server.ts
import { createServer } from 'vite'

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom'
})

// Use vite.ssrLoadModule for server-side imports
const { render } = await vite.ssrLoadModule('/src/entry-server.ts')

// Handle HMR
vite.watcher.on('change', async (file) => {
  if (file.endsWith('.vue')) {
    // Invalidate the module
    const mod = vite.moduleGraph.getModuleById(file)
    if (mod) {
      vite.moduleGraph.invalidateModule(mod)
    }
  }
})
```

**Step 3: Add HMR acceptance in entry-server**
```typescript
// entry-server.ts
import { createApp } from './main'

export async function render(url: string) {
  const app = createApp()
  // ... render logic
}

// Accept HMR updates
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

## Framework-Specific Solutions

### Nuxt 3
HMR should work out of the box. If not:
```bash
rm -rf .nuxt node_modules/.vite
npm install
npm run dev
```

### Vite SSR Template
Ensure you're using the latest `@vitejs/plugin-vue`:
```bash
npm install @vitejs/plugin-vue@latest
```

## Debugging

Enable verbose HMR logging:
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    }
  },
  logLevel: 'info'  // Shows HMR updates
})
```

## Known Limitations

- HMR for `<script>` (not `<script setup>`) may require full reload
- SSR components with external dependencies may not hot-reload
- State is not preserved for SSR components (expected behavior)

## Reference

- [vite-plugin-vue#525](https://github.com/vitejs/vite-plugin-vue/issues/525)
- [Vite SSR Guide](https://vite.dev/guide/ssr.html)
