<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Certificate operations</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Certificate Templates</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Manage certificate template baselines and verify issued certificate codes.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-5 xl:grid-cols-[1fr_380px]">
      <section class="space-y-4">
        <div v-if="store.loading" class="space-y-3">
          <div v-for="item in 3" :key="item" class="h-32 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
        <article v-for="template in store.templates" v-else :key="template.id" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 class="text-base font-semibold text-slate-950">{{ template.name }}</h3>
              <p class="mt-2 text-sm text-slate-500">{{ template.description }}</p>
            </div>
            <span :class="template.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
              {{ template.status }}
            </span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="rule in template.requiredRules" :key="rule" class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{{ rule }}</span>
          </div>
        </article>
      </section>

      <aside class="space-y-4">
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="text-base font-semibold text-slate-950">Verify certificate</h3>
          <p class="mt-2 text-sm text-slate-500">Enter a certificate ID or verification code.</p>
          <form class="mt-4 space-y-3" @submit.prevent="verify">
            <input v-model.trim="code" class="focus-ring w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" type="text" placeholder="LS-UX-94A2" />
            <button class="focus-ring w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="store.verifying">
              {{ store.verifying ? 'Verifying...' : 'Verify' }}
            </button>
          </form>
          <div v-if="store.verificationResult" class="mt-4 rounded-lg bg-slate-50 p-4">
            <VerificationBadge :verified="store.verificationResult.verified" />
            <p class="mt-3 text-sm text-slate-600">{{ store.verificationResult.message }}</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import VerificationBadge from '@/components/certificate/VerificationBadge.vue'
import { useAdminCertificateTemplateStore } from '@/stores/admin/certificateTemplateStore'

const store = useAdminCertificateTemplateStore()
const code = ref('')

const verify = () => store.verifyCertificate(code.value)

onMounted(() => store.fetchCertificateTemplate())
</script>
