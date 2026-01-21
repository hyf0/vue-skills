---
title: Testing Teleported Content
impact: HIGH
impactDescription: properly tests modals, tooltips, and other teleported components
type: capability
tags: teleport, modal, testing, vitest, vue-test-utils, dom
---

# Testing Teleported Content

**Impact: HIGH** - properly tests modals, tooltips, and other teleported components

Teleported components render outside the component hierarchy, breaking standard Vue Test Utils queries like `wrapper.find()`.

## Symptoms

- `wrapper.find('.modal')` returns empty
- `wrapper.findComponent(Modal)` can't locate teleported content
- Stubbing Teleport breaks reactivity
- Tests pass but don't actually test the teleported content

## Fix

**Pattern 1: Use document queries for teleported content**
```typescript
import { mount } from '@vue/test-utils'
import ModalComponent from './ModalComponent.vue'

test('modal displays content when open', async () => {
  const wrapper = mount(ModalComponent, {
    props: { isOpen: true }
  })

  // Teleported content is in document.body, not wrapper
  const modal = document.body.querySelector('.modal')
  expect(modal).toBeTruthy()
  expect(modal?.textContent).toContain('Modal Content')

  // Cleanup teleported content
  wrapper.unmount()
})
```

**Pattern 2: Stub Teleport for unit testing**
```typescript
test('modal logic without teleport', async () => {
  const wrapper = mount(ModalComponent, {
    props: { isOpen: true },
    global: {
      stubs: {
        Teleport: true  // Renders content inline
      }
    }
  })

  // Now wrapper.find works
  expect(wrapper.find('.modal').exists()).toBe(true)
})
```

**Pattern 3: Custom teleport target**
```typescript
// In your test setup
beforeEach(() => {
  // Create a dedicated teleport target
  const el = document.createElement('div')
  el.id = 'test-teleport-target'
  document.body.appendChild(el)
})

afterEach(() => {
  document.getElementById('test-teleport-target')?.remove()
})

test('modal with custom target', async () => {
  const wrapper = mount(ModalComponent, {
    props: {
      isOpen: true,
      teleportTo: '#test-teleport-target'
    }
  })

  const target = document.getElementById('test-teleport-target')
  expect(target?.querySelector('.modal')).toBeTruthy()
})
```

**Pattern 4: Helper function for teleport testing**
```typescript
// test/utils.ts
export function findTeleported(selector: string): Element | null {
  return document.body.querySelector(selector)
}

export function findAllTeleported(selector: string): NodeListOf<Element> {
  return document.body.querySelectorAll(selector)
}

// Usage
test('multiple modals', async () => {
  const modals = findAllTeleported('.modal')
  expect(modals.length).toBe(2)
})
```

## Interaction Testing

```typescript
test('modal closes on button click', async () => {
  const wrapper = mount(ModalComponent, {
    props: { isOpen: true }
  })

  // Find the close button in the teleported content
  const closeButton = document.body.querySelector('.modal-close')
  closeButton?.dispatchEvent(new Event('click'))

  await wrapper.vm.$nextTick()

  expect(wrapper.emitted('close')).toBeTruthy()
})
```

## When to Stub vs Query Document

| Approach | Use When |
|----------|----------|
| Stub Teleport | Testing component logic, not teleport behavior |
| Query document | Testing actual rendered position and DOM structure |
| Custom target | Need controlled environment for teleport |

## Reference

- [Vue Test Utils Issue #798](https://github.com/vuejs/test-utils/issues/798)
- [Vue Test Utils Teleport Guide](https://test-utils.vuejs.org/guide/advanced/teleport.html)
