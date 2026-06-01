<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Assessments</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Available Quizzes</h2>
      <p class="mt-2 text-sm text-slate-500">Attempt published quizzes and review your results.</p>
    </div>
    <div v-if="store.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="item in 3" :key="item" class="h-44 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <QuizCard v-for="quiz in store.quizzes" :key="quiz?.id" :quiz="quiz">
        <RouterLink class="focus-ring mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="`/student/quizzes/${quiz?.id}/attempt`">Attempt quiz</RouterLink>
      </QuizCard>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import QuizCard from '@/components/quiz/QuizCard.vue'
import { useStudentQuizAttemptStore } from '@/stores/student/quizAttemptStore'
const store = useStudentQuizAttemptStore()
onMounted(() => store.fetchQuizzes())
</script>
