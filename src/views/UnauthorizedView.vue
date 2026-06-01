<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-50 px-5">
    <section class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
      <ShieldExclamationIcon class="mx-auto size-12 text-rose-500" />
      <h1 class="mt-4 text-2xl font-semibold text-slate-950">Unauthorized</h1>
      <p class="mt-2 text-sm text-slate-500">
        Your current role does not have access to this LMS area.
      </p>
      <RouterLink class="focus-ring mt-6 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" :to="auth.redirectPath">
        Return to dashboard
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { ShieldExclamationIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth/authStore'

const auth = useAuthStore()
</script>
