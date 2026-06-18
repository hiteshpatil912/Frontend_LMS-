<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-950">Reviews</h1>
        <p class="text-sm text-slate-500">Monitor course feedback and ratings.</p>
      </div>
      <button @click="load" class="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        <span>Refresh</span>
      </button>
    </div>

    <div v-if="store.loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-lg bg-slate-100"></div>
    </div>

    <div v-else-if="store.error" class="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {{ store.error }}
    </div>

    <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-20 text-center">
      <p class="text-slate-500">No reviews found.</p>
    </div>

    <div v-else class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th class="px-6 py-4">Course</th>
              <th class="px-6 py-4">Student</th>
              <th class="px-6 py-4 text-center">Rating</th>
              <th class="px-6 py-4">Comment</th>
              <th class="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in store.items" :key="item.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.course?.title || item.course_title }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.user?.name || item.student_name }}</td>
              <td class="px-6 py-4 text-center">
                <span class="font-bold text-amber-500">{{ item.rating }}★</span>
              </td>
              <td class="max-w-xs truncate px-6 py-4 text-slate-500">{{ item.comment }}</td>
              <td class="px-6 py-4 text-right">
                <span class="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 capitalize">
                  {{ item.status || 'published' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminManagementStore } from '@/stores/admin/adminManagementStore'

const store = useAdminManagementStore()
const load = () => store.fetchData('reviews')

onMounted(load)
</script>