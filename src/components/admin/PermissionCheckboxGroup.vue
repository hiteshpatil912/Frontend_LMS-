<template>
  <fieldset>
    <legend class="text-sm font-medium text-slate-700">Permissions</legend>
    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <label
        v-for="permission in permissions"
        :key="permission"
        class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
      >
        <input
          class="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          type="checkbox"
          :checked="modelValue.includes(permission)"
          @change="toggle(permission)"
        />
        <span>
          <span class="block text-sm font-medium text-slate-800">{{ formatPermission(permission) }}</span>
          <span class="block text-xs text-slate-500">{{ permission }}</span>
        </span>
      </label>
    </div>
    <p v-if="error" class="mt-2 text-sm text-rose-600">{{ error }}</p>
  </fieldset>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  permissions: {
    type: Array,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = (permission) => {
  const selected = props.modelValue.includes(permission)
    ? props.modelValue.filter((item) => item !== permission)
    : [...props.modelValue, permission]

  emit('update:modelValue', selected)
}

const formatPermission = (permission) =>
  permission
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
</script>
