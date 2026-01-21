---
title: moduleResolution Bundler Migration Issues
impact: HIGH
impactDescription: fixes "Cannot find module" errors after @vue/tsconfig upgrade
type: capability
tags: moduleResolution, bundler, tsconfig, vue-tsconfig, node, esm
---

# moduleResolution Bundler Migration Issues

**Impact: HIGH** - fixes "Cannot find module" errors after @vue/tsconfig upgrade

Recent versions of `@vue/tsconfig` changed `moduleResolution` from `"node"` to `"bundler"`. This can break existing projects with errors like "Cannot find module 'vue'" or issues with `resolveJsonModule`.

## Symptoms

- `Cannot find module 'vue'` or other packages
- `Option '--resolveJsonModule' cannot be specified without 'node' module resolution`
- Errors appear after updating `@vue/tsconfig`
- Some third-party packages no longer resolve

## Root Cause

`moduleResolution: "bundler"` requires:
1. TypeScript 5.0+
2. Packages to have proper `exports` field in package.json
3. Different resolution rules than Node.js classic resolution

## Fix

**Option 1: Ensure TypeScript 5.0+ everywhere**
```bash
npm install -D typescript@^5.0.0
```

In monorepos, ALL packages must use TypeScript 5.0+.

**Option 2: Add compatibility workaround**
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolvePackageJsonExports": false
  }
}
```

Setting `resolvePackageJsonExports: false` restores compatibility with packages that don't have proper exports.

**Option 3: Revert to Node resolution**
```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

## Which Packages Break?

Packages break if they:
- Lack `exports` field in package.json
- Have incorrect `exports` configuration
- Rely on Node.js-specific resolution behavior

## Diagnosis

```bash
# Check which resolution is being used
cat tsconfig.json | grep moduleResolution

# Test if a specific module resolves
npx tsc --traceResolution 2>&1 | grep "module-name"
```

## Reference

- [vuejs/tsconfig#8](https://github.com/vuejs/tsconfig/issues/8)
- [TypeScript moduleResolution docs](https://www.typescriptlang.org/tsconfig#moduleResolution)
- [Vite discussion#14001](https://github.com/vitejs/vite/discussions/14001)
