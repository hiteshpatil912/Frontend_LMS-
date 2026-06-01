<template>
  <label class="block">
    <span class="text-sm font-medium text-slate-700">Feedback</span>
    <textarea :value="modelValue" class="focus-ring mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" @input="$emit('update:modelValue', $event.target.value)"></textarea>
  </label>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: '' } })
defineEmits(['update:modelValue'])
</script>
