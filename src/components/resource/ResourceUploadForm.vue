<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Title</span>
        <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.title" class="mt-1 text-sm text-rose-600">{{ validation.title }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Visibility</span>
        <select v-model="form.visibility" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Description</span>
        <textarea v-model.trim="form.description" class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        <p v-if="validation.description" class="mt-1 text-sm text-rose-600">{{ validation.description }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Course</span>
        <select v-model="form.courseId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @change="syncCourse">
          <option value="">Select course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</option>
        </select>
        <p v-if="validation.courseId" class="mt-1 text-sm text-rose-600">{{ validation.courseId }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Lesson</span>
        <select v-model="form.lessonId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @change="syncLesson">
          <option value="">Course resources</option>
          <option v-for="lesson in filteredLessons" :key="lesson.id" :value="lesson.id">{{ lesson.title }}</option>
        </select>
      </label>

      <div class="lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">PDF notes</span>
        <label class="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:border-brand-300 hover:bg-brand-50/40" @dragover.prevent @drop.prevent="selectFile($event.dataTransfer.files?.[0], 'pdf')">
          <DocumentArrowUpIcon class="size-8 text-slate-400" />
          <span class="mt-3 text-sm font-semibold text-slate-800">Drop PDF notes here or browse</span>
          <span class="mt-1 text-xs text-slate-500">PDF files up to 25 MB</span>
          <input class="sr-only" type="file" accept=".pdf,application/pdf" @change="selectFile($event.target.files?.[0], 'pdf')" />
        </label>
        <p v-if="validation.fileName" class="mt-1 text-sm text-rose-600">{{ validation.fileName }}</p>
      </div>

      <div class="lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Attachment</span>
        <label class="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-5 py-6 text-center hover:border-brand-300" @dragover.prevent @drop.prevent="selectFile($event.dataTransfer.files?.[0], 'attachment')">
          <PaperClipIcon class="size-7 text-slate-400" />
          <span class="mt-2 text-sm font-medium text-slate-800">Add DOC, DOCX, ZIP, or another PDF</span>
          <input class="sr-only" type="file" accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip" @change="selectFile($event.target.files?.[0], 'attachment')" />
        </label>
      </div>

      <div class="grid gap-4 lg:col-span-2 lg:grid-cols-2">
        <PDFPreviewCard :file-name="form.fileName" :file-type="form.fileType" :file-size="form.fileSize" :progress="uploadProgress" />
        <PDFPreviewCard :file-name="form.attachmentName" :file-type="form.attachmentType" :file-size="form.attachmentSize" :progress="attachmentProgress" />
      </div>
    </div>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="cancelTo">
        Cancel
      </RouterLink>
      <button class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="loading">
        {{ loading ? 'Uploading...' : 'Upload resource' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { DocumentArrowUpIcon, PaperClipIcon } from '@heroicons/vue/24/outline'
import PDFPreviewCard from '@/components/resource/PDFPreviewCard.vue'

const props = defineProps({
  courses: {
    type: Array,
    default: () => []
  },
  lessons: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  cancelTo: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit'])
const allowedTypes = ['PDF', 'DOC', 'DOCX', 'ZIP']
const maxFileSize = 25 * 1024 * 1024
const uploadProgress = ref(0)
const attachmentProgress = ref(0)

const form = reactive({
  title: '',
  description: '',
  courseId: '',
  course: '',
  lessonId: '',
  lesson: 'Course resources',
  fileName: '',
  fileType: '',
  fileSize: '',
  fileUrl: '#',
  attachmentName: '',
  attachmentType: '',
  attachmentSize: '',
  visibility: 'draft'
})

const validation = reactive({
  title: '',
  description: '',
  courseId: '',
  fileName: ''
})

const filteredLessons = computed(() => props.lessons.filter((lesson) => String(lesson.courseId) === String(form.courseId)))

const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
const fileType = (file) => file.name.split('.').pop().toUpperCase()

const selectFile = (file, target) => {
  if (!file) return
  const type = fileType(file)
  const field = target === 'pdf' ? 'fileName' : 'attachmentName'
  validation[field] = ''
  if (!allowedTypes.includes(type) || (target === 'pdf' && type !== 'PDF')) {
    validation[field] = target === 'pdf' ? 'PDF notes must be a PDF file.' : 'Attachment must be PDF, DOC, DOCX, or ZIP.'
    return
  }
  if (file.size > maxFileSize) {
    validation[field] = 'File must be 25 MB or smaller.'
    return
  }
  if (target === 'pdf') {
    form.fileName = file.name
    form.fileType = type
    form.fileSize = formatSize(file.size)
    uploadProgress.value = 100
    return
  }
  form.attachmentName = file.name
  form.attachmentType = type
  form.attachmentSize = formatSize(file.size)
  attachmentProgress.value = 100
}

const syncCourse = () => {
  const course = props.courses.find((item) => String(item.id) === String(form.courseId))
  form.course = course?.title || ''
  form.lessonId = ''
  form.lesson = 'Course resources'
}

const syncLesson = () => {
  const lesson = props.lessons.find((item) => String(item.id) === String(form.lessonId))
  form.lesson = lesson?.title || 'Course resources'
}

const validate = () => {
  validation.title = form.title ? '' : 'Resource title is required.'
  validation.description = form.description ? '' : 'Description is required.'
  validation.courseId = form.courseId ? '' : 'Course selection is required.'
  validation.fileName = form.fileName ? '' : 'PDF notes file is required.'
  return Object.values(validation).every((message) => !message)
}

const submit = () => {
  if (!validate()) return
  emit('submit', { ...form })
}
</script>
