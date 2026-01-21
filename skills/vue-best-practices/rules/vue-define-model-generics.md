---
title: defineModel with Generics Compilation Fix
impact: HIGH
impactDescription: fixes vue-tsc errors when using defineModel<T> with generic components
type: capability
tags: defineModel, generics, vue-tsc, typescript, compilation
---

# defineModel with Generics Compilation Fix

**Impact: HIGH** - fixes vue-tsc errors when combining defineModel with generic components

When using `defineModel<T>()` in a generic component, vue-tsc may fail with errors like "Cannot find name 'defineProps'" or other `__VLS_*` related errors.

## Root Cause

This is a vue-language-tools type generation issue, **not a code problem**. It's caused by:
- TypeScript version < 5.0
- Outdated vue-language-tools/vue-tsc

## Fix

**1. Upgrade TypeScript to 5.x (primary fix):**
```bash
npm install -D typescript@^5.0.0
```

**2. Upgrade vue-tsc to 2.1.10+:**
```bash
npm install -D vue-tsc@latest
```

**3. Upgrade @vue/language-server (if using Volar):**
```bash
npm install -D @vue/language-server@latest
```

## Workarounds (if upgrade not possible)

**Use concrete types instead of generics:**
```vue
<!-- Instead of: -->
<script setup lang="ts" generic="T">
const model = defineModel<T>()
</script>

<!-- Use: -->
<script setup lang="ts">
const model = defineModel<string>()
</script>
```

## Additional Gotchas

- Use string literals, not backticks: `defineModel<T>('name')` not `` defineModel<T>(`name`) ``
- Avoid dashes in model names with generics: use `myModel` not `my-model`

## Reference

- [Issue #3886](https://github.com/vuejs/language-tools/issues/3886)
- [Issue #3195](https://github.com/vuejs/language-tools/issues/3195)
