<template>
  <section class="space-y-5">
    <div>
      <p class="text-sm font-medium text-brand-700">Access control</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Create Role</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Define a role name and select the permissions this role should grant.</p>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'">
          {{ alert.message }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <RoleForm :permissions="store.permissions" :saving="store.saving" submit-label="Create role" @submit="createRole" />
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import RoleForm from '@/components/admin/RoleForm.vue'
import { useAdminRolesStore } from '@/stores/admin/rolesStore'

const store = useAdminRolesStore()
const router = useRouter()
const alert = reactive({
  message: '',
  tone: 'success'
})

const createRole = async (payload) => {
  alert.message = ''
  try {
    await store.createRole(payload)
    alert.tone = 'success'
    alert.message = 'Role created successfully.'
    setTimeout(() => router.push('/admin/roles'), 500)
  } catch {
    alert.tone = 'error'
    alert.message = store.errors.general || 'Unable to create role.'
  }
}
</script>
