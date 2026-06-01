<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <button type="button" class="text-sm font-medium text-brand-700" @click="router.back()">
          Back to Lessons
        </button>
        <h1 class="mt-2 text-2xl font-semibold text-slate-950">Quiz Management</h1>
        <p class="mt-1 text-sm text-slate-500">Create, update, and manage quizzes for this lesson.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="quizzes.saving"
        @click="openCreateForm"
      >
        Create Quiz
      </button>
    </div>

    <div v-if="quizzes.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ quizzes.error.message }}
    </div>

    <form
      v-if="formOpen"
      class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      @submit.prevent="saveQuiz"
    >
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Title</span>
          <input
            v-model.trim="form.title"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="text"
          />
          <p v-if="fieldError('title')" class="mt-1 text-sm text-rose-600">{{ fieldError('title') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Total Marks</span>
          <input
            v-model.number="form.total_marks"
            class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            min="1"
            type="number"
          />
          <p v-if="fieldError('total_marks')" class="mt-1 text-sm text-rose-600">{{ fieldError('total_marks') }}</p>
        </label>

        <label class="block lg:col-span-2">
          <span class="text-sm font-medium text-slate-700">Description</span>
          <textarea
            v-model.trim="form.description"
            class="focus-ring mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
          ></textarea>
          <p v-if="fieldError('description')" class="mt-1 text-sm text-rose-600">{{ fieldError('description') }}</p>
        </label>
      </div>

      <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="closeForm"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="quizzes.saving"
        >
          {{ quizzes.saving ? 'Saving...' : editingId ? 'Update Quiz' : 'Create Quiz' }}
        </button>
      </div>
    </form>

    <div v-if="quizzes.loading" class="space-y-3">
      <article v-for="item in 5" :key="item" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
      </article>
    </div>

    <div v-else-if="quizzes.hasQuizzes" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Total Marks</th>
              <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="quiz in quizzes.quizzes" :key="quiz.id" class="hover:bg-slate-50">
              <td class="px-5 py-4">
                <p class="text-sm font-semibold text-slate-950">{{ quiz.title }}</p>
                <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ quiz.description }}</p>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">{{ quiz.totalMarks }}</td>
              <td class="whitespace-nowrap px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/teacher/quizzes/${quiz.id}/questions`"
                    class="focus-ring rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Manage Questions
                  </RouterLink>
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    @click="openEditForm(quiz)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="quizzes.deletingId === quiz.id"
                    @click="deleteQuiz(quiz.id)"
                  >
                    {{ quizzes.deletingId === quiz.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No quizzes found for this lesson.
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeacherPanelQuizStore } from '@/stores/teacher/panelQuizStore'

const route = useRoute()
const router = useRouter()
const quizzes = useTeacherPanelQuizStore()
const formOpen = ref(false)
const editingId = ref(null)

const form = reactive({
  title: '',
  description: '',
  total_marks: 1
})

const fieldError = (field) => {
  const value = quizzes.error?.validation?.[field]
  return Array.isArray(value) ? value[0] : value
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.total_marks = 1
  editingId.value = null
}

const openCreateForm = () => {
  resetForm()
  formOpen.value = true
}

const openEditForm = (quiz) => {
  editingId.value = quiz.id
  form.title = quiz.title
  form.description = quiz.description
  form.total_marks = quiz.totalMarks || 1
  formOpen.value = true
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const saveQuiz = async () => {
  try {
    if (editingId.value) {
      await quizzes.updateQuiz(editingId.value, { ...form })
    } else {
      await quizzes.createQuiz(route.params.id, { ...form })
    }

    closeForm()
  } catch {
    // Store owns the rendered error state.
  }
}

const deleteQuiz = async (quizId) => {
  try {
    await quizzes.deleteQuiz(quizId)
  } catch {
    // Store owns the rendered error state.
  }
}

const loadQuizzes = async () => {
  try {
    await quizzes.fetchQuizzes(route.params.id)
  } catch {
    // Store owns the rendered error state.
  }
}

onMounted(loadQuizzes)
</script>
