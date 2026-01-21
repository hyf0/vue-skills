---
title: Testing Async Components with Suspense
impact: HIGH
impactDescription: properly tests Vue 3 async setup components
type: efficiency
tags: suspense, async, testing, vitest, vue-test-utils, flushPromises
---

# Testing Async Components with Suspense

**Impact: HIGH** - properly tests Vue 3 async setup components

Testing components with async setup functions or async components requires proper handling of Suspense and promise flushing.

## Symptoms

- Tests complete before async operations finish
- Component renders fallback content instead of actual content
- Assertions fail intermittently
- `wrapper.text()` returns empty or fallback content

## Fix

**Pattern 1: Wrap in Suspense**
```typescript
import { mount, flushPromises } from '@vue/test-utils'
import { Suspense, defineComponent, h } from 'vue'
import AsyncComponent from './AsyncComponent.vue'

test('async component renders correctly', async () => {
  const wrapper = mount(
    defineComponent({
      components: { AsyncComponent },
      template: `
        <Suspense>
          <AsyncComponent />
          <template #fallback>Loading...</template>
        </Suspense>
      `
    })
  )

  // Wait for all promises to resolve
  await flushPromises()

  expect(wrapper.text()).not.toContain('Loading')
  expect(wrapper.text()).toContain('Expected Content')
})
```

**Pattern 2: Using render function**
```typescript
test('async component with render function', async () => {
  const wrapper = mount({
    render() {
      return h(Suspense, null, {
        default: () => h(AsyncComponent),
        fallback: () => h('div', 'Loading...')
      })
    }
  })

  await flushPromises()
  expect(wrapper.text()).toContain('Expected Content')
})
```

**Pattern 3: Direct mount with await**
```typescript
// For components that don't require explicit Suspense
test('component with async setup', async () => {
  const wrapper = mount(MyComponent)

  // Wait for setup to complete
  await flushPromises()
  await wrapper.vm.$nextTick()

  expect(wrapper.find('.content').exists()).toBe(true)
})
```

## Helper Function

```typescript
// test/utils.ts
import { mount, flushPromises } from '@vue/test-utils'
import { Suspense, defineComponent, h, type Component } from 'vue'

export async function mountSuspended(
  component: Component,
  options = {}
) {
  const wrapper = mount(
    defineComponent({
      render() {
        return h(Suspense, null, {
          default: () => h(component, options.props),
          fallback: () => h('div', 'Loading...')
        })
      }
    }),
    options
  )

  await flushPromises()
  return wrapper
}

// Usage
const wrapper = await mountSuspended(AsyncComponent, {
  props: { id: 1 }
})
```

## When to Use flushPromises vs nextTick

| Method | Use When |
|--------|----------|
| `flushPromises()` | Waiting for async operations (API calls, timers) |
| `nextTick()` | Waiting for DOM updates after reactive changes |
| Both | Async operations that also trigger DOM updates |

```typescript
await flushPromises()  // Wait for API call
await wrapper.vm.$nextTick()  // Wait for DOM update
```

## Reference

- [Vue Test Utils Issue #108](https://github.com/vuejs/vue-test-utils-next/issues/108)
- [Vue Suspense Documentation](https://vuejs.org/guide/built-ins/suspense.html)
