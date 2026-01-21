---
title: Vue Test Utils TypeScript Wrapper Types
impact: MEDIUM
impactDescription: fixes "Property does not exist" errors when accessing wrapper.vm properties
type: efficiency
tags: vue-test-utils, vitest, testing, shallowMount, wrapper, typescript
---

# Vue Test Utils TypeScript Wrapper Types

**Impact: MEDIUM** - fixes "Property does not exist" errors when accessing wrapper.vm properties

When using `shallowMount` or `mount` with TypeScript, accessing `wrapper.vm.property` shows "Property does not exist on type 'ComponentPublicInstance'" even though it exists at runtime.

## Symptoms

- `wrapper.vm.propertyName` shows TypeScript error
- No autocomplete for component data/methods on `wrapper.vm`
- `VueWrapper<unknown>` instead of typed wrapper
- Third-party component mocking type errors

## Fix

**Option 1: Use InstanceType for typed wrappers**
```typescript
import { shallowMount, VueWrapper } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyComponent>>

  beforeEach(() => {
    wrapper = shallowMount(MyComponent) as VueWrapper<InstanceType<typeof MyComponent>>
  })

  it('accesses typed vm properties', () => {
    // Now properly typed
    expect(wrapper.vm.someProperty).toBe('value')
  })
})
```

**Option 2: Type assertion for specific access**
```typescript
const wrapper = shallowMount(MyComponent)

// Assert type when accessing vm
const vm = wrapper.vm as InstanceType<typeof MyComponent>
expect(vm.someMethod()).toBe(true)
```

**Option 3: Create typed mount helper**
```typescript
// test-utils.ts
import { mount, shallowMount, VueWrapper, MountingOptions } from '@vue/test-utils'
import { Component, DefineComponent } from 'vue'

export function typedMount<T extends DefineComponent<any, any, any>>(
  component: T,
  options?: MountingOptions<InstanceType<T>['$props']>
): VueWrapper<InstanceType<T>> {
  return mount(component, options) as VueWrapper<InstanceType<T>>
}

// Usage
const wrapper = typedMount(MyComponent, { props: { title: 'Test' } })
wrapper.vm.someMethod()  // Typed!
```

## Mocking Third-Party Components

When shallowMount fails on third-party imports:
```typescript
import { vi } from 'vitest'

// Mock the problematic import
vi.mock('@third-party/lib', () => ({
  default: { template: '<div />' }
}))

const wrapper = shallowMount(MyComponent)
```

## Props Type Access

For typed props testing:
```typescript
type Props = InstanceType<typeof MyComponent>['$props']

const props: Props = {
  title: 'Test',
  count: 5
}

const wrapper = shallowMount(MyComponent, { props })
```

## Reference

- [Vue Test Utils TypeScript](https://test-utils.vuejs.org/guide/advanced/typescript.html)
- [vuejs/test-utils#1746](https://github.com/vuejs/test-utils/issues/1746)
