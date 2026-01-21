---
title: Allow Data Attributes with Strict Templates
impact: MEDIUM
impactDescription: fixes data-testid and data-* attribute errors in strict mode
type: capability
tags: dataAttributes, vueCompilerOptions, strictTemplates, data-testid, testing
---

# Allow Data Attributes with Strict Templates

**Impact: MEDIUM** - fixes data-testid and data-* attribute errors in strict mode

With `strictTemplates` enabled, `data-*` attributes on components cause type errors. Use the `dataAttributes` option to allow specific patterns.

## Problem

```vue
<template>
  <!-- Error: Property 'data-testid' does not exist on type... -->
  <MyComponent data-testid="submit-button" />

  <!-- Error: Property 'data-cy' does not exist on type... -->
  <MyComponent data-cy="login-form" />
</template>
```

## Solution

Configure `dataAttributes` to allow specific patterns:

```json
// tsconfig.json or tsconfig.app.json
{
  "vueCompilerOptions": {
    "strictTemplates": true,
    "dataAttributes": ["data-*"]
  }
}
```

Now all `data-*` attributes are allowed on any component.

## Specific Patterns

You can be more selective:

```json
{
  "vueCompilerOptions": {
    "dataAttributes": [
      "data-testid",
      "data-cy",
      "data-test-*"
    ]
  }
}
```

This only allows the specified patterns, not all data attributes.

## Common Testing Attributes

For testing libraries, allow their specific attributes:

| Library | Attribute | Pattern |
|---------|-----------|---------|
| Testing Library | `data-testid` | `"data-testid"` |
| Cypress | `data-cy` | `"data-cy"` |
| Playwright | `data-testid` | `"data-testid"` |
| Generic | All data attributes | `"data-*"` |

## Reference

- [Vue Language Tools Wiki - Vue Compiler Options](https://github.com/vuejs/language-tools/wiki/Vue-Compiler-Options)
