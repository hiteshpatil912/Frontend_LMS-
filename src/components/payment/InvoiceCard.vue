<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-brand-700">{{ invoice.invoiceNo }}</p>
        <h3 class="mt-1 text-base font-semibold text-slate-950">{{ invoice.title }}</h3>
        <p class="mt-2 text-sm text-slate-500">Issued {{ invoice.issuedAt }}</p>
      </div>
      <PaymentStatusBadge :status="invoice.status" />
    </div>
    <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
      <span class="text-sm text-slate-500">Amount</span>
      <span class="text-lg font-semibold text-slate-950">${{ invoice.amount }}</span>
    </div>
  </article>
</template>

<script setup>
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge.vue'

defineProps({ invoice: { type: Object, required: true } })
</script>
