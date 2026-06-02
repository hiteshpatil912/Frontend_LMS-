<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Earnings</h1>
      <p class="mt-1 text-sm text-slate-500">Track course revenue and payout activity.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <DataTable v-if="earnings.length" :columns="columns" :rows="earnings">
      <template #amount="{ row }">
        <span class="font-semibold text-slate-950">${{ row.amount }}</span>
      </template>
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No earnings found.
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { BanknotesIcon, ChartBarIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'

const earnings = [
  { id: 1, course: 'Vue Foundations', students: 18, amount: 1440, status: 'Paid', date: '2026-05-25' },
  { id: 2, course: 'Laravel API LMS', students: 12, amount: 1188, status: 'Pending', date: '2026-05-29' },
  { id: 3, course: 'Pinia State Management', students: 9, amount: 711, status: 'Paid', date: '2026-06-01' }
]

const columns = [
  { key: 'course', label: 'Course' },
  { key: 'students', label: 'Students' },
  { key: 'amount', label: 'Revenue' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' }
]

const totalRevenue = computed(() => earnings.reduce((total, item) => total + item.amount, 0))
const paidRevenue = computed(() => earnings.filter((item) => item.status === 'Paid').reduce((total, item) => total + item.amount, 0))
const pendingRevenue = computed(() => earnings.filter((item) => item.status === 'Pending').reduce((total, item) => total + item.amount, 0))

const metrics = computed(() => [
  { label: 'Total Revenue', value: `$${totalRevenue.value}`, trend: 'Mock earnings data', icon: BanknotesIcon },
  { label: 'Paid Out', value: `$${paidRevenue.value}`, trend: 'Completed payouts', icon: CheckBadgeIcon },
  { label: 'Pending', value: `$${pendingRevenue.value}`, trend: 'Awaiting payout', icon: ClockIcon, tone: 'negative' },
  { label: 'Transactions', value: earnings.length, trend: 'Course revenue rows', icon: ChartBarIcon }
])
</script>
