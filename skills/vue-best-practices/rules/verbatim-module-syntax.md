---
title: verbatimModuleSyntax Breaks Type-Only Imports in Dev Mode
impact: MEDIUM
impactDescription: fixes Vite dev server errors with type-only imports
type: capability
tags: verbatimModuleSyntax, vite, type-imports, dev-server, tsconfig
---

# verbatimModuleSyntax Breaks Type-Only Imports in Dev Mode

**Impact: MEDIUM** - fixes Vite dev server errors with type-only imports

With `"verbatimModuleSyntax": true` in tsconfig.json, type imports from type-only packages (like `@types/geojson`) throw `[plugin:vite:import-analysis] Failed to resolve import` errors in dev mode, but work fine in production builds.

## Symptoms

- `[plugin:vite:import-analysis] Failed to resolve import "@types/..."` in dev mode
- Production build works fine
- Error only affects type-only packages (packages with no runtime code)

## Root Cause

`verbatimModuleSyntax` preserves import/export syntax exactly as written. Vite's dev server then tries to resolve type-only imports as runtime imports, which fails because they have no JavaScript output.

## Fix

**Option 1: Remove verbatimModuleSyntax (recommended)**
```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": false
  }
}
```

**Option 2: Use explicit type imports consistently**
```typescript
// Incorrect - may fail with verbatimModuleSyntax
import { Feature } from '@types/geojson'

// Correct - explicitly marked as type-only
import type { Feature } from 'geojson'
```

**Option 3: Add to Vite's optimizeDeps.exclude**
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['@types/geojson']
  }
})
```

## When to Keep verbatimModuleSyntax

Keep it enabled if:
- You need strict ESM/CJS module boundary enforcement
- You're publishing a library and need precise import preservation
- You don't use type-only packages at runtime import positions

## Reference

- [vite-plugin-vue#253](https://github.com/vitejs/vite-plugin-vue/issues/253)
- [TypeScript verbatimModuleSyntax docs](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
