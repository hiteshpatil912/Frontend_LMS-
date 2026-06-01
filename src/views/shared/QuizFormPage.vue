<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Quiz setup</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h2>
      <p class="mt-2 text-sm text-slate-500">{{ description }}</p>
    </div>
    <TransitionRoot appear :show="Boolean(alert.message || store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">{{ alert.message || store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>
    <div v-if="isEdit && store.loading" class="h-96 animate-pulse rounded-lg bg-slate-200"></div>
    <QuizForm v-else :initial-value="store.currentQuiz || {}" :courses="courseStore.courses" :saving="store.saving" :cancel-to="basePath" :submit-label="isEdit ? 'Update quiz' : 'Create quiz'" @submit="save" />
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import QuizForm from '@/components/quiz/QuizForm.vue'

const props = defineProps({ title: String, description: String, basePath: String, store: Object, courseStore: Object, isEdit: Boolean })
const route = useRoute()
const router = useRouter()
const alert = reactive({ message: '', tone: 'success' })
onMounted(() => {
  props.courseStore.fetchCourses()
  if (props.isEdit) props.store.fetchSingleQuiz(route.params.id)
})
const save = async (payload) => {
  try {
    if (props.isEdit) await props.store.updateQuiz(route.params.id, payload)
    else await props.store.createQuiz(payload)
    alert.message = props.isEdit ? 'Quiz updated successfully.' : 'Quiz created successfully.'
    setTimeout(() => router.push(props.basePath), 500)
  } catch {
    alert.tone = 'error'
    alert.message = props.store.errors.general || 'Unable to save quiz.'
  }
}
</script>
