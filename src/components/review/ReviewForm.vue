<template>
  <form class="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="submit">
    <div>
      <span class="text-sm font-medium text-slate-700">Rating</span>
      <StarRatingInput v-model="form.rating" class="mt-2" />
      <p v-if="validation.rating" class="mt-1 text-sm text-rose-600">{{ validation.rating }}</p>
    </div>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Review title</span>
      <input v-model.trim="form.title" class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" />
    </label>
    <label class="block">
      <span class="text-sm font-medium text-slate-700">Review comment</span>
      <textarea v-model.trim="form.comment" class="focus-ring mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
      <p v-if="validation.comment" class="mt-1 text-sm text-rose-600">{{ validation.comment }}</p>
    </label>
    <button class="focus-ring w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="loading">
      {{ loading ? 'Saving...' : submitLabel }}
    </button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import StarRatingInput from '@/components/review/StarRatingInput.vue'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitLabel: {
    type: String,
    default: 'Submit review'
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  rating: 0,
  title: '',
  comment: ''
})

const validation = reactive({
  rating: '',
  comment: ''
})

watch(
  () => props.initialValue,
  (value) => Object.assign(form, { rating: value.rating || 0, title: value.title || '', comment: value.comment || '' }),
  { immediate: true, deep: true }
)

const validate = () => {
  validation.rating = form.rating ? '' : 'Rating is required.'
  validation.comment = form.comment ? '' : 'Review comment is required.'
  return Object.values(validation).every((message) => !message)
}

const submit = () => {
  if (!validate()) return
  emit('submit', { ...form })
}
</script>
