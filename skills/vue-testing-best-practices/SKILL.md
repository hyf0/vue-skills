---
name: vue-testing-best-practices
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
description: Use when writing unit tests, mocking dependencies, configuring test environments, or debugging failing tests in Vue.js projects. Covers Vitest, Vue Test Utils, component testing, mocking, testing patterns, and Playwright for E2E testing.
---

Vue.js testing best practices, patterns, and common gotchas.

## Quick Start

A minimal component test using Vitest and Vue Test Utils:

```js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders a message and responds to button click', async () => {
    const wrapper = mount(MyComponent, {
      props: { message: 'Hello' }
    })

    // Assert rendered output
    expect(wrapper.text()).toContain('Hello')

    // Trigger an event and assert the result
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
```

Run tests with:
```bash
npx vitest run        # single run
npx vitest            # watch mode
```

## Testing Workflow

1. **Setup** — Configure Vitest and Vue Test Utils for the project
2. **Write test** — Mount the component, interact with it, assert output
3. **Run** — Execute `vitest run` and review results
4. **Validate** — Confirm behaviour, not implementation details (avoid testing internals)
5. **Fix** — Address failures using this cycle:
   - Test fails unexpectedly → wrap async interactions with `await` and call `flushPromises()` after async operations
   - Component renders empty or incorrectly → verify `mount` options (props, global plugins, stubs)
   - Queries return nothing → confirm selectors match actual rendered DOM, not component internals
   - Still failing → re-run with `vitest --reporter=verbose` for detailed output, then repeat from step 4

### Testing
- Setting up test infrastructure for Vue 3 projects → See [testing-vitest-recommended-for-vue](reference/testing-vitest-recommended-for-vue.md)
- Tests keep breaking when refactoring component internals → See [testing-component-blackbox-approach](reference/testing-component-blackbox-approach.md)
- Tests fail intermittently with race conditions → See [testing-async-await-flushpromises](reference/testing-async-await-flushpromises.md)
- Composables using lifecycle hooks or inject fail to test → See [testing-composables-helper-wrapper](reference/testing-composables-helper-wrapper.md)
- Getting "injection Symbol(pinia) not found" errors in tests → See [testing-pinia-store-setup](reference/testing-pinia-store-setup.md)
- Components with async setup won't render in tests → See [testing-suspense-async-components](reference/testing-suspense-async-components.md)
- Snapshot tests keep passing despite broken functionality → See [testing-no-snapshot-only](reference/testing-no-snapshot-only.md)
- Choosing end-to-end testing framework for Vue apps → See [testing-e2e-playwright-recommended](reference/testing-e2e-playwright-recommended.md)
- Tests need to verify computed styles or real DOM events → See [testing-browser-vs-node-runners](reference/testing-browser-vs-node-runners.md)
- Testing components created with defineAsyncComponent fails → See [async-component-testing](reference/async-component-testing.md)
- Teleported modal content can't be found in wrapper queries → See [teleport-testing-complexity](reference/teleport-testing-complexity.md)

## Reference

- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
