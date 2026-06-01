<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">{{ certificate.courseName }}</p>
        <h3 class="mt-1 text-lg font-semibold text-slate-950">
          {{ certificate.certificateNumber }}
        </h3>
        <p class="mt-2 text-sm text-slate-500">
          Issued {{ formattedDate }}
        </p>
      </div>

      <span
        class="inline-flex w-max rounded-full px-3 py-1 text-xs font-semibold capitalize"
        :class="statusClass"
      >
        {{ certificate.status }}
      </span>
    </div>

    <dl class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt class="text-xs font-medium text-slate-500">Certificate ID</dt>
        <dd class="mt-1 font-semibold text-slate-900">{{ certificate.id }}</dd>
      </div>
      <div>
        <dt class="text-xs font-medium text-slate-500">Verification</dt>
        <dd class="mt-1 font-semibold text-slate-900">{{ certificate.verificationCode || 'Pending' }}</dd>
      </div>
    </dl>

    <RouterLink
      class="mt-5 inline-flex w-full justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      :to="`/student/certificates/${certificate.id}`"
    >
      View Certificate
    </RouterLink>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  certificate: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => {
  if (!props.certificate.issueDate) return 'Not issued'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(props.certificate.issueDate))
})

const statusClass = computed(() => {
  const status = String(props.certificate.status || '').toLowerCase()

  if (status === 'issued' || status === 'active' || status === 'verified') {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (status === 'revoked' || status === 'failed') {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-slate-100 text-slate-700'
})
</script>
