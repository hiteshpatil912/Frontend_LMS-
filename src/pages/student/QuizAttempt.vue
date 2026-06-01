<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <div>
      <RouterLink to="/student/quizzes" class="text-sm font-medium text-brand-700">
        Back to Quizzes
      </RouterLink>
      <h1 class="mt-3 text-2xl font-semibold text-slate-950">
        {{ quiz.activeQuiz?.title || 'Quiz Attempt' }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        {{ quiz.answeredCount }} of {{ quiz.questions.length }} answered
      </p>
    </div>

    <div v-if="quiz.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ quiz.error.message }}
    </div>

    <div v-if="quiz.loading" class="space-y-4">
      <div v-for="item in 3" :key="item" class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-5 w-3/4 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-5 space-y-3">
          <div v-for="option in 4" :key="option" class="h-11 animate-pulse rounded bg-slate-100"></div>
        </div>
      </div>
    </div>

    <form v-else-if="quiz.activeQuiz" class="space-y-4" @submit.prevent="submit">
      <QuizQuestionCard
        v-for="(question, index) in quiz.questions"
        :key="question.id"
        :question="question"
        :index="index"
        :model-value="quiz.answers[String(question.id)]"
        @update:model-value="quiz.answerQuestion(question.id, $event)"
      />

      <div class="sticky bottom-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="submit"
          class="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="quiz.submitting"
        >
          {{ quiz.submitting ? 'Submitting...' : 'Submit Quiz' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizQuestionCard from '@/components/quiz/QuizQuestionCard.vue'
import { useLmsQuizStore } from '@/stores/lms/quizStore'

const route = useRoute()
const router = useRouter()
const quiz = useLmsQuizStore()

const loadAttempt = async () => {
  try {
    await quiz.startQuiz(route.params.id)
  } catch {
    // The store owns the rendered error state.
  }
}

const submit = async () => {
  try {
    await quiz.submitQuiz(route.params.id)
    await router.push(`/student/quiz/${route.params.id}/result`)
  } catch {
    // The store owns the rendered error state.
  }
}

onMounted(loadAttempt)
</script>
