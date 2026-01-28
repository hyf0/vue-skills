import { computed, ref, watchEffect, type Ref } from 'vue'

type UseHiddenOptions = {
  initialHidden?: boolean
  target?: Ref<HTMLElement | null>
}

export function useHidden(options: UseHiddenOptions = {}) {
  const hidden = ref(options.initialHidden ?? false)

  const hiddenAttrs = computed(() => ({
    hidden: hidden.value,
    'aria-hidden': hidden.value ? 'true' : 'false',
  }))

  function setHidden(value: boolean) {
    hidden.value = value
  }

  function show() {
    setHidden(false)
  }

  function hide() {
    setHidden(true)
  }

  function toggle() {
    hidden.value = !hidden.value
  }

  if (options.target) {
    watchEffect(() => {
      const element = options.target?.value
      if (!element) return
      element.hidden = hidden.value
    })
  }

  return {
    hidden,
    hiddenAttrs,
    setHidden,
    show,
    hide,
    toggle,
  }
}
