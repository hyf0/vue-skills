import { computed, ref, toRef, toValue, watch } from 'vue'
import type { MaybeRef, MaybeRefOrGetter } from 'vue'

export interface UseHiddenOptions {
  hidden?: MaybeRef<boolean>
  initialHidden?: MaybeRefOrGetter<boolean>
  syncAria?: boolean
}

export function useHidden(
  target?: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseHiddenOptions = {},
) {
  const hidden =
    options.hidden !== undefined
      ? toRef(options.hidden)
      : ref(toValue(options.initialHidden ?? false))

  const targetRef = target ? toRef(target) : ref<HTMLElement | null>(null)

  const attrs = computed(() => {
    if (!options.syncAria) {
      return { hidden: hidden.value }
    }
    return {
      hidden: hidden.value,
      'aria-hidden': hidden.value ? 'true' : 'false',
    }
  })

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
    setHidden(!hidden.value)
  }

  watch(
    [targetRef, hidden],
    ([element, isHidden]) => {
      if (!element) return
      element.hidden = isHidden
      if (options.syncAria) {
        element.setAttribute('aria-hidden', isHidden ? 'true' : 'false')
      } else {
        element.removeAttribute('aria-hidden')
      }
    },
    { immediate: true },
  )

  return {
    attrs,
    hidden,
    hide,
    setHidden,
    show,
    target: targetRef,
    toggle,
  }
}
