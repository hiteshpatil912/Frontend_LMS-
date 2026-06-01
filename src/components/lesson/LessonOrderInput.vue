<template>
  <label class="block">
    <span class="text-sm font-medium text-slate-700">Lesson order</span>
    <div class="mt-1 flex rounded-lg border border-slate-300 bg-white">
      <button class="focus-ring px-3 text-slate-500 hover:bg-slate-50" type="button" @click="update(Math.max(1, Number(modelValue) - 1))">-</button>
      <input class="w-full border-0 px-3 py-2 text-center text-sm focus:ring-0" :value="modelValue" type="number" min="1" @input="update($event.target.value)" />
      <button class="focus-ring px-3 text-slate-500 hover:bg-slate-50" type="button" @click="update(Number(modelValue) + 1)">+</button>
    </div>
    <p v-if="error" class="mt-1 text-sm text-rose-600">{{ error }}</p>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [Number, String],
    default: 1
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const update = (value) => emit('update:modelValue', Math.max(1, Number(value) || 1))
</script>
