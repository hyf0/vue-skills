---
title: Enable Strict CSS Modules Type Checking
impact: MEDIUM
impactDescription: catches typos in CSS module class names at compile time
type: capability
tags: strictCssModules, vueCompilerOptions, css-modules, style-module
---

# Enable Strict CSS Modules Type Checking

**Impact: MEDIUM** - catches typos in CSS module class names at compile time

When using CSS modules with `<style module>`, Vue doesn't validate class names by default. Enable `strictCssModules` to catch typos and undefined classes.

## Problem

CSS module class name errors go undetected:

```vue
<script setup lang="ts">
// No error for typo in class name
</script>

<template>
  <div :class="$style.buttn">Click me</div>
</template>

<style module>
.button {
  background: blue;
}
</style>
```

The typo `buttn` instead of `button` silently fails at runtime.

## Solution

Enable `strictCssModules` in your tsconfig:

```json
// tsconfig.json or tsconfig.app.json
{
  "vueCompilerOptions": {
    "strictCssModules": true
  }
}
```

Now `$style.buttn` will show a type error because `buttn` doesn't exist in the CSS module.

## What Gets Checked

| Access | With strictCssModules |
|--------|----------------------|
| `$style.validClass` | OK |
| `$style.typo` | Error: Property 'typo' does not exist |
| `$style['dynamic']` | OK (dynamic access not checked) |

## Limitations

- Only checks static property access (`$style.className`)
- Dynamic access (`$style[variable]`) is not validated
- Only works with `<style module>`, not external CSS files

## Reference

- [Vue Language Tools Wiki - Vue Compiler Options](https://github.com/vuejs/language-tools/wiki/Vue-Compiler-Options)
