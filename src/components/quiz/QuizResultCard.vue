<template>
  <section class="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
    <span
      class="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
      :class="result.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
    >
      {{ result.passed ? 'Pass' : 'Fail' }}
    </span>

    <p class="mt-5 text-5xl font-semibold text-slate-950">
      {{ result.scorePercentage }}%
    </p>
    <p class="mt-2 text-sm text-slate-500">Score Percentage</p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-lg bg-emerald-50 p-4 text-emerald-700">
        <p class="text-sm">Correct Answers</p>
        <p class="mt-1 text-2xl font-semibold">{{ result.correctAnswers }}</p>
      </div>
      <div class="rounded-lg bg-slate-50 p-4 text-slate-700">
        <p class="text-sm">Total Questions</p>
        <p class="mt-1 text-2xl font-semibold">{{ result.totalQuestions }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    required: true
  }
})
</script>
