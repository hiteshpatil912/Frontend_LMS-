<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-sm font-medium text-brand-700">Checkout</p>
    <h3 class="mt-2 text-lg font-semibold text-slate-950">{{ course.title }}</h3>
    <p class="mt-2 text-sm text-slate-500">{{ course.instructor }} · {{ course.duration }}</p>
    <div class="mt-5 rounded-lg bg-slate-50 p-4">
      <div class="flex justify-between text-sm"><span>Course price</span><span>${{ course.price }}</span></div>
      <div class="mt-2 flex justify-between text-sm"><span>Taxes</span><span>$0</span></div>
      <div class="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950"><span>Total</span><span>${{ course.price }}</span></div>
    </div>
    <button class="focus-ring mt-5 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="button" :disabled="loading" @click="$emit('purchase', course)">
      {{ loading ? 'Processing...' : 'Pay and enroll' }}
    </button>
    <p class="mt-3 text-xs text-slate-500">Invoice preview will be generated after successful payment.</p>
  </article>
</template>

<script setup>
defineProps({ course: { type: Object, required: true }, loading: { type: Boolean, default: false } })
defineEmits(['purchase'])
</script>
