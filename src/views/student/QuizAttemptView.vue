<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Quiz attempt</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ quiz?.title || 'Quiz' }}</h2>
        <p class="mt-2 text-sm text-slate-500">{{ quiz?.description }}</p>
      </div>
      <QuizTimer v-if="quiz" :duration="quiz.duration" @expired="submit" />
    </div>

    <div v-if="store.loading" class="h-96 animate-pulse rounded-lg bg-slate-200"></div>
    <form v-else-if="quiz" class="space-y-4" @submit.prevent="submit">
      <article v-for="(question, index) in quiz.questions" :key="question.id" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-950">{{ index + 1 }}. {{ question.title }}</h3>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <label v-for="(option, key) in question.options" :key="key" class="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
            <input class="mt-0.5 size-4 border-slate-300 text-brand-600 focus:ring-brand-500" type="radio" :name="`question-${question.id}`" :value="key" @change="store.setAnswer(question.id, key)" />
            <span class="text-sm text-slate-700">{{ key }}. {{ option }}</span>
          </label>
        </div>
      </article>
      <button class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-70" type="submit" :disabled="store.submitting">
        {{ store.submitting ? 'Submitting...' : 'Submit quiz' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizTimer from '@/components/quiz/QuizTimer.vue'
import { useStudentQuizAttemptStore } from '@/stores/student/quizAttemptStore'
const route = useRoute()
const router = useRouter()
const store = useStudentQuizAttemptStore()
const quiz = computed(() => store.currentQuiz)
onMounted(() => store.attemptQuiz(route.params.id))
const submit = async () => {
  await store.submitQuiz(route.params.id)
  router.push(`/student/quizzes/${route.params.id}/result`)
}
</script>
