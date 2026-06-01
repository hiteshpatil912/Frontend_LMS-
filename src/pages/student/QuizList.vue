<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-950">Quizzes</h1>
        <p class="mt-1 text-sm text-slate-500">Start or review your available quizzes.</p>
      </div>

      <button
        type="button"
        class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="quiz.loading"
        @click="loadQuizzes"
      >
        Refresh
      </button>
    </div>

    <div v-if="quiz.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ quiz.error.message }}
    </div>

    <div v-if="quiz.loading" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in 6" :key="item" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-4 h-4 w-28 animate-pulse rounded bg-slate-100"></div>
        <div class="mt-6 h-10 w-full animate-pulse rounded bg-slate-200"></div>
      </article>
    </div>

    <div v-else-if="quiz.hasQuizzes" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in quiz.quizzes" :key="item.id" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-950">{{ item.title }}</h2>
        <p class="mt-2 text-sm text-slate-500">{{ item.totalQuestions }} questions</p>
        <RouterLink
          :to="`/student/quiz/${item.id}/attempt`"
          class="mt-5 inline-flex w-full justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Start Quiz
        </RouterLink>
      </article>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No quizzes found.
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLmsQuizStore } from '@/stores/lms/quizStore'

const quiz = useLmsQuizStore()

const loadQuizzes = async () => {
  try {
    await quiz.fetchQuizzes()
  } catch {
    // The store owns the rendered error state.
  }
}

onMounted(loadQuizzes)
</script>
