<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Payment operations</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Payments</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Monitor payment history, refund base state, and subscription revenue.</p>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <RevenueStatsCard label="Paid revenue" :value="store.revenue" />
      <RevenueStatsCard label="Refunded" :value="store.refundedTotal" />
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Pending payments</p><p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.pendingCount }}</p></div>
    </div>
    <PaymentHistoryTable :payments="store.payments" :loading="store.loading" />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import PaymentHistoryTable from '@/components/payment/PaymentHistoryTable.vue'
import RevenueStatsCard from '@/components/payment/RevenueStatsCard.vue'
import { useAdminPaymentStore } from '@/stores/admin/paymentStore'

const store = useAdminPaymentStore()
onMounted(() => store.fetchPayments())
</script>
