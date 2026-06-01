<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Lesson title</span>
        <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.title" class="mt-1 text-sm text-rose-600">{{ validation.title }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Lesson slug</span>
        <input v-model.trim="form.slug" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.slug" class="mt-1 text-sm text-rose-600">{{ validation.slug }}</p>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Lesson description</span>
        <textarea v-model.trim="form.description" class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        <p v-if="validation.description" class="mt-1 text-sm text-rose-600">{{ validation.description }}</p>
      </label>
      <div class="lg:col-span-2">
        <VideoUploader v-model="form.videoUrl" @preview="form.videoPreview = $event" />
      </div>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Video URL</span>
        <input v-model.trim="form.videoUrl" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="url" />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Lesson duration</span>
        <input v-model.trim="form.duration" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="18 min" />
        <p v-if="validation.duration" class="mt-1 text-sm text-rose-600">{{ validation.duration }}</p>
      </label>
      <LessonOrderInput v-model="form.order" :error="validation.order" />
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Lesson status</span>
        <select v-model="form.status" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Course selection</span>
        <select v-model.number="form.courseId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</option>
        </select>
        <p v-if="validation.courseId" class="mt-1 text-sm text-rose-600">{{ validation.courseId }}</p>
      </label>
    </div>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="cancelTo">Cancel</RouterLink>
      <button class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="saving">
        <ArrowPathIcon v-if="saving" class="mr-2 size-4 animate-spin" />
        {{ saving ? 'Saving...' : 'Create lesson' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import LessonOrderInput from '@/components/lesson/LessonOrderInput.vue'
import VideoUploader from '@/components/lesson/VideoUploader.vue'

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  },
  courses: {
    type: Array,
    default: () => []
  },
  saving: Boolean,
  cancelTo: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  title: '',
  slug: '',
  description: '',
  videoUrl: '',
  videoPreview: '',
  duration: '',
  order: 1,
  status: 'draft',
  courseId: Number(props.courseId),
  courseName: ''
})

const validation = reactive({
  title: '',
  slug: '',
  description: '',
  duration: '',
  order: '',
  courseId: ''
})

watch(
  () => form.title,
  (title) => {
    if (!form.slug) form.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
)

const validate = () => {
  validation.title = form.title ? '' : 'Lesson title is required.'
  validation.slug = form.slug ? '' : 'Lesson slug is required.'
  validation.description = form.description ? '' : 'Lesson description is required.'
  validation.duration = form.duration ? '' : 'Lesson duration is required.'
  validation.order = Number(form.order) >= 1 ? '' : 'Lesson order must be at least 1.'
  validation.courseId = form.courseId ? '' : 'Select a course.'
  return Object.values(validation).every((message) => !message)
}

const submit = () => {
  if (!validate()) return
  const course = props.courses.find((item) => Number(item.id) === Number(form.courseId))
  emit('submit', {
    ...form,
    courseName: course?.title || form.courseName
  })
}
</script>
