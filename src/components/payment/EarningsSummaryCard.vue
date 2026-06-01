<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-brand-700">{{ item.month }}</p>
        <h3 class="mt-1 text-base font-semibold text-slate-950">{{ item.course }}</h3>
      </div>
      <PaymentStatusBadge :status="item.status" />
    </div>
    <div class="mt-5 grid grid-cols-3 gap-3 text-sm">
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Gross</p>
        <p class="mt-1 font-semibold text-slate-950">${{ item.gross.toLocaleString() }}</p>
      </div>
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Payout</p>
        <p class="mt-1 font-semibold text-slate-950">${{ item.payout.toLocaleString() }}</p>
      </div>
      <div class="rounded-lg bg-slate-50 p-3">
        <p class="text-xs text-slate-500">Students</p>
        <p class="mt-1 font-semibold text-slate-950">{{ item.students }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge.vue'

defineProps({ item: { type: Object, required: true } })
</script>
