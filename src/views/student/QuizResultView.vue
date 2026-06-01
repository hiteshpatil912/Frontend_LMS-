<template>
  <section class="mx-auto max-w-2xl space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Quiz result</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Assessment Summary</h2>
    </div>
    <div v-if="store.loading" class="h-80 animate-pulse rounded-lg bg-slate-200"></div>
    <QuizResultCard v-else-if="store.result" :result="store.result" />
    <RouterLink class="focus-ring inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" to="/student/quizzes">Back to quizzes</RouterLink>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QuizResultCard from '@/components/quiz/QuizResultCard.vue'
import { useStudentQuizAttemptStore } from '@/stores/student/quizAttemptStore'
const route = useRoute()
const store = useStudentQuizAttemptStore()
onMounted(() => store.fetchQuizResult(route.params.id))
</script>
