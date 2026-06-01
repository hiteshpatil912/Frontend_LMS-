<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Assignment title</span>
        <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.title" class="mt-1 text-sm text-rose-600">{{ validation.title }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Course</span>
        <select v-model="form.courseId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @change="syncCourse">
          <option value="">Select course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</option>
        </select>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Description</span>
        <textarea v-model.trim="form.description" class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        <p v-if="validation.description" class="mt-1 text-sm text-rose-600">{{ validation.description }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Lesson</span>
        <select v-model="form.lessonId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @change="syncLesson">
          <option value="">Course level assignment</option>
          <option v-for="lesson in filteredLessons" :key="lesson.id" :value="lesson.id">{{ lesson.title }}</option>
        </select>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Due date</span>
        <input v-model="form.dueDate" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="datetime-local" />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Total marks</span>
        <input v-model.number="form.totalMarks" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="1" />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Submission type</span>
        <select v-model="form.submissionType" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="file_upload">File upload</option>
          <option value="document">Document</option>
          <option value="zip">Project ZIP</option>
          <option value="image">Image upload</option>
        </select>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Attachment upload</span>
        <div class="mt-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <PaperClipIcon class="mx-auto size-7 text-slate-400" />
          <p class="mt-2 text-sm font-medium text-slate-700">{{ form.attachmentName || 'PDF, DOC, DOCX, ZIP, or images' }}</p>
          <input class="mt-3 text-sm" type="file" accept=".pdf,.doc,.docx,.zip,image/*" @change="selectFile" />
        </div>
      </label>
    </div>
    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50" to="/teacher/assignments">Cancel</RouterLink>
      <button class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="saving">{{ saving ? 'Saving...' : submitLabel }}</button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { PaperClipIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  courses: { type: Array, default: () => [] },
  lessons: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
  submitLabel: { type: String, default: 'Create assignment' }
})

const emit = defineEmits(['submit'])
const form = reactive({ title: '', description: '', courseId: '', course: '', lessonId: '', lesson: 'Course project', dueDate: '', attachmentName: '', totalMarks: 100, submissionType: 'file_upload' })
const validation = reactive({ title: '', description: '' })
const filteredLessons = computed(() => props.lessons.filter((lesson) => String(lesson.courseId) === String(form.courseId)))

const syncCourse = () => {
  const course = props.courses.find((item) => String(item.id) === String(form.courseId))
  form.course = course?.title || ''
}
const syncLesson = () => {
  const lesson = props.lessons.find((item) => String(item.id) === String(form.lessonId))
  form.lesson = lesson?.title || 'Course project'
}
const selectFile = (event) => {
  form.attachmentName = event.target.files?.[0]?.name || ''
}
const submit = () => {
  validation.title = form.title ? '' : 'Assignment title is required.'
  validation.description = form.description ? '' : 'Description is required.'
  if (validation.title || validation.description) return
  emit('submit', { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString() })
}
</script>
