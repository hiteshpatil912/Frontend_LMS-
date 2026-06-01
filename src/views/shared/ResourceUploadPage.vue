<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">{{ eyebrow }}</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Upload resource</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Attach PDF notes and supporting files to a course or lesson.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <ResourceUploadForm :courses="courseStore.courses" :lessons="lessonStore.lessons" :loading="store.uploading" :cancel-to="cancelTo" @submit="uploadResource" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import ResourceUploadForm from '@/components/resource/ResourceUploadForm.vue'

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  courseStore: {
    type: Object,
    required: true
  },
  lessonStore: {
    type: Object,
    required: true
  },
  cancelTo: {
    type: String,
    required: true
  },
  eyebrow: {
    type: String,
    default: 'Content library'
  }
})

const router = useRouter()

const uploadResource = async (payload) => {
  await props.store.uploadResource(payload)
  router.push(props.cancelTo)
}

onMounted(() => props.courseStore.fetchCourses())
</script>
