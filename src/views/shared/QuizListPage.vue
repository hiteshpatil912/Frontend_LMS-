<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Assessments</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h2>
        <p class="mt-2 text-sm text-slate-500">{{ description }}</p>
      </div>
      <RouterLink class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="createTo">Create quiz</RouterLink>
    </div>
    <div v-if="store.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="item in 4" :key="item" class="h-44 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <QuizCard v-for="quiz in store.quizzes" :key="quiz?.id" :quiz="quiz">
        <div class="mt-5 flex gap-2">
          <RouterLink class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="`${basePath}/${quiz?.id}/edit`">Edit</RouterLink>
          <button class="focus-ring rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50" type="button" @click="remove(quiz?.id)">Delete</button>
        </div>
      </QuizCard>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import QuizCard from '@/components/quiz/QuizCard.vue'

const props = defineProps({ title: String, description: String, createTo: String, basePath: String, store: Object })
onMounted(() => props.store.fetchQuizzes())
const remove = (id) => props.store.deleteQuiz(id)
</script>
