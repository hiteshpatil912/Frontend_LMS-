<template>
  <section class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 p-5">
      <h3 class="text-base font-semibold text-slate-950">Top courses</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-100">
        <tbody class="divide-y divide-slate-100">
          <tr v-for="course in rows" :key="course.id">
            <td class="px-5 py-4">
              <p class="text-sm font-semibold text-slate-950">{{ course.title }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ course.enrollments }} enrollments</p>
            </td>
            <td class="px-5 py-4 text-sm font-medium text-slate-700">{{ course.revenue }}</td>
            <td class="px-5 py-4 text-sm text-slate-500">{{ course.completion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({ rows: { type: Array, default: () => [] } })
</script>
