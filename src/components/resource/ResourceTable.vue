<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="space-y-3 p-5">
      <div v-for="item in 5" :key="item" class="h-14 animate-pulse rounded-lg bg-slate-100"></div>
    </div>
    <EmptyResourceState v-else-if="!resources.length" />
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3 font-semibold">Resource</th>
            <th class="px-5 py-3 font-semibold">Course</th>
            <th class="px-5 py-3 font-semibold">Lesson</th>
            <th class="px-5 py-3 font-semibold">File</th>
            <th class="px-5 py-3 font-semibold">Visibility</th>
            <th class="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="resource in resources" :key="resource.id" class="align-top">
            <td class="px-5 py-4">
              <p class="font-semibold text-slate-950">{{ resource.title }}</p>
              <p class="mt-1 max-w-xs text-xs text-slate-500">{{ resource.description }}</p>
            </td>
            <td class="px-5 py-4 text-slate-600">{{ resource.course }}</td>
            <td class="px-5 py-4 text-slate-600">{{ resource.lesson }}</td>
            <td class="px-5 py-4 text-slate-600">{{ resource.fileType }} · {{ resource.fileSize }}</td>
            <td class="px-5 py-4">
              <span :class="resource.visibility === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
                {{ resource.visibility }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex justify-end gap-2">
                <DownloadButton :loading="downloading" @download="$emit('download', resource)" />
                <button v-if="manageable" class="focus-ring rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50" type="button" @click="$emit('delete', resource)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import DownloadButton from '@/components/resource/DownloadButton.vue'
import EmptyResourceState from '@/components/resource/EmptyResourceState.vue'

defineProps({
  resources: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
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
