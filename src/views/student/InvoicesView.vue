<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Billing records</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Invoices</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Review invoice previews and payment status for purchases and subscriptions.</p>
    </div>
    <div v-if="store.loading" class="grid gap-4 xl:grid-cols-2"><div v-for="item in 4" :key="item" class="h-44 animate-pulse rounded-lg bg-slate-200"></div></div>
    <EmptyPaymentState v-else-if="!store.invoices.length" title="No invoices" />
    <div v-else class="grid gap-4 xl:grid-cols-2">
      <InvoiceCard v-for="invoice in store.invoices" :key="invoice.id" :invoice="invoice" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import EmptyPaymentState from '@/components/payment/EmptyPaymentState.vue'
import InvoiceCard from '@/components/payment/InvoiceCard.vue'
import { useStudentPaymentStore } from '@/stores/student/paymentStore'

const store = useStudentPaymentStore()
onMounted(() => store.fetchInvoices())
</script>
