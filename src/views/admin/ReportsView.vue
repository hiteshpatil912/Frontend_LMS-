<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Reports</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Reports Center</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Export analytics reports for revenue, enrollments, quiz performance, and instructors.</p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">From</span>
          <input v-model="store.dateRange.from" class="focus-ring mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-slate-700">To</span>
          <input v-model="store.dateRange.to" class="focus-ring mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" />
        </label>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <AnalyticsCard label="Reports" :value="store.totalReports" trend="Ready" />
      <AnalyticsCard label="Date range" :value="rangeDays" trend="Filtered" />
      <AnalyticsCard label="Exports" value="CSV / XLSX / PDF" trend="Base" />
    </div>

    <div v-if="store.loading" class="grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-28 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <div v-else class="grid gap-4 md:grid-cols-2">
      <ReportExportCard v-for="report in store.reports" :key="report.id" :report="report" :exporting="store.exporting" @export="store.exportReport" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AnalyticsCard from '@/components/admin/AnalyticsCard.vue'
import ReportExportCard from '@/components/admin/ReportExportCard.vue'
import { useAdminReportsStore } from '@/stores/admin/reportsStore'

const store = useAdminReportsStore()
const rangeDays = computed(() => {
  const from = new Date(store.dateRange.from)
  const to = new Date(store.dateRange.to)
  return `${Math.max(1, Math.round((to - from) / 86400000) + 1)} days`
})

onMounted(() => {
  store.fetchReports(store.dateRange)
})
</script>
