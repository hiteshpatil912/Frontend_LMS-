<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Subscription plans</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Subscriptions</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Manage monthly and yearly LMS access plans.</p>
    </div>
    <div v-if="store.activeSubscription" class="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
      Active subscription: {{ store.activeSubscription.plan }} renews {{ store.activeSubscription.renewsAt }}.
    </div>
    <div class="grid gap-4 xl:grid-cols-2">
      <SubscriptionPlanCard v-for="plan in store.plans" :key="plan.id" :plan="plan" :active="store.activeSubscription?.type === plan.type" :loading="store.subscribing" @subscribe="store.subscribe" />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import SubscriptionPlanCard from '@/components/payment/SubscriptionPlanCard.vue'
import { useStudentSubscriptionStore } from '@/stores/student/subscriptionStore'

const store = useStudentSubscriptionStore()
onMounted(() => store.fetchSubscriptions())
</script>
