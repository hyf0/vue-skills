<template>
  <div class="page">
    <div class="backdrop" aria-hidden="true">
      <div class="backdrop__orb backdrop__orb--peach"></div>
      <div class="backdrop__orb backdrop__orb--mint"></div>
      <div class="backdrop__grain"></div>
    </div>

    <main class="app">
      <header class="header">
        <div class="header__copy">
          <p class="eyebrow">Focus Board</p>
          <h1>Today's Momentum</h1>
          <p class="subtitle">Small steps, steady glow. Build a rhythm you can feel.</p>
        </div>
        <div class="header__stats">
          <div class="pill">
            <span class="pill__label">Date</span>
            <span class="pill__value">{{ todayLabel }}</span>
          </div>
          <div class="pill">
            <span class="pill__label">Active</span>
            <span class="pill__value">{{ activeCount }}</span>
          </div>
        </div>
      </header>

      <section class="composer">
        <form class="composer__form" @submit.prevent="addTodo">
          <div class="input-wrap">
            <input
              v-model="newTodo"
              type="text"
              name="todo"
              autocomplete="off"
              placeholder="What would make today feel complete?"
              aria-label="New todo"
            >
            <span class="input-glow" aria-hidden="true"></span>
          </div>
          <button type="submit" class="btn btn--primary" :disabled="newTodo.trim().length === 0">
            Add task
          </button>
        </form>

        <div class="composer__meta">
          <button
            type="button"
            class="btn btn--ghost"
            :disabled="totalCount === 0"
            @click="toggleAll"
          >
            {{ activeCount > 0 ? 'Complete all' : 'Reset all' }}
          </button>
          <div class="progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
            <div class="progress__bar" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="progress__label">{{ doneCount }} / {{ totalCount }} done</span>
        </div>
      </section>

      <section class="list">
        <TransitionGroup name="todo" tag="ul" class="list__items">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="todo-item"
            :class="{ 'todo-item--done': todo.completed }"
          >
            <label class="todo-item__main">
              <input v-model="todo.completed" type="checkbox" class="todo-item__checkbox">
              <span class="todo-item__check" aria-hidden="true"></span>
              <span class="todo-item__text">
                <span class="todo-item__title">{{ todo.text }}</span>
                <span class="todo-item__meta">{{ formatTime(todo.createdAt) }}</span>
              </span>
            </label>
            <button type="button" class="icon-button" @click="removeTodo(todo.id)">
              Remove
            </button>
          </li>
        </TransitionGroup>

        <div v-if="filteredTodos.length === 0" class="empty">
          <p class="empty__title">{{ emptyTitle }}</p>
          <p class="empty__body">{{ emptyBody }}</p>
        </div>
      </section>

      <footer class="footer">
        <div class="filters" role="tablist" aria-label="Todo filters">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            class="filters__btn"
            :class="{ 'filters__btn--active': filter === option.value }"
            :aria-pressed="filter === option.value"
            @click="filter = option.value"
          >
            {{ option.label }}
          </button>
        </div>
        <button
          type="button"
          class="btn btn--ghost"
          :disabled="doneCount === 0"
          @click="clearCompleted"
        >
          Clear done
        </button>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

type Filter = 'all' | 'active' | 'done'

type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'focus-todo-v1'

const newTodo = ref('')
const todos = ref<Todo[]>([])
const filter = ref<Filter>('all')

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' }
]

const todayLabel = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric'
}).format(new Date())

const totalCount = computed(() => todos.value.length)
const doneCount = computed(() => todos.value.filter((todo) => todo.completed).length)
const activeCount = computed(() => totalCount.value - doneCount.value)
const progress = computed(() => (totalCount.value === 0 ? 0 : Math.round((doneCount.value / totalCount.value) * 100)))

const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter((todo) => !todo.completed)
  }
  if (filter.value === 'done') {
    return todos.value.filter((todo) => todo.completed)
  }
  return todos.value
})

const emptyTitle = computed(() => {
  if (totalCount.value === 0) {
    return 'Your board is clear.'
  }
  if (filter.value === 'active') {
    return 'No active tasks.'
  }
  if (filter.value === 'done') {
    return 'No completed tasks.'
  }
  return 'Nothing to show.'
})

const emptyBody = computed(() => {
  if (totalCount.value === 0) {
    return 'Capture the next small step and watch the momentum build.'
  }
  if (filter.value === 'active') {
    return 'Everything is finished. Time to celebrate or start something new.'
  }
  if (filter.value === 'done') {
    return 'Check off a task to see it land here.'
  }
  return 'Try another filter or add a fresh task.'
})

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

const addTodo = () => {
  const text = newTodo.value.trim()
  if (!text) return

  todos.value.unshift({
    id: createId(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  })

  newTodo.value = ''
}

const removeTodo = (id: string) => {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}

const clearCompleted = () => {
  todos.value = todos.value.filter((todo) => !todo.completed)
}

const toggleAll = () => {
  const shouldComplete = activeCount.value > 0
  todos.value = todos.value.map((todo) => ({
    ...todo,
    completed: shouldComplete
  }))
}

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return
  try {
    const parsed = JSON.parse(stored) as Todo[]
    if (Array.isArray(parsed)) {
      todos.value = parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored todos', error)
  }
})

watch(
  todos,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true }
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Space+Grotesk:wght@400;500;600&display=swap');

:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-height: 100vh;
  font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
  color: #1f2a2e;
  background: #f7f2ea;
}

:global(#app) {
  min-height: 100vh;
}

