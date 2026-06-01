<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Lesson setup</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">{{ description }}</p>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || lessonStore.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">
          {{ alert.message || lessonStore.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <LessonForm :course-id="route.params.courseId" :courses="courseStore.courses" :saving="lessonStore.saving" :cancel-to="cancelTo" @submit="createLesson" />
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import LessonForm from '@/components/lesson/LessonForm.vue'

const props = defineProps({
  title: String,
  description: String,
  cancelTo: String,
  lessonStore: {
    type: Object,
    required: true
  },
  courseStore: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const router = useRouter()
const alert = reactive({
  message: '',
  tone: 'success'
})

onMounted(() => {
  props.courseStore.fetchCourses()
})

const createLesson = async (payload) => {
  alert.message = ''
  try {
    await props.lessonStore.createLesson(route.params.courseId, payload)
    alert.tone = 'success'
    alert.message = 'Lesson created successfully.'
    setTimeout(() => router.push(props.cancelTo), 500)
  } catch {
    alert.tone = 'error'
    alert.message = props.lessonStore.errors.general || 'Unable to create lesson.'
  }
}
</script>
