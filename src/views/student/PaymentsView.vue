<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Checkout</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Payments</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Purchase courses, view payment history, and request refunds from your account.</p>
    </div>
    <div class="grid gap-6 xl:grid-cols-[360px_1fr]">
      <CheckoutCard :course="store.checkoutCourse" :loading="store.purchasing" @purchase="store.purchaseCourse" />
      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <RevenueStatsCard label="Total spent" :value="store.totalSpent" />
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p class="text-sm text-slate-500">Paid courses</p><p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.paidPayments.length }}</p></div>
        </div>
        <PaymentHistoryTable :payments="store.payments" :loading="store.loading" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import CheckoutCard from '@/components/payment/CheckoutCard.vue'
import PaymentHistoryTable from '@/components/payment/PaymentHistoryTable.vue'
import RevenueStatsCard from '@/components/payment/RevenueStatsCard.vue'
import { useStudentPaymentStore } from '@/stores/student/paymentStore'

const store = useStudentPaymentStore()
onMounted(() => store.fetchPayments())
</script>
