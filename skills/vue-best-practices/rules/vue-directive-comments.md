---
title: Vue Template Directive Comments
impact: HIGH
impactDescription: enables fine-grained control over template type checking
type: capability
tags: vue-directive, vue-ignore, vue-expect-error, vue-skip, template, type-checking
---

# Vue Template Directive Comments

**Impact: HIGH** - enables fine-grained control over template type checking

Vue Language Tools supports special directive comments to control type checking behavior in templates.

## Available Directives

### @vue-ignore

Suppress type errors for the next line:

```vue
<template>
  <!-- @vue-ignore -->
  <Component :prop="valueWithTypeError" />
</template>
```

### @vue-expect-error

Assert that the next line should have a type error (useful for testing):

```vue
<template>
  <!-- @vue-expect-error -->
  <Component :invalid-prop="value" />
</template>
```

### @vue-skip

Skip type checking for an entire block:

```vue
<template>
  <!-- @vue-skip -->
  <div>
    <!-- Everything in here is not type-checked -->
    <LegacyComponent :any="props" :go="here" />
  </div>
</template>
```

### @vue-generic

Declare template-level generic types:

```vue
<template>
  <!-- @vue-generic {T extends string} -->
  <GenericList :items="items as T[]" />
</template>
```

## Use Cases

- Migrating legacy components with incomplete types
- Working with third-party components that have incorrect type definitions
- Temporarily suppressing errors during refactoring
- Testing that certain patterns produce expected type errors

## Reference

- [Vue Language Tools Wiki - Directive Comments](https://github.com/vuejs/language-tools/wiki/Directive-Comments)
