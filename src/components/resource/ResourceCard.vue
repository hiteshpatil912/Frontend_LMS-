<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div class="flex gap-3">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <DocumentTextIcon class="size-6" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-slate-950">{{ resource.title }}</h3>
          <p class="mt-1 line-clamp-2 text-sm text-slate-500">{{ resource.description }}</p>
        </div>
      </div>
      <span :class="resource.visibility === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
        {{ resource.visibility }}
      </span>
    </div>

    <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div>
        <dt class="text-xs font-medium text-slate-500">Course</dt>
        <dd class="mt-1 text-slate-800">{{ resource.course }}</dd>
      </div>
      <div>
        <dt class="text-xs font-medium text-slate-500">Lesson</dt>
        <dd class="mt-1 text-slate-800">{{ resource.lesson }}</dd>
      </div>
      <div>
        <dt class="text-xs font-medium text-slate-500">File</dt>
        <dd class="mt-1 text-slate-800">{{ resource.fileType }} · {{ resource.fileSize }}</dd>
      </div>
      <div>
        <dt class="text-xs font-medium text-slate-500">Uploaded</dt>
        <dd class="mt-1 text-slate-800">{{ resource.uploadedAt }}</dd>
      </div>
    </dl>

    <div class="mt-5 flex flex-col gap-2 sm:flex-row">
      <DownloadButton class="flex-1" :loading="downloading" @download="$emit('download', resource)" />
      <button v-if="manageable" class="focus-ring flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50" type="button" @click="$emit('delete', resource)">
        Delete
      </button>
    </div>
  </article>
</template>

<script setup>
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import DownloadButton from '@/components/resource/DownloadButton.vue'

defineProps({
  resource: {
    type: Object,
    required: true
  },
  manageable: {
    type: Boolean,
    default: false
  },
  downloading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['download', 'delete'])
</script>
