<script setup lang="ts">
import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'

const emit = defineEmits<{
  add: [title: string]
}>()

const input = shallowRef('')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const inputId = 'todo-input'

const canSubmit = computed(() => input.value.trim().length > 0)

function submit() {
  if (!canSubmit.value) return
  emit('add', input.value)
  input.value = ''
  inputRef.value?.focus()
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <form class="todo-input" @submit.prevent="submit">
    <label class="sr-only" :for="inputId">Add a task</label>
    <div class="input-row">
      <input
        :id="inputId"
        ref="inputRef"
        v-model="input"
        type="text"
        name="todo"
        placeholder="Add a focus task"
        autocomplete="off"
        maxlength="120"
      />
      <button type="submit" class="add-button" :disabled="!canSubmit">
        Add task
      </button>
    </div>
    <p class="hint">Try: Draft proposal, Review designs, Ship update.</p>
  </form>
</template>

<style scoped>
.todo-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

input {
  flex: 1 1 260px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(31, 42, 42, 0.16);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: inset 0 1px 2px rgba(31, 42, 42, 0.08);
  font-size: 1rem;
}

input::placeholder {
  color: rgba(31, 42, 42, 0.45);
}

.add-button {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  background: linear-gradient(120deg, #2a8077, #1f6e66);
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.add-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(31, 110, 102, 0.3);
}

.hint {
  margin: 0;
  color: var(--color-ink-soft);
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .input-row {
    flex-direction: column;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
