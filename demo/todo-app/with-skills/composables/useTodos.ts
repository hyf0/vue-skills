import { computed, ref, shallowRef, watch } from 'vue'
import type { Filter, Todo } from '../types/todo'

const storageKey = 'todo-atlas-v1'

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadTodos(): Todo[] {
  if (typeof localStorage === 'undefined') return []
  const raw = localStorage.getItem(storageKey)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object',
      )
      .map((item) => {
        const title = typeof item.title === 'string' ? item.title.trim() : ''
        return {
          id: typeof item.id === 'string' ? item.id : createId(),
          title,
          completed: Boolean(item.completed),
          createdAt:
            typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        }
      })
      .filter((item) => item.title.length > 0)
  } catch {
    return []
  }
}

function saveTodos(value: Todo[]) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } catch {
    return
  }
}

export function useTodos() {
  const todos = ref<Todo[]>(loadTodos())
  const filter = shallowRef<Filter>('all')

  const totalCount = computed(() => todos.value.length)
  const remainingCount = computed(
    () => todos.value.filter((todo) => !todo.completed).length,
  )
  const completedCount = computed(
    () => totalCount.value - remainingCount.value,
  )
  const completionPercent = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.round((completedCount.value / totalCount.value) * 100)
  })

  const filteredTodos = computed(() => {
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.completed)
    }
    if (filter.value === 'completed') {
      return todos.value.filter((todo) => todo.completed)
    }
    return todos.value
  })

  function addTodo(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return
    const newTodo: Todo = {
      id: createId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    }
    todos.value = [newTodo, ...todos.value]
  }

  function toggleTodo(id: string) {
    todos.value = todos.value.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    )
  }

  function removeTodo(id: string) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed)
  }

  function setFilter(next: Filter) {
    filter.value = next
  }

  watch(todos, (value) => saveTodos(value))

  return {
    filter,
    totalCount,
    remainingCount,
    completedCount,
    completionPercent,
    filteredTodos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  }
}
