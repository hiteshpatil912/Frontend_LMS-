<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="space-y-3 p-5">
      <div v-for="item in 5" :key="item" class="h-14 animate-pulse rounded-lg bg-slate-100"></div>
    </div>
    <EmptyContinueState v-else-if="!items.length" title="No watch history" message="Watched lessons and saved timestamps will appear here." />
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3 font-semibold">Course</th>
            <th class="px-5 py-3 font-semibold">Lesson</th>
            <th class="px-5 py-3 font-semibold">Watched</th>
            <th class="px-5 py-3 font-semibold">Progress</th>
            <th class="px-5 py-3 font-semibold">Last watched</th>
            <th class="px-5 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in items" :key="item.id">
            <td class="px-5 py-4 font-medium text-slate-950">{{ item.courseTitle }}</td>
            <td class="px-5 py-4 text-slate-600">{{ item.lessonTitle }}</td>
            <td class="px-5 py-4 text-slate-600">{{ item.watchedDuration }}</td>
            <td class="px-5 py-4">
              <ProgressResumeBar :value="item.progress" label="Lesson" />
            </td>
            <td class="px-5 py-4">
              <LastWatchedBadge :value="item.lastWatchedAt" />
            </td>
            <td class="px-5 py-4 text-right">
              <RouterLink class="focus-ring inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="`/student/admin/courses/${item.courseId}`">
                Resume
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import EmptyContinueState from '@/components/student/EmptyContinueState.vue'
import LastWatchedBadge from '@/components/student/LastWatchedBadge.vue'
import ProgressResumeBar from '@/components/student/ProgressResumeBar.vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
