<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <button type="button" class="text-sm font-medium text-brand-700" @click="router.back()">
          Back to Quizzes
        </button>
        <h1 class="mt-2 text-2xl font-semibold text-slate-950">Question Management</h1>
        <p class="mt-1 text-sm text-slate-500">Create, update, and manage questions for this quiz.</p>
      </div>

      <button
        type="button"
        class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="questions.saving"
        @click="openCreateForm"
      >
        Create Question
      </button>
    </div>

    <div v-if="questions.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ questions.error.message }}
    </div>

    <form
      v-if="formOpen"
      class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      @submit.prevent="saveQuestion"
    >
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="block lg:col-span-2">
          <span class="text-sm font-medium text-slate-700">Question</span>
          <textarea
            v-model.trim="form.question"
            class="focus-ring mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
          ></textarea>
          <p v-if="fieldError('question')" class="mt-1 text-sm text-rose-600">{{ fieldError('question') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Option 1</span>
          <input v-model.trim="form.option_1" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" />
          <p v-if="fieldError('option_1')" class="mt-1 text-sm text-rose-600">{{ fieldError('option_1') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Option 2</span>
          <input v-model.trim="form.option_2" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" />
          <p v-if="fieldError('option_2')" class="mt-1 text-sm text-rose-600">{{ fieldError('option_2') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Option 3</span>
          <input v-model.trim="form.option_3" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" />
          <p v-if="fieldError('option_3')" class="mt-1 text-sm text-rose-600">{{ fieldError('option_3') }}</p>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-slate-700">Option 4</span>
          <input v-model.trim="form.option_4" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" />
          <p v-if="fieldError('option_4')" class="mt-1 text-sm text-rose-600">{{ fieldError('option_4') }}</p>
        </label>

        <label class="block lg:col-span-2">
          <span class="text-sm font-medium text-slate-700">Correct Answer</span>
          <select v-model="form.correct_answer" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="">Select correct answer</option>
            <option v-for="option in availableOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p v-if="fieldError('correct_answer')" class="mt-1 text-sm text-rose-600">{{ fieldError('correct_answer') }}</p>
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
          :disabled="questions.saving"
        >
          {{ questions.saving ? 'Saving...' : editingId ? 'Update Question' : 'Create Question' }}
        </button>
      </div>
    </form>

    <div v-if="questions.loading" class="space-y-3">
      <article v-for="item in 5" :key="item" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
        <div class="mt-3 h-4 w-full animate-pulse rounded bg-slate-100"></div>
      </article>
    </div>

    <div v-else-if="questions.hasQuestions" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Correct Answer</th>
              <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="question in questions.questions" :key="question.id" class="hover:bg-slate-50">
              <td class="px-5 py-4">
                <p class="text-sm font-semibold text-slate-950">{{ question.question }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span v-for="option in questionOptions(question)" :key="option" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {{ option }}
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700">{{ correctAnswerLabel(question) }}</td>
              <td class="whitespace-nowrap px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    @click="openEditForm(question)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="focus-ring rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="questions.deletingId === question.id"
                    @click="deleteQuestion(question.id)"
                  >
                    {{ questions.deletingId === question.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No questions found for this quiz.
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTeacherPanelQuestionStore } from '@/stores/teacher/panelQuestionStore'

const route = useRoute()
const router = useRouter()
const questions = useTeacherPanelQuestionStore()
const formOpen = ref(false)
const editingId = ref(null)

const form = reactive({
  question: '',
  option_1: '',
  option_2: '',
  option_3: '',
  option_4: '',
  correct_answer: ''
})

const answerKeyMap = {
  option_a: 'option_1',
  option_b: 'option_2',
  option_c: 'option_3',
  option_d: 'option_4'
}

const availableOptions = computed(() =>
  [
    { value: 'option_1', label: form.option_1 },
    { value: 'option_2', label: form.option_2 },
    { value: 'option_3', label: form.option_3 },
    { value: 'option_4', label: form.option_4 }
  ].filter((option) => option.label)
)

const fieldError = (field) => {
  const fieldMap = {
    option_1: 'option_a',
    option_2: 'option_b',
    option_3: 'option_c',
    option_4: 'option_d'
  }
  const value = questions.error?.validation?.[field] || questions.error?.validation?.[fieldMap[field]]
  return Array.isArray(value) ? value[0] : value
}

const resetForm = () => {
  form.question = ''
  form.option_1 = ''
  form.option_2 = ''
  form.option_3 = ''
  form.option_4 = ''
  form.correct_answer = ''
  editingId.value = null
}

const openCreateForm = () => {
  resetForm()
  formOpen.value = true
}

const openEditForm = (question) => {
  editingId.value = question.id
  form.question = question.question
  form.option_1 = question.option1
  form.option_2 = question.option2
  form.option_3 = question.option3
  form.option_4 = question.option4
  form.correct_answer = answerKeyMap[question.correctAnswer] || question.correctAnswer
  formOpen.value = true
}

const closeForm = () => {
  formOpen.value = false
  resetForm()
}

const saveQuestion = async () => {
  try {
    if (editingId.value) {
      await questions.updateQuestion(editingId.value, { ...form })
    } else {
      await questions.createQuestion(route.params.id, { ...form })
    }

    closeForm()
  } catch {
    // Store owns the rendered error state.
  }
}

const deleteQuestion = async (questionId) => {
  try {
    await questions.deleteQuestion(questionId)
  } catch {
    // Store owns the rendered error state.
  }
}

const loadQuestions = async () => {
  try {
    await questions.fetchQuestions(route.params.id)
  } catch {
    // Store owns the rendered error state.
  }
}

const questionOptions = (question) =>
  [question.option1, question.option2, question.option3, question.option4].filter(Boolean)

const correctAnswerLabel = (question) => {
  const optionValues = {
    option_a: question.option1,
    option_b: question.option2,
    option_c: question.option3,
    option_d: question.option4,
    option_1: question.option1,
    option_2: question.option2,
    option_3: question.option3,
    option_4: question.option4
  }

  return optionValues[question.correctAnswer] || question.correctAnswer
}

onMounted(loadQuestions)
</script>
