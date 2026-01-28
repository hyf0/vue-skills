<script setup lang="ts">
import { computed } from 'vue'
import TodoFilters from './components/TodoFilters.vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import { useTodos } from './composables/useTodos'

const {
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
} = useTodos()

const emptyMessage = computed(() => {
  if (totalCount.value === 0) {
    return 'No tasks yet. Add your first one to get started.'
  }
  if (filter.value === 'active') {
    return 'No active tasks. You are all caught up.'
  }
  if (filter.value === 'completed') {
    return 'No completed tasks yet.'
  }
  return 'No tasks to show.'
})
</script>

<template>
  <div class="page">
    <header class="app-header">
      <div class="badge">Studio List</div>
      <h1 class="app-title">Craft a calmer to-do day.</h1>
      <p class="app-subtitle">
        Keep your focus on a small set of purposeful tasks. Capture ideas,
        triage what matters, and ship with clarity.
      </p>
    </header>

    <main class="app-card">
      <section class="app-progress">
        <div>
          <p class="progress-label">Daily momentum</p>
          <p class="progress-value">{{ completionPercent }}% complete</p>
        </div>
        <div
          class="progress-track"
          role="progressbar"
          :aria-valuenow="completionPercent"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span
            class="progress-fill"
            :style="{ width: `${completionPercent}%` }"
          ></span>
        </div>
      </section>

      <TodoInput @add="addTodo" />

      <TodoFilters
        :filter="filter"
        :remaining="remainingCount"
        :completed="completedCount"
        :total="totalCount"
        @set-filter="setFilter"
        @clear-completed="clearCompleted"
      />

      <TodoList
        :todos="filteredTodos"
        :empty-message="emptyMessage"
        @toggle="toggleTodo"
        @remove="removeTodo"
      />
    </main>

    <footer class="app-footer">
      <p>Tip: add 3 small wins to keep today light.</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: clamp(24px, 6vw, 64px);
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 5vw, 44px);
}

.app-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 820px;
  margin: 0 auto;
  text-align: left;
  animation: float-in 700ms ease-out both;
}

.badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(42, 128, 119, 0.14);
  color: #1f6e66;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}

.app-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
  line-height: 1.05;
}

.app-subtitle {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  max-width: 680px;
}

.app-card {
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
  padding: clamp(20px, 5vw, 36px);
  border-radius: var(--radius-lg);
  background: linear-gradient(
    150deg,
    rgba(255, 255, 255, 0.92),
    rgba(255, 255, 255, 0.72)
  );
  border: 1px solid rgba(31, 42, 42, 0.08);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 24px;
  backdrop-filter: blur(12px);
  animation: panel-in 800ms ease-out both;
}

.app-progress {
  display: grid;
  grid-template-columns: minmax(0, 160px) minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.progress-label {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.progress-value {
  margin: 6px 0 0;
  font-family: var(--font-display);
  font-size: 1.4rem;
}

.progress-track {
  height: 12px;
  border-radius: 999px;
  background: rgba(31, 42, 42, 0.08);
  overflow: hidden;
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f0b35e, #2a8077);
  transition: width 300ms ease;
}

.app-footer {
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
  color: var(--color-ink-soft);
  font-size: 0.95rem;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 720px) {
  .app-progress {
    grid-template-columns: 1fr;
  }
}
</style>