.page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px 64px;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(253, 230, 214, 0.8), transparent 55%),
    radial-gradient(circle at 80% 20%, rgba(193, 235, 227, 0.75), transparent 45%),
    linear-gradient(120deg, #fdf6ec, #e7f3ee 60%, #f7f2ea 100%);
  z-index: 0;
}

.backdrop__orb {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(0px);
  opacity: 0.65;
}

.backdrop__orb--peach {
  background: radial-gradient(circle, rgba(248, 181, 120, 0.8), rgba(248, 181, 120, 0));
  top: -120px;
  right: -80px;
}

.backdrop__orb--mint {
  background: radial-gradient(circle, rgba(120, 204, 183, 0.6), rgba(120, 204, 183, 0));
  bottom: -160px;
  left: -100px;
}

.backdrop__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d7c8b8' fill-opacity='0.15'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='70' cy='50' r='1.5'/%3E%3Ccircle cx='130' cy='90' r='2'/%3E%3Ccircle cx='40' cy='120' r='1.5'/%3E%3Ccircle cx='90' cy='150' r='2'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
  mix-blend-mode: multiply;
}

.app {
  position: relative;
  z-index: 1;
  width: min(940px, 92vw);
  background: rgba(255, 255, 255, 0.82);
  border-radius: 28px;
  padding: 36px 36px 32px;
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px rgba(31, 42, 46, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.7);
  animation: rise 0.8s ease both;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.header__copy h1 {
  font-family: 'Fraunces', 'Times New Roman', serif;
  font-size: clamp(2rem, 3vw, 2.8rem);
  margin: 8px 0 6px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.72rem;
  font-weight: 600;
  color: #7b6b5b;
  margin: 0;
}

.subtitle {
  margin: 0;
  color: #4d5a60;
  max-width: 460px;
}

.header__stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.pill {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(31, 42, 46, 0.08);
}

.pill__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #9a8574;
}

.pill__value {
  font-size: 1rem;
  font-weight: 600;
  color: #2a3439;
}

.composer {
  background: rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  padding: 20px;
  box-shadow: inset 0 0 0 1px rgba(31, 42, 46, 0.08);
  margin-bottom: 24px;
}

.composer__form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  width: 100%;
  padding: 16px 16px;
  border-radius: 16px;
  border: 1px solid transparent;
  background: #ffffff;
  font-size: 1rem;
  color: #1f2a2e;
  box-shadow: 0 10px 18px rgba(31, 42, 46, 0.08);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

.input-wrap input:focus {
  outline: none;
  border-color: rgba(248, 181, 120, 0.9);
  box-shadow: 0 12px 26px rgba(248, 181, 120, 0.22);
}

.input-glow {
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(248, 181, 120, 0.4), rgba(120, 204, 183, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-wrap input:focus + .input-glow {
  opacity: 1;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn--primary {
  background: linear-gradient(120deg, #f4a261, #f6b477);
  color: #2a1b12;
  box-shadow: 0 14px 26px rgba(244, 162, 97, 0.32);
}

.btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 32px rgba(244, 162, 97, 0.38);
}

.btn--ghost {
  background: transparent;
  color: #43565d;
  box-shadow: inset 0 0 0 1px rgba(31, 42, 46, 0.12);
}

.composer__meta {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
}

.progress {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: rgba(31, 42, 46, 0.1);
  overflow: hidden;
}

.progress__bar {
  position: absolute;
  inset: 0;
  transform-origin: left;
  background: linear-gradient(90deg, #78ccb7, #f4a261);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progress__label {
  font-size: 0.85rem;
  color: #6a7b82;
}

.list {
  min-height: 200px;
}

.list__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 22px rgba(31, 42, 46, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.todo-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(31, 42, 46, 0.12);
}

.todo-item__main {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  flex: 1;
}

.todo-item__checkbox {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  opacity: 0;
}

.todo-item__check {
  width: 22px;
  height: 22px;
  border-radius: 8px;
  border: 2px solid rgba(31, 42, 46, 0.3);
  display: grid;
  place-items: center;
  background: #fff;
  position: relative;
}

.todo-item__check::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: #78ccb7;
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.todo-item__checkbox:checked + .todo-item__check::after {
  opacity: 1;
  transform: scale(1);
}

.todo-item__checkbox:focus-visible + .todo-item__check {
  outline: 2px solid rgba(244, 162, 97, 0.8);
  outline-offset: 3px;
}

.todo-item__text {
  display: grid;
  gap: 4px;
}

.todo-item__title {
  font-weight: 600;
  color: #1f2a2e;
}

.todo-item__meta {
  font-size: 0.82rem;
  color: #7f8b90;
}

.todo-item--done .todo-item__title {
  text-decoration: line-through;
  color: #9aa3a6;
}

.todo-item--done .todo-item__check {
  border-color: rgba(120, 204, 183, 0.8);
}

.icon-button {
  border: none;
  background: transparent;
  color: #a35f46;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.icon-button:hover {
  background: rgba(248, 181, 120, 0.2);
  color: #8a4a35;
}

.empty {
  text-align: center;
  padding: 40px 16px;
  color: #6b787d;
}

.empty__title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px;
}

.empty__body {
  margin: 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters__btn {
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-weight: 600;
  color: #58666b;
  transition: background 0.2s ease, color 0.2s ease;
}

.filters__btn--active {
  background: #1f2a2e;
  color: #ffffff;
}

.todo-enter-active,
.todo-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.todo-enter-from,
.todo-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 720px) {
  .app {
    padding: 28px 20px 24px;
  }

  .composer__form {
    grid-template-columns: 1fr;
  }

  .composer__meta {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .todo-item__main {
    width: 100%;
  }

  .icon-button {
    align-self: flex-start;
  }
}
</style>
