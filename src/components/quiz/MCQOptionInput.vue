<template>
  <label class="block">
    <span class="text-sm font-medium text-slate-700">Option {{ optionKey }}</span>
    <input class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" :value="modelValue" type="text" @input="$emit('update:modelValue', $event.target.value)" />
  </label>
</template>

<script setup>
defineEmits(['update:modelValue'])
defineProps({
  optionKey: { type: String, required: true },
  modelValue: { type: String, default: '' }
})
</script>
