---
title: Enable Fallthrough Attributes Type Checking
impact: HIGH
impactDescription: enables type-safe fallthrough attributes in component libraries
type: capability
tags: fallthroughAttributes, vueCompilerOptions, component-library, wrapper-components
---

# Enable Fallthrough Attributes Type Checking

**Impact: MEDIUM** - enables type-aware attribute forwarding in component libraries

When building component libraries with wrapper components, enable `fallthroughAttributes` to get IDE autocomplete for attributes that will be forwarded to child elements.

## What It Does

Wrapper components that pass attributes to child elements can benefit from type-aware completion:

```vue
<!-- MyButton.vue - wrapper around native button -->
<template>
  <button v-bind="$attrs"><slot /></button>
</template>
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

## How It Works

When `fallthroughAttributes: true`:
- Vue Language Server analyzes which element receives `$attrs`
- IDE autocomplete suggests valid attributes for the target element
- Helps developers discover available attributes

> **Note:** This primarily enables IDE autocomplete for valid fallthrough attributes. It does NOT reject invalid attributes as type errors - arbitrary attributes are still allowed.

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
