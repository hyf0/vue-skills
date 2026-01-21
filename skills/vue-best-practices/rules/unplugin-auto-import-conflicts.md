---
title: unplugin-vue-components and unplugin-auto-import Type Conflicts
impact: HIGH
impactDescription: fixes component types resolving as any when using both plugins
type: capability
tags: unplugin-vue-components, unplugin-auto-import, types, any, dts
---

# unplugin-vue-components and unplugin-auto-import Type Conflicts

**Impact: HIGH** - fixes component types resolving as any when using both plugins

Installing both `unplugin-vue-components` and `unplugin-auto-import` can cause component types to resolve as `any`. The generated `.d.ts` files conflict with each other.

## Symptoms

- Components typed as `any` instead of proper component types
- No autocomplete for component props
- No type errors for invalid props
- Types work when using only one plugin but break with both

## Root Cause

Both plugins generate declaration files (`components.d.ts` and `auto-imports.d.ts`) that can have conflicting declarations. TypeScript declaration merging fails silently.

## Fix

**Step 1: Ensure both .d.ts files are in tsconfig include**
```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.vue",
    "components.d.ts",
    "auto-imports.d.ts"
  ]
}
```

**Step 2: Set explicit, different dts paths**
```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    Components({
      dts: 'src/types/components.d.ts'  // Explicit unique path
    }),
    AutoImport({
      dts: 'src/types/auto-imports.d.ts'  // Explicit unique path
    })
  ]
})
```

**Step 3: Regenerate type files**
```bash
# Delete existing .d.ts files
rm components.d.ts auto-imports.d.ts

# Restart dev server to regenerate
npm run dev
```

**Step 4: Verify no duplicate declarations**

Check that the same component isn't declared in both files.

## Plugin Order Matters

Configure Components plugin AFTER AutoImport:
```typescript
plugins: [
  AutoImport({ /* ... */ }),
  Components({ /* ... */ })  // Must come after AutoImport
]
```

## Common Mistake: Duplicate Imports

Don't configure the same import in both plugins:
```typescript
// Wrong - Vue imported in both
AutoImport({
  imports: ['vue']
})
Components({
  resolvers: [/* includes Vue components */]
})
```

## Reference

- [unplugin-vue-components#640](https://github.com/unplugin/unplugin-vue-components/issues/640)
- [unplugin-auto-import docs](https://github.com/unplugin/unplugin-auto-import)
