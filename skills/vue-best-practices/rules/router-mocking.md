---
title: Mocking Vue Router with Vitest
impact: HIGH
impactDescription: properly mocks useRoute and useRouter in component tests
type: efficiency
tags: vue-router, vitest, testing, mock, useRoute, useRouter
---

# Mocking Vue Router with Vitest

**Impact: HIGH** - properly mocks useRoute and useRouter in component tests

Components using Vue Router's `useRoute()` and `useRouter()` require proper mocking. The "Cannot mock 'vue-router' because it is already loaded" error is common.

## Symptoms

- "Cannot mock 'vue-router' because it is already loaded"
- `useRoute()` returns undefined in tests
- Route params not available in component
- Router push/replace not testable

## Fix

**Pattern 1: Use real router with memory history**
```typescript
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import MyComponent from './MyComponent.vue'

const routes = [
  { path: '/', component: { template: '<div />' } },
  { path: '/users/:id', component: MyComponent }
]

describe('MyComponent', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes
    })

    // Navigate to the route
    router.push('/users/123')
    await router.isReady()
  })

  test('displays user id from route', async () => {
    const wrapper = mount(MyComponent, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('123')
  })
})
```

**Pattern 2: Mock useRoute and useRouter**
```typescript
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import MyComponent from './MyComponent.vue'

const mockRoute = {
  params: { id: '123' },
  query: { filter: 'active' },
  path: '/users/123'
}

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

test('component uses route params', () => {
  const wrapper = mount(MyComponent)
  expect(wrapper.text()).toContain('123')
})

test('navigates on button click', async () => {
  const wrapper = mount(MyComponent)
  await wrapper.find('button').trigger('click')
  expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
})
```

**Pattern 3: Per-test route configuration**
```typescript
import { vi, beforeEach } from 'vitest'

// Reset modules before each test to allow different mocks
beforeEach(() => {
  vi.resetModules()
})

test('with specific route', async () => {
  vi.doMock('vue-router', () => ({
    useRoute: () => ({ params: { id: '456' } }),
    useRouter: () => ({ push: vi.fn() })
  }))

  // Dynamic import AFTER mock setup
  const { default: MyComponent } = await import('./MyComponent.vue')
  const wrapper = mount(MyComponent)

  expect(wrapper.text()).toContain('456')
})
```

## Using vue-router-mock Library

```bash
npm install -D vue-router-mock
```

```typescript
import { mount } from '@vue/test-utils'
import { createRouterMock, injectRouterMock } from 'vue-router-mock'

const router = createRouterMock()

beforeEach(() => {
  injectRouterMock(router)
})

afterEach(() => {
  router.reset()
})

test('with vue-router-mock', async () => {
  router.setParams({ id: '123' })

  const wrapper = mount(MyComponent, {
    global: {
      plugins: [router]
    }
  })

  expect(wrapper.text()).toContain('123')
})
```

## Testing Navigation

```typescript
test('redirects on form submit', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  const pushSpy = vi.spyOn(router, 'push')

  const wrapper = mount(MyComponent, {
    global: { plugins: [router] }
  })

  await wrapper.find('form').trigger('submit')
  expect(pushSpy).toHaveBeenCalledWith('/success')
})
```

## Reference

- [Vue Test Utils Issue #242](https://github.com/vuejs/test-utils/issues/242)
- [Vue Test Utils Router Guide](https://test-utils.vuejs.org/guide/advanced/vue-router)
- [vue-router-mock](https://github.com/posva/vue-router-mock)
