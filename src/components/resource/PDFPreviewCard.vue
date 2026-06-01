<template>
  <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div class="flex items-center gap-3">
      <div class="flex size-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
        <DocumentTextIcon class="size-6" />
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-slate-950">{{ fileName || 'No file selected' }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ fileType || 'PDF, DOC, DOCX, ZIP' }}<span v-if="fileSize"> · {{ fileSize }}</span></p>
      </div>
    </div>
    <div v-if="progress > 0" class="mt-4">
      <div class="h-2 rounded-full bg-slate-200">
        <div class="h-2 rounded-full bg-brand-600 transition-all" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="mt-2 text-xs font-medium text-slate-500">{{ progress }}% uploaded</p>
    </div>
  </div>
</template>

<script setup>
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

defineProps({
  fileName: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    default: ''
  },
  fileSize: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  }
})
</script>
