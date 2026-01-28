<script setup lang="ts">
import type { Todo } from '../types/todo'

const { todos, emptyMessage } = defineProps<{
  todos: Todo[]
  emptyMessage: string
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <section class="todo-list" aria-live="polite">
    <div v-if="todos.length === 0" class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>

    <ul v-else class="todo-items">
      <li
        v-for="(todo, index) in todos"
        :key="todo.id"
        class="todo-item"
        :class="{ 'is-complete': todo.completed }"
        :style="{ '--delay': index }"
      >
        <label class="todo-toggle">
          <input
            type="checkbox"
            :checked="todo.completed"
            :aria-label="
              todo.completed
                ? `Mark ${todo.title} as not done`
                : `Mark ${todo.title} as done`
            "
            @change="emit('toggle', todo.id)"
          />
          <span></span>
        </label>
        <span class="todo-title">{{ todo.title }}</span>
        <button
          type="button"
          class="remove-button"
          aria-label="Remove task"
          @click="emit('remove', todo.id)"
        >
          Remove
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  padding: 24px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.7);
  border: 1px dashed rgba(31, 42, 42, 0.2);
  color: var(--color-ink-soft);
  text-align: center;
}

.todo-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.todo-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(31, 42, 42, 0.08);
  box-shadow: 0 16px 32px rgba(24, 36, 35, 0.12);
  animation: item-in 500ms ease forwards;
  animation-delay: calc(var(--delay) * 70ms);
  opacity: 0;
  transform: translateY(8px);
}

.todo-item.is-complete {
  opacity: 0.7;
}

.todo-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
}

.todo-toggle input {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 8px;
  border: 2px solid rgba(31, 42, 42, 0.25);
  display: grid;
  place-items: center;
  background: #fff;
  transition: background 200ms ease, border-color 200ms ease;
}

.todo-toggle input::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 4px;
  background: #2a8077;
  transform: scale(0);
  transition: transform 160ms ease;
}

.todo-toggle input:checked {
  border-color: #2a8077;
  background: rgba(42, 128, 119, 0.15);
}

.todo-toggle input:checked::after {
  transform: scale(1);
}

.todo-title {
  font-size: 1rem;
  font-weight: 600;
}

.todo-item.is-complete .todo-title {
  text-decoration: line-through;
  color: rgba(31, 42, 42, 0.5);
}

.remove-button {
  border: none;
  background: transparent;
  color: #b24d36;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;
  transition: background 200ms ease;
}

.remove-button:hover {
  background: rgba(214, 107, 77, 0.12);
}

@keyframes item-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .todo-item {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    align-items: start;
  }

  .remove-button {
    grid-column: 2 / 3;
    justify-self: flex-start;
  }
}
</style>
