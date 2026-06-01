<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div class="relative overflow-hidden rounded-lg border-4 border-double border-brand-200 bg-white p-8 text-center print:border-slate-900">
      <div class="absolute inset-x-0 top-0 h-2 bg-brand-600"></div>
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">Certificate of Completion</p>
      <h1 class="mt-8 text-3xl font-semibold text-slate-950 sm:text-5xl">{{ certificate.studentName }}</h1>
      <p class="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500">has successfully completed the course</p>
      <h2 class="mt-4 text-2xl font-semibold text-slate-950 sm:text-4xl">{{ certificate.courseTitle }}</h2>
      <div class="mx-auto mt-8 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
        <div class="rounded-lg bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Instructor</p>
          <p class="mt-1 text-sm font-semibold text-slate-900">{{ certificate.instructorName }}</p>
        </div>
        <div class="rounded-lg bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Completion date</p>
          <p class="mt-1 text-sm font-semibold text-slate-900">{{ certificate.completionDate }}</p>
        </div>
        <div class="rounded-lg bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Certificate ID</p>
          <p class="mt-1 text-sm font-semibold text-slate-900">{{ certificate.certificateId }}</p>
        </div>
        <div class="rounded-lg bg-slate-50 p-4">
          <p class="text-xs font-medium text-slate-500">Verification code</p>
          <p class="mt-1 text-sm font-semibold text-slate-900">{{ certificate.verificationCode }}</p>
        </div>
      </div>
      <div class="mt-8 flex items-center justify-center">
        <VerificationBadge :verified="certificate.verified" />
      </div>
    </div>
  </div>
</template>

<script setup>
import VerificationBadge from '@/components/certificate/VerificationBadge.vue'

defineProps({
  certificate: {
    type: Object,
    required: true
  }
})
</script>
