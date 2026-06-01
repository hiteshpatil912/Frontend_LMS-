<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Quiz title</span>
        <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
        <p v-if="validation.title" class="mt-1 text-sm text-rose-600">{{ validation.title }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Course selection</span>
        <select v-model.number="form.courseId" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.title }}</option>
        </select>
      </label>
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Quiz description</span>
        <textarea v-model.trim="form.description" class="focus-ring mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
        <p v-if="validation.description" class="mt-1 text-sm text-rose-600">{{ validation.description }}</p>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Passing marks (%)</span>
        <input v-model.number="form.passingMarks" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="1" max="100" />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Duration (minutes)</span>
        <input v-model.number="form.duration" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="1" />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Status</span>
        <select v-model="form.status" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
    </div>

    <QuestionBuilder v-model="form.questions" />
    <p v-if="validation.questions" class="text-sm text-rose-600">{{ validation.questions }}</p>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="cancelTo">Cancel</RouterLink>
      <button class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="saving">
        <ArrowPathIcon v-if="saving" class="mr-2 size-4 animate-spin" />
        {{ saving ? 'Saving...' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import QuestionBuilder from '@/components/quiz/QuestionBuilder.vue'

const props = defineProps({
  initialValue: { type: Object, default: () => ({}) },
  courses: { type: Array, default: () => [] },
  saving: Boolean,
  cancelTo: { type: String, required: true },
  submitLabel: { type: String, default: 'Save quiz' }
})
const emit = defineEmits(['submit'])
const form = reactive({ title: '', description: '', courseId: null, courseName: '', passingMarks: 70, duration: 15, status: 'draft', questions: [] })
const validation = reactive({ title: '', description: '', questions: '' })

watch(() => props.initialValue, (value) => Object.assign(form, { ...value, questions: [...(value.questions || [])] }), { immediate: true, deep: true })
watch(() => props.courses, (courses) => { if (!form.courseId && courses[0]) form.courseId = courses[0].id }, { immediate: true })

const submit = () => {
  validation.title = form.title ? '' : 'Quiz title is required.'
  validation.description = form.description ? '' : 'Quiz description is required.'
  validation.questions = form.questions.length ? '' : 'Add at least one MCQ question.'
  if (validation.title || validation.description || validation.questions) return
  const course = props.courses.find((item) => Number(item.id) === Number(form.courseId))
  emit('submit', { ...form, courseName: course?.title || form.courseName })
}
</script>
