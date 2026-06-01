<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Payouts</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Teacher Earnings</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Track monthly earnings, course revenue, payouts, and enrolled student revenue.</p>
    </div>
    <div class="grid gap-4 md:grid-cols-4">
      <RevenueStatsCard label="Total earnings" :value="store.totalEarnings" />
      <RevenueStatsCard label="This month" :value="store.monthlyEarnings" />
      <RevenueStatsCard label="Payouts" :value="store.totalPayouts" />
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Revenue students</p><p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.enrolledStudentsRevenue }}</p></div>
    </div>
    <div class="grid gap-4 xl:grid-cols-2">
      <EarningsSummaryCard v-for="item in store.earnings" :key="item.id" :item="item" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import EarningsSummaryCard from '@/components/payment/EarningsSummaryCard.vue'
import RevenueStatsCard from '@/components/payment/RevenueStatsCard.vue'
import { useTeacherEarningsStore } from '@/stores/teacher/earningsStore'

const store = useTeacherEarningsStore()
onMounted(() => store.fetchEarnings())
</script>
