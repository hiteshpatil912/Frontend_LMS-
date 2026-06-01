<template>
  <label class="block">
    <span class="text-sm font-medium text-slate-700">{{ label }}</span>
    <div class="relative mt-1">
      <input
        :value="modelValue"
        class="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 pr-11"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button class="focus-ring absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100" type="button" @click="visible = !visible">
        <EyeSlashIcon v-if="visible" class="size-5" />
        <EyeIcon v-else class="size-5" />
      </button>
    </div>
    <p v-if="error" class="mt-1 text-sm text-rose-600">{{ error }}</p>
  </label>
</template>

<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

defineEmits(['update:modelValue'])
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Password'
  },
  autocomplete: {
    type: String,
    default: 'current-password'
  },
  error: {
    type: String,
    default: ''
  }
})

const visible = ref(false)
</script>
