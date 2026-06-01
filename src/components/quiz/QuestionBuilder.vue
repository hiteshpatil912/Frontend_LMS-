<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-base font-semibold text-slate-950">Questions</h3>
      <span class="text-sm text-slate-500">{{ modelValue.length }} added</span>
    </div>

    <div class="mt-5 grid gap-4 lg:grid-cols-2">
      <label class="block lg:col-span-2">
        <span class="text-sm font-medium text-slate-700">Question title</span>
        <input v-model.trim="draft.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
      </label>
      <MCQOptionInput v-model="draft.options.A" option-key="A" />
      <MCQOptionInput v-model="draft.options.B" option-key="B" />
      <MCQOptionInput v-model="draft.options.C" option-key="C" />
      <MCQOptionInput v-model="draft.options.D" option-key="D" />
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Correct answer</span>
        <select v-model="draft.correctAnswer" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
        </select>
      </label>
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Marks</span>
        <input v-model.number="draft.marks" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="1" />
      </label>
    </div>
    <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>
    <button class="focus-ring mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" @click="addQuestion">Add question</button>

    <div class="mt-5 space-y-3">
      <div v-for="(question, index) in modelValue" :key="question.id || index" class="rounded-lg bg-slate-50 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-950">{{ index + 1 }}. {{ question.title }}</p>
            <p class="mt-1 text-xs text-slate-500">Correct: {{ question.correctAnswer }} / {{ question.marks }} marks</p>
          </div>
          <button class="text-sm font-medium text-rose-600 hover:text-rose-700" type="button" @click="removeQuestion(index)">Remove</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import MCQOptionInput from '@/components/quiz/MCQOptionInput.vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])
const error = ref('')
const freshDraft = () => ({ title: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A', marks: 10 })
const draft = reactive(freshDraft())

const addQuestion = () => {
  error.value = ''
  if (!draft.title || Object.values(draft.options).some((option) => !option) || !draft.marks) {
    error.value = 'Question title, all options, correct answer, and marks are required.'
    return
  }
  emit('update:modelValue', [...props.modelValue, { ...draft, options: { ...draft.options }, id: Date.now() }])
  Object.assign(draft, freshDraft())
}

const removeQuestion = (index) => {
  emit('update:modelValue', props.modelValue.filter((_, currentIndex) => currentIndex !== index))
}
</script>
