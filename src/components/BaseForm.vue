<template>
  <form class="space-y-4" @submit.prevent="$emit('submit')">
    <slot />
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Save
      </button>
    </div>
  </form>
</template>

<script setup>
defineEmits(['submit', 'cancel'])
</script>
