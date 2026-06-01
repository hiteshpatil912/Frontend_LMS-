<template>
  <section class="space-y-8">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-950">Certificates</h1>
        <p class="mt-1 text-sm text-slate-500">View earned certificates and generate certificates for completed courses.</p>
      </div>

      <button
        type="button"
        class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="certificates.loading || courses.loading"
        @click="loadPage"
      >
        Refresh
      </button>
    </div>

    <div v-if="certificates.error || courses.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ certificates.error?.message || courses.error?.message }}
    </div>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-slate-950">Generate Certificate</h2>

      <div v-if="courses.loading" class="grid gap-4 md:grid-cols-2">
        <div v-for="item in 2" :key="item" class="rounded-lg border border-slate-200 bg-white p-5">
          <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
          <div class="mt-4 h-2 w-full animate-pulse rounded bg-slate-100"></div>
          <div class="mt-5 h-10 w-40 animate-pulse rounded bg-slate-200"></div>
        </div>
      </div>

      <div v-else-if="eligibleCourses.length" class="grid gap-4 md:grid-cols-2">
        <article v-for="course in eligibleCourses" :key="course.id" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-semibold text-slate-950">{{ course.title }}</h3>
              <p class="mt-1 text-sm text-slate-500">Progress {{ course.progress }}%</p>
            </div>
            <button
              type="button"
              class="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="certificates.generating"
              @click="generate(course.id)"
            >
              {{ certificates.generating ? 'Generating...' : 'Generate Certificate' }}
            </button>
          </div>
        </article>
      </div>

      <p v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Complete a course to 100% to generate a certificate.
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-slate-950">Earned Certificates</h2>

      <div v-if="certificates.loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="item in 6" :key="item" class="rounded-lg border border-slate-200 bg-white p-5">
          <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
          <div class="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100"></div>
          <div class="mt-6 h-10 w-full animate-pulse rounded bg-slate-200"></div>
        </article>
      </div>

      <div v-else-if="certificates.hasCertificates" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CertificateCard
          v-for="certificate in certificates.certificates"
          :key="certificate.id"
          :certificate="certificate"
        />
      </div>

      <p v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No certificates found.
      </p>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import CertificateCard from '@/components/certificate/CertificateCard.vue'
import { useLmsCertificateStore } from '@/stores/lms/certificateStore'
import { useLmsMyCoursesStore } from '@/stores/lms/myCoursesStore'

const certificates = useLmsCertificateStore()
const courses = useLmsMyCoursesStore()

const eligibleCourses = computed(() =>
  courses.courses.filter((course) =>
    Number(course.progress) >= 100 &&
    !certificates.certificateCourseIds.includes(String(course.id))
  )
)

const loadPage = async () => {
  try {
    await Promise.all([
      certificates.fetchCertificates(),
      courses.fetchCourses(1)
    ])
  } catch {
    // Stores own rendered error states.
  }
}

const generate = async (courseId) => {
  try {
    await certificates.generateCertificate(courseId)
    await certificates.fetchCertificates()
  } catch {
    // Store owns rendered error state.
  }
}

onMounted(loadPage)
</script>
