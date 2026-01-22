---
name: vue-best-practices
description: Vue 3 TypeScript, vue-tsc, Volar, Vite, component props, testing, composition API.
license: MIT
metadata:
  author: hyf0
  version: "6.0.0"
---

# Vue Best Practices

## Capability Rules

| Rule | Keywords | Description |
|------|----------|-------------|
| [extract-component-props](rules/extract-component-props.md) | get props type, wrapper component, extend props, inherit props, ComponentProps | Extract types from .vue components |
| [vue-tsc-strict-templates](rules/vue-tsc-strict-templates.md) | undefined component, template error, strictTemplates | Catch undefined components in templates |
| [vue-define-model-generics](rules/vue-define-model-generics.md) | defineModel, generic component, vue-tsc error | Fix defineModel with generic components |
| [fallthrough-attributes](rules/fallthrough-attributes.md) | fallthrough, $attrs, wrapper component | Type-check fallthrough attributes |
| [strict-css-modules](rules/strict-css-modules.md) | css modules, $style, typo | Catch CSS module class typos |
| [data-attributes-config](rules/data-attributes-config.md) | data-*, strictTemplates, attribute | Allow data-* attributes |
| [vue-tsc-typescript-compatibility](rules/vue-tsc-typescript-compatibility.md) | vue-tsc, typescript version, incompatible | Fix vue-tsc version issues |
| [volar-3-breaking-changes](rules/volar-3-breaking-changes.md) | volar, vue-language-server, editor | Fix Volar 3.0 upgrade issues |
| [module-resolution-bundler](rules/module-resolution-bundler.md) | cannot find module, @vue/tsconfig, moduleResolution | Fix module resolution errors |
| [unplugin-auto-import-conflicts](rules/unplugin-auto-import-conflicts.md) | unplugin, auto-import, types any | Fix unplugin type conflicts |
| [codeactions-save-performance](rules/codeactions-save-performance.md) | slow save, vscode, performance | Fix slow save in large projects |
| [path-alias-vue-sfc](rules/path-alias-vue-sfc.md) | alias, @/, resolve, import | Fix path alias in SFC |
| [duplicate-plugin-detection](rules/duplicate-plugin-detection.md) | duplicate plugin, vite, vue plugin | Detect duplicate plugins |
| [use-template-ref-generics](rules/use-template-ref-generics.md) | template ref, generic, useTemplateRef | Fix generic component refs |
| [define-model-update-event](rules/define-model-update-event.md) | defineModel, update event, undefined | Fix model update errors |
| [with-defaults-union-types](rules/with-defaults-union-types.md) | withDefaults, union type, default | Fix union type defaults |
| [verbatim-module-syntax](rules/verbatim-module-syntax.md) | verbatimModuleSyntax, type import | Fix type-only imports |
| [deep-watch-numeric](rules/deep-watch-numeric.md) | watch, deep, array, Vue 3.5 | Efficient array watching |
| [vue-directive-comments](rules/vue-directive-comments.md) | @vue-ignore, @vue-skip, template | Control template type checking |
| [script-setup-jsdoc](rules/script-setup-jsdoc.md) | jsdoc, script setup, documentation | Add JSDoc to script setup |
| [vue-router-typed-params](rules/vue-router-typed-params.md) | route params, typed router, unplugin | Fix route params typing |
| [teleport-testing](rules/teleport-testing.md) | teleport, test, modal, tooltip | Test teleported content |
| [vueuse-emits-conflict](rules/vueuse-emits-conflict.md) | vueuse, $emit, conflict | Fix VueUse emit conflicts |

## Efficiency Rules

| Rule | Keywords | Description |
|------|----------|-------------|
| [runtime-env-variables](rules/runtime-env-variables.md) | env, runtime, environment, deploy | Runtime environment variables |
| [hmr-vue-ssr](rules/hmr-vue-ssr.md) | hmr, ssr, hot reload | Fix HMR in SSR apps |
| [define-expose-types](rules/define-expose-types.md) | defineExpose, exposed, property not exist | Type exposed methods |
| [provide-inject-types](rules/provide-inject-types.md) | provide, inject, InjectionKey | Type-safe dependency injection |
| [route-meta-types](rules/route-meta-types.md) | route meta, RouteMeta, typed | Extend RouteMeta interface |
| [scroll-behavior-types](rules/scroll-behavior-types.md) | scrollBehavior, router, type | Type scrollBehavior function |
| [dynamic-routes-typing](rules/dynamic-routes-typing.md) | dynamic routes, addRoute, typed | Type dynamic routes |
| [suspense-testing](rules/suspense-testing.md) | suspense, async component, test | Test async components |
| [pinia-store-mocking](rules/pinia-store-mocking.md) | pinia, mock, vitest, store | Mock Pinia stores |
| [router-mocking](rules/router-mocking.md) | useRoute, useRouter, mock, test | Mock Vue Router |
| [vue-test-utils-types](rules/vue-test-utils-types.md) | wrapper.vm, test utils, type | Fix wrapper.vm types |
| [reactive-destructuring](rules/reactive-destructuring.md) | destructure, reactive, lose reactivity | Avoid reactivity loss |
| [composable-cleanup](rules/composable-cleanup.md) | composable, cleanup, memory leak, onUnmounted | Prevent memory leaks |
| [ref-unwrapping](rules/ref-unwrapping.md) | ref, unwrap, reactive, .value | Understand ref unwrapping |
| [watcheffect-tracking](rules/watcheffect-tracking.md) | watchEffect, conditional, tracking | Fix watchEffect tracking |
| [script-setup-patterns](rules/script-setup-patterns.md) | script setup, best practice, pattern | Script setup patterns |
| [css-v-bind](rules/css-v-bind.md) | v-bind, css, reactive, style | Reactive CSS values |
| [event-handler-typing](rules/event-handler-typing.md) | event handler, @click, type | Type event handlers |

## Reference

- [Vue Language Tools](https://github.com/vuejs/language-tools)
- [Vue 3 Documentation](https://vuejs.org/)
