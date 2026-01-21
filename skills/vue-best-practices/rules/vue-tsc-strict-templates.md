---
title: Enable Strict Template Checking
impact: HIGH
impactDescription: catches undefined components and props at compile time
type: capability
tags: vue-tsc, typescript, type-checking, templates, vueCompilerOptions
---

# Enable Strict Template Checking

**Impact: HIGH** - catches undefined components and props at compile time

By default, vue-tsc does not report errors for undefined components in templates. Enable `strictTemplates` to catch these issues during type checking.

## Which tsconfig?

Add `vueCompilerOptions` to the tsconfig that includes Vue source files. In projects with multiple tsconfigs (like those created with `create-vue`), this is typically `tsconfig.app.json`, not the root `tsconfig.json` or `tsconfig.node.json`.

**Incorrect (missing strict checking):**

```json
{
  "compilerOptions": {
    "strict": true
  }
  // vueCompilerOptions not configured - undefined components won't error
}
```

**Correct (strict template checking enabled):**

```json
{
  "compilerOptions": {
    "strict": true
  },
  "vueCompilerOptions": {
    "strictTemplates": true
  }
}
```

## Available Options

| Option | Default | Effect |
|--------|---------|--------|
| `strictTemplates` | `false` | Enables all checkUnknown* options below |
| `checkUnknownComponents` | `false` | Error on undefined/unregistered components |
| `checkUnknownProps` | `false` | Error on props not declared in component definition |
| `checkUnknownEvents` | `false` | Error on events not declared via `defineEmits` |
| `checkUnknownDirectives` | `false` | Error on unregistered custom directives |

## Granular Control

If `strictTemplates` is too strict, enable individual checks:

```json
{
  "vueCompilerOptions": {
    "checkUnknownComponents": true,
    "checkUnknownProps": false
  }
}
```

## Reference

- [Vue Compiler Options](https://github.com/vuejs/language-tools/wiki/Vue-Compiler-Options)
- [Vite Vue+TS Template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-vue-ts)
