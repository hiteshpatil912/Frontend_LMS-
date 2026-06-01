<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Course setup</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Edit Course</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Update course details, thumbnail, pricing, level, duration, and publishing status.</p>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">
          {{ alert.message || store.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="h-10 animate-pulse rounded bg-slate-200"></div>
      <div class="h-32 animate-pulse rounded bg-slate-200"></div>
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="item in 6" :key="item" class="h-10 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>
    <EditCourseForm v-else-if="store.currentCourse" :course="store.currentCourse" :saving="store.saving" :cancel-to="`${basePath}/${route.params.id}`" @submit="updateCourse" />
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import EditCourseForm from '@/components/course/EditCourseForm.vue'

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
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
  props.store.fetchSingleCourse(route.params.id)
})

const updateCourse = async (payload) => {
  alert.message = ''
  try {
    await props.store.updateCourse(route.params.id, payload)
    alert.tone = 'success'
    alert.message = 'Course updated successfully.'
    setTimeout(() => router.push(`${props.basePath}/${route.params.id}`), 500)
  } catch {
    alert.tone = 'error'
    alert.message = props.store.errors.general || 'Unable to update course.'
  }
}
</script>
