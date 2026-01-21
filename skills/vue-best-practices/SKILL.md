---
name: vue-best-practices
description: Comprehensive Vue 3 development best practices, TypeScript configuration, tooling troubleshooting, testing patterns, and composition API gotchas. Covers vue-tsc, Volar, Vite configuration, Vue Router typing, component testing, reactivity patterns, and SFC features. Use when working with Vue 3 + TypeScript projects, debugging build errors, writing tests, or following best practices.
license: MIT
metadata:
  author: hyf0
  version: "5.0.0"
---

# Vue Best Practices

Comprehensive development guidelines, TypeScript configuration, and best practices for Vue 3 applications.

## When to Apply

- Setting up or configuring Vue 3 + TypeScript projects
- Debugging type checking issues with vue-tsc
- Fixing IDE/editor integration with Volar
- Configuring Vite for Vue projects
- Working with Vue Router typed routes
- Writing component tests with Vitest
- Using Composition API patterns
- Working with defineModel, defineProps, defineExpose
- Writing reusable composables

---

## Capability Rules

Rules that enable AI to solve problems it cannot solve without the skill.

### Type Checking

| Rule | Impact | Description |
|------|--------|-------------|
| [vue-tsc-strict-templates](rules/vue-tsc-strict-templates.md) | HIGH | Enable strict template checking to catch undefined components |
| [vue-define-model-generics](rules/vue-define-model-generics.md) | HIGH | Fix vue-tsc errors when using defineModel with generic components |

### vueCompilerOptions Settings

| Rule | Impact | Description |
|------|--------|-------------|
| [fallthrough-attributes](rules/fallthrough-attributes.md) | HIGH | Type-check fallthrough attributes on wrapper components |
| [strict-css-modules](rules/strict-css-modules.md) | MEDIUM | Catch typos in CSS module class names at compile time |
| [data-attributes-config](rules/data-attributes-config.md) | MEDIUM | Allow data-* attributes with strictTemplates enabled |

### Tooling & Configuration

| Rule | Impact | Description |
|------|--------|-------------|
| [vue-tsc-typescript-compatibility](rules/vue-tsc-typescript-compatibility.md) | HIGH | Fix vue-tsc and TypeScript version incompatibility issues |
| [volar-3-breaking-changes](rules/volar-3-breaking-changes.md) | HIGH | Fix editor integration after Volar/vue-language-server 3.0 upgrade |
| [module-resolution-bundler](rules/module-resolution-bundler.md) | HIGH | Fix "Cannot find module" errors after @vue/tsconfig upgrade |
| [unplugin-auto-import-conflicts](rules/unplugin-auto-import-conflicts.md) | HIGH | Fix component types resolving as any with unplugin conflicts |
| [codeactions-save-performance](rules/codeactions-save-performance.md) | HIGH | Fix 30-60 second save delays in large Vue projects |

### Vite Configuration

| Rule | Impact | Description |
|------|--------|-------------|
| [path-alias-vue-sfc](rules/path-alias-vue-sfc.md) | HIGH | Fix resolve.alias failures in Vue SFC files |
| [duplicate-plugin-detection](rules/duplicate-plugin-detection.md) | MEDIUM | Detect and fix duplicate Vue plugin registration |

### Component Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [use-template-ref-generics](rules/use-template-ref-generics.md) | MEDIUM | Fix incorrect type inference for refs to generic components |
| [define-model-update-event](rules/define-model-update-event.md) | MEDIUM | Fix runtime errors from unexpected undefined in model updates |
| [with-defaults-union-types](rules/with-defaults-union-types.md) | MEDIUM | Fix incorrect default value behavior with union type props |
| [verbatim-module-syntax](rules/verbatim-module-syntax.md) | MEDIUM | Fix Vite dev server errors with type-only imports |
| [deep-watch-numeric](rules/deep-watch-numeric.md) | MEDIUM | Enable efficient array mutation watching with Vue 3.5+ numeric deep |

### Template Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [vue-directive-comments](rules/vue-directive-comments.md) | HIGH | Control template type checking with @vue-ignore, @vue-skip directives |

### SFC Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [script-setup-jsdoc](rules/script-setup-jsdoc.md) | MEDIUM | Add JSDoc documentation to script setup components |

### Vue Router

| Rule | Impact | Description |
|------|--------|-------------|
| [vue-router-typed-params](rules/vue-router-typed-params.md) | MEDIUM | Fix route params type narrowing with unplugin-vue-router |

### Testing Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [teleport-testing](rules/teleport-testing.md) | HIGH | Test teleported content (modals, tooltips) |

### TypeScript Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [vueuse-emits-conflict](rules/vueuse-emits-conflict.md) | MEDIUM | Fix $emit type conflicts with VueUse element composables |

---

## Efficiency Rules

Rules that help AI solve problems more effectively and consistently.

### Vite Configuration

| Rule | Impact | Description |
|------|--------|-------------|
| [runtime-env-variables](rules/runtime-env-variables.md) | HIGH | Implement runtime environment variables for multi-env deployments |
| [hmr-vue-ssr](rules/hmr-vue-ssr.md) | MEDIUM | Fix HMR issues in Vue SSR applications |

### Component Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [define-expose-types](rules/define-expose-types.md) | MEDIUM | Fix "Property does not exist" errors when accessing exposed methods |
| [provide-inject-types](rules/provide-inject-types.md) | MEDIUM | Enable type-safe dependency injection with InjectionKey |

### Vue Router

| Rule | Impact | Description |
|------|--------|-------------|
| [route-meta-types](rules/route-meta-types.md) | HIGH | Extend RouteMeta interface for type-safe metadata |
| [scroll-behavior-types](rules/scroll-behavior-types.md) | MEDIUM | Properly type scrollBehavior function |
| [dynamic-routes-typing](rules/dynamic-routes-typing.md) | MEDIUM | Type-safe dynamic route configuration |

### Testing Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [suspense-testing](rules/suspense-testing.md) | HIGH | Test async components with Suspense properly |
| [pinia-store-mocking](rules/pinia-store-mocking.md) | HIGH | Mock Pinia stores correctly with Vitest |
| [router-mocking](rules/router-mocking.md) | HIGH | Mock Vue Router with useRoute and useRouter |
| [vue-test-utils-types](rules/vue-test-utils-types.md) | MEDIUM | Fix wrapper.vm property access types in Vue Test Utils |

### Composition API Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [reactive-destructuring](rules/reactive-destructuring.md) | HIGH | Avoid reactivity loss when destructuring reactive objects |
| [composable-cleanup](rules/composable-cleanup.md) | HIGH | Prevent memory leaks in composables with proper cleanup |
| [ref-unwrapping](rules/ref-unwrapping.md) | MEDIUM | Understand ref auto-unwrapping in reactive objects |
| [watcheffect-tracking](rules/watcheffect-tracking.md) | MEDIUM | Fix conditional dependency tracking in watchEffect |

### SFC Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [script-setup-patterns](rules/script-setup-patterns.md) | HIGH | Best practices for script setup syntax |
| [css-v-bind](rules/css-v-bind.md) | MEDIUM | Safely use reactive values in CSS |

### TypeScript Patterns

| Rule | Impact | Description |
|------|--------|-------------|
| [component-type-helpers](rules/component-type-helpers.md) | HIGH | Extract component prop and emit types |
| [event-handler-typing](rules/event-handler-typing.md) | MEDIUM | Type event handlers correctly |

---

## Reference

- [Vue Language Tools](https://github.com/vuejs/language-tools)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [VueUse](https://vueuse.org/)
