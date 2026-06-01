<template>
  <section class="mx-auto max-w-3xl space-y-6">
    <div>
      <RouterLink to="/student/certificates" class="text-sm font-medium text-brand-700">
        Back to Certificates
      </RouterLink>
      <h1 class="mt-3 text-2xl font-semibold text-slate-950">Certificate Details</h1>
    </div>

    <div v-if="certificates.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ certificates.error.message }}
    </div>

    <section v-if="certificates.loading" class="rounded-lg border border-slate-200 bg-white p-6">
      <div class="h-6 w-2/3 animate-pulse rounded bg-slate-200"></div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div v-for="item in 6" :key="item" class="h-16 animate-pulse rounded bg-slate-100"></div>
      </div>
    </section>

    <section v-else-if="certificates.activeCertificate" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div class="border-b border-slate-200 pb-5">
        <p class="text-sm font-medium text-brand-700">Certificate Number</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">
          {{ certificates.activeCertificate.certificateNumber }}
        </h2>
      </div>

      <dl class="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <dt class="text-sm text-slate-500">Student Name</dt>
          <dd class="mt-1 font-semibold text-slate-950">{{ certificates.activeCertificate.studentName }}</dd>
        </div>
        <div>
          <dt class="text-sm text-slate-500">Course Name</dt>
          <dd class="mt-1 font-semibold text-slate-950">{{ certificates.activeCertificate.courseName }}</dd>
        </div>
        <div>
          <dt class="text-sm text-slate-500">Issue Date</dt>
          <dd class="mt-1 font-semibold text-slate-950">{{ formattedDate }}</dd>
        </div>
        <div>
          <dt class="text-sm text-slate-500">Verification Code</dt>
          <dd class="mt-1 font-semibold text-slate-950">{{ certificates.activeCertificate.verificationCode || 'Pending' }}</dd>
        </div>
        <div>
          <dt class="text-sm text-slate-500">Status</dt>
          <dd class="mt-1">
            <span class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
              {{ certificates.activeCertificate.status }}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLmsCertificateStore } from '@/stores/lms/certificateStore'

const route = useRoute()
const certificates = useLmsCertificateStore()

const formattedDate = computed(() => {
  const value = certificates.activeCertificate?.issueDate
  if (!value) return 'Not issued'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
})

const loadCertificate = async () => {
  try {
    await certificates.fetchCertificate(route.params.id)
  } catch {
    // Store owns rendered error state.
  }
}

onMounted(loadCertificate)
</script>
