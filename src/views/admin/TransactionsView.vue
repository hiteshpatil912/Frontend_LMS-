<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Transaction monitoring</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Transactions</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Review gateways, fees, net revenue, failed payments, and analytics summaries.</p>
    </div>
    <div class="grid gap-4 md:grid-cols-3">
      <RevenueStatsCard label="Gross revenue" :value="store.grossRevenue" />
      <RevenueStatsCard label="Net revenue" :value="store.netRevenue" />
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Failed transactions</p><p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.failedTransactions.length }}</p></div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="text-base font-semibold text-slate-950">Revenue analytics</h3>
      <div class="mt-5 flex h-40 items-end gap-3">
        <div v-for="transaction in store.transactions" :key="transaction.id" class="flex flex-1 flex-col items-center gap-2">
          <div class="w-full rounded-t bg-brand-600" :style="{ height: `${Math.max(18, transaction.amount / 3)}px` }"></div>
          <span class="text-xs text-slate-500">${{ transaction.amount }}</span>
        </div>
      </div>
    </div>
    <PaymentHistoryTable :payments="store.transactions" :loading="store.loading" show-gateway />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import PaymentHistoryTable from '@/components/payment/PaymentHistoryTable.vue'
import RevenueStatsCard from '@/components/payment/RevenueStatsCard.vue'
import { useAdminTransactionStore } from '@/stores/admin/transactionStore'

const store = useAdminTransactionStore()
onMounted(() => store.fetchTransactions())
</script>
