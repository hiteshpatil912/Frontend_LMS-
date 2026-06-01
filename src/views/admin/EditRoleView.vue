<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Access control</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Edit Role</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Update role details and keep permission access aligned with your LMS policies.</p>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">
          {{ alert.message || store.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="h-5 w-48 animate-pulse rounded bg-slate-200"></div>
      <div class="h-10 animate-pulse rounded bg-slate-200"></div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="item in 6" :key="item" class="h-16 animate-pulse rounded-lg bg-slate-200"></div>
      </div>
    </div>

    <RoleForm
      v-else-if="store.currentRole"
      :initial-value="store.currentRole"
      :permissions="store.permissions"
      :saving="store.saving"
      submit-label="Update role"
      @submit="updateRole"
    />

    <div v-else class="rounded-lg border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
      <h3 class="text-sm font-semibold text-slate-950">Role not found</h3>
      <p class="mt-1 text-sm text-slate-500">This role may have been removed or is unavailable.</p>
      <RouterLink class="focus-ring mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/admin/roles">
        Back to roles
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import RoleForm from '@/components/admin/RoleForm.vue'
import { useAdminRolesStore } from '@/stores/admin/rolesStore'

const store = useAdminRolesStore()
const route = useRoute()
const router = useRouter()
const alert = reactive({
  message: '',
  tone: 'success'
})

onMounted(() => {
  store.fetchSingleRole(route.params.id)
})

const updateRole = async (payload) => {
  alert.message = ''
  try {
    await store.updateRole(route.params.id, payload)
    alert.tone = 'success'
    alert.message = 'Role updated successfully.'
    setTimeout(() => router.push('/admin/roles'), 500)
  } catch {
    alert.tone = 'error'
    alert.message = store.errors.general || 'Unable to update role.'
  }
}
</script>
