<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-base font-semibold text-slate-950">{{ plan.name }}</h3>
        <p class="mt-2 text-3xl font-semibold text-slate-950">${{ plan.price }} <span class="text-sm font-normal text-slate-500">{{ plan.billing }}</span></p>
      </div>
      <PaymentStatusBadge v-if="active" status="active" />
    </div>
    <ul class="mt-5 space-y-2 text-sm text-slate-600">
      <li v-for="feature in plan.features" :key="feature">- {{ feature }}</li>
    </ul>
    <button class="focus-ring mt-5 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="loading || active" @click="$emit('subscribe', plan)">
      {{ active ? 'Current plan' : loading ? 'Subscribing...' : 'Choose plan' }}
    </button>
  </article>
</template>

<script setup>
import PaymentStatusBadge from '@/components/payment/PaymentStatusBadge.vue'

defineProps({ plan: { type: Object, required: true }, active: { type: Boolean, default: false }, loading: { type: Boolean, default: false } })
defineEmits(['subscribe'])
</script>
