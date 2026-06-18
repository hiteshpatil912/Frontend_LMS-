<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-950">Quizzes</h1>
        <p class="text-sm text-slate-500">Manage assessments and student performance.</p>
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
      <p class="text-slate-500">No quizzes found.</p>
    </div>

    <div v-else class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th class="px-6 py-4">Quiz Title</th>
              <th class="px-6 py-4">Course</th>
              <th class="px-6 py-4">Attempts</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in store.items" :key="item.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.title }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.course_title || item.course?.title || 'N/A' }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.attempts_count || item.attempts || 0 }}</td>
              <td class="px-6 py-4 text-right">
                <button class="text-brand-600 hover:text-brand-700 font-medium">View Results</button>
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
const load = () => store.fetchData('quizzes')

onMounted(load)
</script>