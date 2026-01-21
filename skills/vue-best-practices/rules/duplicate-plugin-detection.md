---
title: Duplicate Vue Plugin Detection
impact: MEDIUM
impactDescription: fixes cryptic build errors from Vue plugin registered twice
type: capability
tags: vite, plugin, vue, duplicate, config, inline
---

# Duplicate Vue Plugin Detection

**Impact: MEDIUM** - fixes cryptic build errors from Vue plugin registered twice

When using Vite's JavaScript API, if the Vue plugin is loaded in `vite.config.js` and specified again in `inlineConfig`, it gets registered twice, causing cryptic build errors.

## Symptoms

- Build produces unexpected output or fails silently
- "Cannot read property of undefined" during build
- Different build behavior between CLI and JavaScript API
- Vue components render incorrectly after build

## Root Cause

Vite doesn't deduplicate plugins by name when merging configs. The Vue plugin's internal state gets corrupted when registered twice.

## Fix

**Option 1: Use configFile: false with inline plugins**
```typescript
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'

await build({
  configFile: false,  // Don't load vite.config.js
  plugins: [vue()],
  // ... rest of config
})
```

**Option 2: Don't specify plugins in inlineConfig**
```typescript
// vite.config.js already has vue plugin
import { build } from 'vite'

await build({
  // Don't add vue plugin here - it's in vite.config.js
  root: './src',
  build: { outDir: '../dist' }
})
```

**Option 3: Filter out Vue plugin before merging**
```typescript
import { build, loadConfigFromFile } from 'vite'
import vue from '@vitejs/plugin-vue'

const { config } = await loadConfigFromFile({ command: 'build', mode: 'production' })

// Remove existing Vue plugin
const filteredPlugins = config.plugins?.filter(
  p => !p || (Array.isArray(p) ? false : p.name !== 'vite:vue')
) || []

await build({
  ...config,
  plugins: [...filteredPlugins, vue({ /* your options */ })]
})
```

## Detection Script

Add this to debug plugin registration:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'debug-plugins',
      configResolved(config) {
        const vuePlugins = config.plugins.filter(p => p.name?.includes('vue'))
        if (vuePlugins.length > 1) {
          console.warn('WARNING: Multiple Vue plugins detected:', vuePlugins.map(p => p.name))
        }
      }
    }
  ]
})
```

## Common Scenarios

| Scenario | Solution |
|----------|----------|
| Using `vite.createServer()` | Use `configFile: false` |
| Build script with custom config | Don't duplicate plugins |
| Monorepo with shared config | Check for plugin inheritance |

## Reference

- [Vite Issue #5335](https://github.com/vitejs/vite/issues/5335)
- [Vite JavaScript API](https://vite.dev/guide/api-javascript.html)
