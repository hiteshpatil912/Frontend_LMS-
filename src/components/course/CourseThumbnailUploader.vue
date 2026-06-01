<template>
  <div>
    <span class="text-sm font-medium text-slate-700">Thumbnail upload</span>
    <div class="mt-2 grid gap-3 sm:grid-cols-[160px_1fr] sm:items-center">
      <div class="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-sky-500 via-indigo-500 to-cyan-400">
        <img v-if="modelValue" class="h-full w-full object-cover" :src="modelValue" alt="Course thumbnail preview" />
        <PhotoIcon v-else class="size-9 text-white/80" />
      </div>
      <label class="block">
        <input class="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700" type="file" accept="image/*" @change="handleFile" />
        <span class="mt-2 block text-xs text-slate-500">Preview updates immediately. API upload can replace the generated preview URL later.</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { PhotoIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleFile = (event) => {
  const file = event.target.files?.[0]
  emit('update:modelValue', file ? URL.createObjectURL(file) : '')
}
</script>
