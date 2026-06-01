<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 class="text-base font-semibold text-slate-950">{{ course.title }}</h3>
        <p class="mt-1 text-sm text-slate-500">{{ course.instructor }}</p>
      </div>
      <span :class="course.eligible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
        {{ course.eligible ? 'Eligible' : 'Not eligible' }}
      </span>
    </div>
    <div class="mt-5 grid gap-3 sm:grid-cols-3">
      <div v-for="rule in rules" :key="rule.label" class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs font-medium text-slate-500">{{ rule.label }}</p>
        <p :class="rule.passed ? 'text-emerald-700' : 'text-amber-700'" class="mt-1 text-sm font-semibold">{{ rule.passed ? 'Complete' : 'Needed' }}</p>
      </div>
    </div>
    <button class="focus-ring mt-5 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60" type="button" :disabled="!course.eligible || generating || issued" @click="$emit('generate', course)">
      {{ issued ? 'Certificate issued' : generating ? 'Generating...' : 'Generate certificate' }}
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  generating: {
    type: Boolean,
    default: false
  },
  issued: {
    type: Boolean,
    default: false
  }
})

defineEmits(['generate'])

const rules = computed(() => [
  { label: 'Lessons', passed: props.course.allLessonsCompleted },
  { label: 'Quiz', passed: props.course.quizPassed },
  { label: 'Course', passed: props.course.courseCompleted }
])
</script>
