<template>
  <TransitionRoot appear :show="Boolean(message)" as="template">
    <TransitionChild
      as="template"
      enter="duration-200 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-150 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div class="rounded-lg border px-4 py-3 text-sm" :class="toneClass" role="alert">
        {{ message }}
      </div>
    </TransitionChild>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  tone: {
    type: String,
    default: 'error'
  }
})

const toneClass = computed(() =>
  props.tone === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-rose-200 bg-rose-50 text-rose-700'
)
</script>
