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

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="space-y-3 p-5">
        <div v-for="item in 5" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <DataTable v-else-if="earnings.length" :columns="columns" :rows="earnings">
      <template #amount="{ row }">
        <span class="font-semibold text-slate-950">${{ row.amount }}</span>
      </template>
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <div v-else-if="!error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No earnings found.
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { BanknotesIcon, ChartBarIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { teacherEarningsService } from '@/services/teacherEarningsService'

const earnings = ref([])
const totals = ref({
  totalRevenue: 0,
  totalSales: 0
})
const loading = ref(false)
const error = ref('')

const columns = [
  { key: 'course', label: 'Course' },
  { key: 'students', label: 'Students' },
  { key: 'amount', label: 'Revenue' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' }
]

const totalRevenue = computed(() => totals.value.totalRevenue)
const paidRevenue = computed(() => earnings.value.filter((item) => item.status === 'Paid').reduce((total, item) => total + item.amount, 0))
const pendingRevenue = computed(() => earnings.value.filter((item) => item.status === 'Pending').reduce((total, item) => total + item.amount, 0))

const metrics = computed(() => [
  { label: 'Total Revenue', value: `$${totalRevenue.value}`, trend: 'Synced from Laravel LMS', icon: BanknotesIcon },
  { label: 'Paid Out', value: `$${paidRevenue.value}`, trend: 'Completed payouts', icon: CheckBadgeIcon },
  { label: 'Pending', value: `$${pendingRevenue.value}`, trend: 'Awaiting payout', icon: ClockIcon, tone: 'negative' },
  { label: 'Transactions', value: totals.value.totalSales || earnings.value.length, trend: 'Course revenue rows', icon: ChartBarIcon }
])

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const normalizeTransaction = (transaction, index) => ({
  id: `${transaction.course_id || 'course'}-${transaction.created_at || index}`,
  course: transaction.course_title || `Course #${transaction.course_id}`,
  students: transaction.student_name || 'Student',
  amount: Number(transaction.amount || 0),
  status: transaction.status || 'Paid',
  date: formatDate(transaction.created_at)
})

const loadEarnings = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await teacherEarningsService.getEarnings()
    const payload = unwrap(response)
    const recentTransactions = Array.isArray(payload.recent_transactions) ? payload.recent_transactions : []

    totals.value = {
      totalRevenue: Number(payload.total_revenue || 0),
      totalSales: Number(payload.total_sales || 0)
    }
    earnings.value = recentTransactions.map(normalizeTransaction)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load earnings.'
    totals.value = { totalRevenue: 0, totalSales: 0 }
    earnings.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadEarnings)
</script>
