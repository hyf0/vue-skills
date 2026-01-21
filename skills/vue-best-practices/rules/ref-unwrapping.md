---
title: Ref Auto-Unwrapping in Reactive Objects
impact: MEDIUM
impactDescription: prevents confusion from automatic ref unwrapping behavior
type: efficiency
tags: ref, reactive, unwrapping, proxy, composition-api
---

# Ref Auto-Unwrapping in Reactive Objects

**Impact: MEDIUM** - prevents confusion from automatic ref unwrapping behavior

Refs are automatically unwrapped when nested inside reactive objects, which can cause confusion when mixing `ref()` and `reactive()` patterns.

## Symptoms

- Unexpected behavior when accessing nested refs
- `.value` not needed in some contexts but required in others
- Confusion about whether a property is a ref or not
- Type inference issues with nested refs

## The Behavior

```typescript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ count })  // count ref gets unwrapped!

// In the reactive object, no .value needed:
state.count++  // Works! (auto-unwrapped)
console.log(state.count)  // 1

// The original ref is still linked:
console.log(count.value)  // 1 (same value)

// But in plain objects, no unwrapping:
const obj = { count }  // Plain object
obj.count.value++  // Need .value here
```

## When Unwrapping Happens

| Context | Unwrapped? | Access Pattern |
|---------|------------|----------------|
| `reactive({ ref })` | Yes | `state.prop` |
| `ref({ ref })` | No* | `outer.value.inner.value` |
| Plain object `{ ref }` | No | `obj.prop.value` |
| Arrays `reactive([ref])` | No | `arr[0].value` |
| Maps/Sets | No | `map.get('key').value` |

*Deep refs in ref objects are unwrapped when accessed

## Recommended Patterns

**Pattern 1: Consistent ref-only approach**
```typescript
// Use refs for everything, avoid mixing
const count = ref(0)
const name = ref('Vue')
const items = ref<string[]>([])

// Always use .value in script
count.value++
name.value = 'New'
```

**Pattern 2: Consistent reactive-only approach**
```typescript
// Use reactive for object state
const state = reactive({
  count: 0,
  name: 'Vue',
  items: [] as string[]
})

// No .value needed
state.count++
state.name = 'New'
```

**Pattern 3: If mixing, document clearly**
```typescript
const count = ref(0)  // Ref
const state = reactive({
  count,  // Will be unwrapped
  // WARNING: count is unwrapped here
})

// Both work and stay in sync:
state.count++
count.value++
```

## Array Gotcha

Refs in reactive arrays are NOT unwrapped:
```typescript
const items = reactive([ref(1), ref(2)])

// Must use .value
items[0].value++  // Correct
items[0]++  // Wrong! Won't work as expected
```

## Reference

- [Vue Ref Unwrapping](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#additional-ref-unwrapping-details)
- [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
