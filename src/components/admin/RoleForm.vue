<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <label class="block">
        <span class="text-sm font-medium text-slate-700">Role name</span>
        <input
          v-model.trim="form.name"
          class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          type="text"
          placeholder="Example: Course Manager"
        />
        <p v-if="validation.name" class="mt-2 text-sm text-rose-600">{{ validation.name }}</p>
      </label>
    </div>

    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <PermissionCheckboxGroup v-model="form.permissions" :permissions="permissions" :error="validation.permissions" />
    </div>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/admin/roles">
        Cancel
      </RouterLink>
      <button
        class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        :disabled="saving"
      >
        <ArrowPathIcon v-if="saving" class="mr-2 size-4 animate-spin" />
        {{ saving ? 'Saving...' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import PermissionCheckboxGroup from '@/components/admin/PermissionCheckboxGroup.vue'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({ name: '', permissions: [] })
  },
  permissions: {
    type: Array,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  },
  submitLabel: {
    type: String,
    default: 'Save role'
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  permissions: []
})

const validation = reactive({
  name: '',
  permissions: ''
})

watch(
  () => props.initialValue,
  (value) => {
    form.name = value?.name || ''
    form.permissions = [...(value?.permissions || [])]
  },
  { immediate: true, deep: true }
)

const validate = () => {
  validation.name = form.name ? '' : 'Role name is required.'
  validation.permissions = form.permissions.length ? '' : 'Select at least one permission.'
  return !validation.name && !validation.permissions
}

const submit = () => {
  if (!validate()) return
  emit('submit', {
    name: form.name,
    permissions: [...form.permissions]
  })
}
</script>
