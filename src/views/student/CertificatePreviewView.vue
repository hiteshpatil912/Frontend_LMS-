<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Certificate preview</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ store.currentCertificate?.courseTitle || 'Certificate' }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Review the print-ready certificate and download a PDF copy.</p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <RouterLink class="focus-ring inline-flex justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/student/certificates">
          Back
        </RouterLink>
        <DownloadCertificateButton v-if="store.currentCertificate" :loading="store.downloading" @download="store.downloadCertificate(store.currentCertificate)" />
      </div>
    </div>

    <div v-if="store.loading" class="h-96 animate-pulse rounded-lg bg-slate-200"></div>
    <EmptyCertificateState v-else-if="!store.currentCertificate" title="Certificate not found" message="This certificate is unavailable or has not been issued yet." />
    <CertificatePreview v-else :certificate="store.currentCertificate" />
  </section>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import CertificatePreview from '@/components/certificate/CertificatePreview.vue'
import DownloadCertificateButton from '@/components/certificate/DownloadCertificateButton.vue'
import EmptyCertificateState from '@/components/certificate/EmptyCertificateState.vue'
import { useStudentCertificateStore } from '@/stores/student/certificateStore'

const route = useRoute()
const store = useStudentCertificateStore()

const loadCertificate = () => store.fetchCertificate(route.params.id)

onMounted(loadCertificate)
watch(() => route.params.id, loadCertificate)
</script>
