<template>
  <section class="mx-auto max-w-2xl space-y-6">
    <div>
      <RouterLink to="/student/quizzes" class="text-sm font-medium text-brand-700">
        Back to Quizzes
      </RouterLink>
      <h1 class="mt-3 text-2xl font-semibold text-slate-950">Quiz Result</h1>
    </div>

    <div v-if="quiz.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ quiz.error.message }}
    </div>

    <div v-if="quiz.loading" class="rounded-lg border border-slate-200 bg-white p-6">
      <div class="mx-auto h-8 w-20 animate-pulse rounded-full bg-slate-200"></div>
      <div class="mx-auto mt-6 h-12 w-32 animate-pulse rounded bg-slate-200"></div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="h-24 animate-pulse rounded-lg bg-slate-100"></div>
        <div class="h-24 animate-pulse rounded-lg bg-slate-100"></div>
      </div>
    </div>

    <QuizResultCard v-else-if="quiz.result" :result="quiz.result" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QuizResultCard from '@/components/quiz/QuizResultCard.vue'
import { useLmsQuizStore } from '@/stores/lms/quizStore'

const route = useRoute()
const quiz = useLmsQuizStore()

const loadResult = async () => {
  try {
    await quiz.fetchResult(route.params.id)
  } catch {
    // The store owns the rendered error state.
  }
}

onMounted(loadResult)
</script>
