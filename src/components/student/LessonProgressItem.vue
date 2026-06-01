<template>
  <button class="focus-ring flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left hover:bg-slate-50" type="button" @click="$emit('select', lesson)">
    <div class="flex items-center gap-3">
      <div class="grid size-10 place-items-center rounded-full" :class="lesson.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
        <CheckIcon v-if="lesson.completed" class="size-5" />
        <PlayIcon v-else class="size-5" />
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-950">{{ lesson.title }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ lesson.duration }}</p>
      </div>
    </div>
    <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="lesson.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
      {{ lesson.completed ? 'Completed' : 'In progress' }}
    </span>
  </button>
</template>

<script setup>
import { CheckIcon, PlayIcon } from '@heroicons/vue/24/solid'

defineEmits(['select'])
defineProps({
  lesson: {
    type: Object,
    required: true
  }
})
</script>
