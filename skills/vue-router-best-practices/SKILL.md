---
name: vue-router-best-practices
description: "Implements Vue Router 4 navigation guards, configures dynamic route params, manages route-component lifecycle hooks, and debugs common routing issues. Use when setting up vue-router, writing beforeRouteEnter or beforeEach guards, handling dynamic routes, fixing stale data after navigation, resolving infinite redirect loops, managing router-link behaviour, or debugging route-component lifecycle interactions in a Vue 3 application."
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
---

Vue Router best practices, common gotchas, and navigation patterns.

## Quick Reference

### Modern navigation guard (return-based, no `next()`)
```js
// router/index.js
router.beforeEach(async (to, from) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  // returning undefined / true allows navigation
})
```

### Reacting to param changes on the same route
```js
// Because beforeRouteEnter does NOT re-fire when only params change,
// watch $route inside the component instead:
watch(
  () => route.params.id,
  async (newId) => { await fetchData(newId) },
  { immediate: true }
)
```

### Accessing the component instance in `beforeRouteEnter`
```js
// `this` is unavailable; use the callback form:
beforeRouteEnter(to, from, next) {
  next(vm => {
    vm.fetchData(to.params.id)
  })
}
```

## When to Consult Each Section

| Symptom | Section to check |
|---|---|
| Data is stale after navigating between same-route URLs | Route Lifecycle |
| Guard never fires when only params change | Navigation Guards → `beforeenter-no-param-trigger` |
| App gets stuck in a redirect loop | Navigation Guards → `infinite-loop` |
| Event listeners leak after component unmounts | Route Lifecycle → cleanup |
| Starting a new project / production SPA setup | Setup |

---

### Navigation Guards
- Navigating between same route with different params → See [router-beforeenter-no-param-trigger](reference/router-beforeenter-no-param-trigger.md)
- Accessing component instance in beforeRouteEnter guard → See [router-beforerouteenter-no-this](reference/router-beforerouteenter-no-this.md)
- Navigation guard making API calls without awaiting → See [router-guard-async-await-pattern](reference/router-guard-async-await-pattern.md)
- Users trapped in infinite redirect loops → See [router-navigation-guard-infinite-loop](reference/router-navigation-guard-infinite-loop.md)
- Navigation guard using deprecated next() function → See [router-navigation-guard-next-deprecated](reference/router-navigation-guard-next-deprecated.md)

### Route Lifecycle
- Stale data when navigating between same route → See [router-param-change-no-lifecycle](reference/router-param-change-no-lifecycle.md)
- Event listeners persisting after component unmounts → See [router-simple-routing-cleanup](reference/router-simple-routing-cleanup.md)

### Setup
- Building production single-page application → See [router-use-vue-router-for-production](reference/router-use-vue-router-for-production.md)
