---
title: Enable Fallthrough Attributes Type Checking
impact: HIGH
impactDescription: enables type-safe fallthrough attributes in component libraries
type: capability
tags: fallthroughAttributes, vueCompilerOptions, component-library, wrapper-components
---

# Enable Fallthrough Attributes Type Checking

**Impact: HIGH** - enables type-safe fallthrough attributes in component libraries

When building component libraries with wrapper components, TypeScript doesn't type-check fallthrough attributes by default. Enable `fallthroughAttributes` to get proper type inference.

## Problem

Wrapper components that pass attributes to child elements don't get type checking:

```vue
<!-- MyButton.vue - wrapper around native button -->
<template>
  <button v-bind="$attrs"><slot /></button>
</template>
```

```vue
<!-- Usage - no type error for invalid attribute -->
<MyButton invalidAttr="value" />
```

## Solution

Enable `fallthroughAttributes` in your tsconfig:

```json
// tsconfig.json or tsconfig.app.json
{
  "vueCompilerOptions": {
    "fallthroughAttributes": true
  }
}
```

With this enabled, TypeScript will check that fallthrough attributes are valid for the target element.

## How It Works

When `fallthroughAttributes: true`:
- Vue Language Server analyzes which element receives `$attrs`
- Type checking is applied based on the target element's accepted attributes
- Invalid attributes are flagged as type errors

## Related Options

Combine with `strictTemplates` for comprehensive checking:

```json
{
  "vueCompilerOptions": {
    "strictTemplates": true,
    "fallthroughAttributes": true
  }
}
```

## Reference

- [Vue Language Tools Wiki - Vue Compiler Options](https://github.com/vuejs/language-tools/wiki/Vue-Compiler-Options)
