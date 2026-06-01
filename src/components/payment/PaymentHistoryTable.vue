<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div v-if="loading" class="space-y-3 p-5"><div v-for="item in 5" :key="item" class="h-14 animate-pulse rounded-lg bg-slate-100"></div></div>
    <EmptyPaymentState v-else-if="!payments.length" />
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3">Item</th>
            <th class="px-5 py-3">Type</th>
            <th class="px-5 py-3">Amount</th>
            <th class="px-5 py-3">Date</th>
            <th class="px-5 py-3">Status</th>
            <th v-if="showGateway" class="px-5 py-3">Gateway</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="payment in payments" :key="payment.id">
            <td class="px-5 py-4 font-medium text-slate-950">{{ payment.course || payment.customer }}</td>
            <td class="px-5 py-4 text-slate-600">{{ payment.type }}</td>
            <td class="px-5 py-4 text-slate-600">${{ payment.amount }}</td>
            <td class="px-5 py-4 text-slate-600">{{ payment.date }}</td>
            <td class="px-5 py-4"><PaymentStatusBadge :status="payment.status" /></td>
            <td v-if="showGateway" class="px-5 py-4 text-slate-600">{{ payment.gateway }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import EmptyPaymentState from '@/components/payment/EmptyPaymentState.vue'
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge.vue'

defineProps({ payments: { type: Array, default: () => [] }, loading: { type: Boolean, default: false }, showGateway: { type: Boolean, default: false } })
</script>
