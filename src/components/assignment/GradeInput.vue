<template>
  <label class="block">
    <span class="text-sm font-medium text-slate-700">Grade</span>
    <div class="mt-1 flex items-center gap-2">
      <input :value="modelValue" class="focus-ring w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" min="0" :max="total" @input="$emit('update:modelValue', Number($event.target.value))" />
      <span class="text-sm text-slate-500">/ {{ total }}</span>
    </div>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 0 },
  total: { type: Number, default: 100 }
})
defineEmits(['update:modelValue'])
</script>
