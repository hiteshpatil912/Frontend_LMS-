<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Quizzes</h1>
      <p class="mt-1 text-sm text-slate-500">Select a course and lesson to manage its quizzes.</p>
    </div>

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Course</span>
          <select
            v-model="selectedCourseId"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            :disabled="loadingCourses"
          >
            <option value="">Select course</option>
            <option v-for="course in courses" :key="course.id" :value="String(course.id)">
              {{ course.title }}
            </option>
          </select>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Lesson</span>
          <select
            v-model="selectedLessonId"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
            :disabled="!selectedCourseId || loadingLessons"
          >
            <option value="">Select lesson</option>
            <option v-for="lesson in lessons" :key="lesson.id" :value="String(lesson.id)">
              {{ lesson.title }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="loadingCourses || loadingLessons || loadingQuizzes" class="space-y-3">
      <article v-for="item in 3" :key="item" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
      </article>
    </div>

    <section v-else-if="selectedLesson" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 class="text-base font-semibold text-slate-950">Quiz Overview</h2>
          <p class="mt-1 text-sm text-slate-500">Review the selected lesson before opening quiz management.</p>
        </div>

        <RouterLink
          :to="`/teacher/lessons/${selectedLesson.id}/quizzes`"
          class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Manage Quiz
        </RouterLink>
      </div>

      <dl class="mt-5 grid gap-4 sm:grid-cols-3">
        <div class="rounded-lg border border-slate-200 p-4">
          <dt class="text-xs font-medium uppercase text-slate-500">Course Name</dt>
          <dd class="mt-2 text-sm font-semibold text-slate-950">{{ selectedCourse.title }}</dd>
        </div>
        <div class="rounded-lg border border-slate-200 p-4">
          <dt class="text-xs font-medium uppercase text-slate-500">Lesson Name</dt>
          <dd class="mt-2 text-sm font-semibold text-slate-950">{{ selectedLesson.title }}</dd>
        </div>
        <div class="rounded-lg border border-slate-200 p-4">
          <dt class="text-xs font-medium uppercase text-slate-500">Quiz Count</dt>
          <dd class="mt-2 text-sm font-semibold text-slate-950">{{ quizCount }}</dd>
        </div>
      </dl>
    </section>

    <div v-else-if="selectedCourseId" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No lessons found for this course.
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      Select a course to view lesson quiz details.
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { teacherCourseService } from '@/services/teacherCourseService'
import { teacherLessonService } from '@/services/teacherLessonService'
import { teacherQuizService } from '@/services/teacherQuizService'

const courses = ref([])
const lessons = ref([])
const quizzes = ref([])
const selectedCourseId = ref('')
const selectedLessonId = ref('')
const loadingCourses = ref(false)
const loadingLessons = ref(false)
const loadingQuizzes = ref(false)
const error = ref('')

const selectedCourse = computed(() => courses.value.find((course) => String(course.id) === String(selectedCourseId.value)) || {})
const selectedLesson = computed(() => lessons.value.find((lesson) => String(lesson.id) === String(selectedLessonId.value)) || null)
const quizCount = computed(() => quizzes.value.length)

const listFrom = (response, key) => {
  const queue = [response?.data, response?.data?.data, response]
  const seen = new Set()

  while (queue.length) {
    const payload = queue.shift()

    if (!payload || seen.has(payload)) continue
    seen.add(payload)

    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.[key])) return payload[key]
    if (Array.isArray(payload?.data)) return payload.data

    if (payload?.[key]) queue.push(payload[key])
    if (payload?.data) queue.push(payload.data)
  }

  return []
}

const normalizeCourse = (course) => ({
  id: course.id || course.course_id,
  title: course.title || course.name || 'Untitled Course'
})

const normalizeLesson = (lesson) => ({
  id: lesson.id || lesson.lesson_id,
  title: lesson.title || lesson.name || 'Untitled Lesson'
})

const loadCourses = async () => {
  loadingCourses.value = true
  error.value = ''

  try {
    const response = await teacherCourseService.getCourses()
    courses.value = listFrom(response, 'courses').map(normalizeCourse).filter((course) => course.id)

    if (!selectedCourseId.value && courses.value.length) {
      selectedCourseId.value = String(courses.value[0].id)
    }
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load teacher courses.'
    courses.value = []
  } finally {
    loadingCourses.value = false
  }
}

const loadLessons = async () => {
  if (!selectedCourseId.value) {
    lessons.value = []
    selectedLessonId.value = ''
    return
  }

  loadingLessons.value = true
  error.value = ''
  lessons.value = []
  selectedLessonId.value = ''
  quizzes.value = []

  try {
    const response = await teacherLessonService.getLessons(selectedCourseId.value)
    lessons.value = listFrom(response, 'lessons').map(normalizeLesson).filter((lesson) => lesson.id)

    if (lessons.value.length) {
      selectedLessonId.value = String(lessons.value[0].id)
    }
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load lessons.'
    lessons.value = []
  } finally {
    loadingLessons.value = false
  }
}

const loadQuizzes = async () => {
  if (!selectedLessonId.value) {
    quizzes.value = []
    return
  }

  loadingQuizzes.value = true
  error.value = ''

  try {
    const response = await teacherQuizService.getQuizzes(selectedLessonId.value)
    quizzes.value = listFrom(response, 'quizzes')
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load quizzes.'
    quizzes.value = []
  } finally {
    loadingQuizzes.value = false
  }
}

watch(selectedCourseId, loadLessons)
watch(selectedLessonId, loadQuizzes)

onMounted(loadCourses)
</script>
