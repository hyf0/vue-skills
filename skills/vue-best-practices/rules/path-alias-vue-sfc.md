---
title: Path Alias Resolution in Vue SFCs
impact: HIGH
impactDescription: fixes resolve.alias working in TS but failing in Vue files
type: capability
tags: vite, alias, resolve, vue-sfc, path, import
---

# Path Alias Resolution in Vue SFCs

**Impact: HIGH** - fixes resolve.alias working in TS but failing in Vue files

The `resolve.alias` configuration works in TypeScript files but fails in Vue Single File Components (SFCs). Imports like `import { Model } from '@models/position'` fail with "Failed to resolve import" errors.

## Symptoms

- Path alias works in `.ts` files but fails in `.vue` files
- "Failed to resolve import '@alias/...'" only in Vue components
- Works on some operating systems but not others
- Alias resolves in `<script>` but not in `<template>` or `<style>`

## Root Cause

The Vue plugin processes aliased imports differently than the standard TypeScript resolver. On some systems, path separators (forward vs backslash) cause resolution failures.

## Fix

**Step 1: Use path.resolve for aliases**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Use path.resolve for reliable cross-platform resolution
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@models': path.resolve(__dirname, './src/models')
    }
  }
})
```

**Step 2: Ensure tsconfig.json paths match**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@models/*": ["src/models/*"]
    }
  }
}
```

**Step 3: Use forward slashes consistently**
```typescript
// Even on Windows, use forward slashes in import paths
import Component from '@components/MyComponent.vue'  // Correct
import Component from '@components\\MyComponent.vue'  // Wrong
```

## Alternative: Use vite-tsconfig-paths

```bash
npm install -D vite-tsconfig-paths
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [vue(), tsconfigPaths()]
})
```

This automatically uses tsconfig.json paths for Vite aliases.

## Reference

- [vite-plugin-vue#506](https://github.com/vitejs/vite-plugin-vue/issues/506)
- [Vite resolve.alias docs](https://vite.dev/config/shared-options.html#resolve-alias)
