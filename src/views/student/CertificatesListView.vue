<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Credentials</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Certificates</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Generate, preview, verify, and download certificates for completed courses.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-56 animate-pulse rounded-lg bg-slate-200"></div>
    </div>

    <div v-else class="space-y-6">
      <section class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-950">Issued certificates</h3>
        <EmptyCertificateState v-if="!store.issuedCertificates.length" />
        <div v-else class="grid gap-4 xl:grid-cols-2">
          <CertificateCard v-for="certificate in store.issuedCertificates" :key="certificate.id" :certificate="certificate" :downloading="store.downloading" @download="store.downloadCertificate" />
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-950">Completion eligibility</h3>
        <div class="grid gap-4 xl:grid-cols-2">
          <CompletionStatusCard
            v-for="course in store.eligibleCourses"
            :key="course.id"
            :course="course"
            :generating="store.generating"
            :issued="Boolean(store.certificates.find((certificate) => String(certificate.courseId) === String(course.id)))"
            @generate="generateCertificate"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CertificateCard from '@/components/certificate/CertificateCard.vue'
import CompletionStatusCard from '@/components/certificate/CompletionStatusCard.vue'
import EmptyCertificateState from '@/components/certificate/EmptyCertificateState.vue'
import { useStudentCertificateStore } from '@/stores/student/certificateStore'

const router = useRouter()
const store = useStudentCertificateStore()

const generateCertificate = async (course) => {
  const certificate = await store.generateCertificate(course.id)
  router.push(`/student/certificates/${certificate.id}`)
}

onMounted(() => store.fetchCertificates())
</script>
