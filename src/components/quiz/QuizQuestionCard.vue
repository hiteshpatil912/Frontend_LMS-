<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h2 class="text-base font-semibold text-slate-950">
      <span class="text-slate-400">Q{{ index + 1 }}.</span>
      {{ question.question }}
    </h2>

    <div class="mt-5 space-y-3">
      <label
        v-for="option in question.options"
        :key="option"
        class="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        :class="{ 'border-brand-600 bg-brand-50 text-brand-700': modelValue === option }"
      >
        <input
          type="radio"
          class="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-500"
          :name="`question-${question.id}`"
          :value="option"
          :checked="modelValue === option"
          @change="$emit('update:modelValue', option)"
        />
        <span>{{ option }}</span>
      </label>
    </div>
  </article>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
