<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Course setup</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">{{ description }}</p>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">
          {{ alert.message || store.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <CourseForm :saving="store.saving" :cancel-to="cancelTo" @submit="createCourse" />
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CourseForm from '@/components/course/CourseForm.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cancelTo: {
    type: String,
    required: true
  },
  store: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const alert = reactive({
  message: '',
  tone: 'success'
})

const createCourse = async (payload) => {
  alert.message = ''
  try {
    await props.store.createCourse(payload)
    alert.tone = 'success'
    alert.message = 'Course created successfully.'
    setTimeout(() => router.push(props.cancelTo), 500)
  } catch {
    alert.tone = 'error'
    alert.message = props.store.errors.general || 'Unable to create course.'
  }
}
</script>
