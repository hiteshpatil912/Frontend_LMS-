<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Access control</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">Role Management</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">
          Review system roles and the base permission structure used across the LMS.
        </p>
      </div>

      <div class="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-end">
        <div class="w-full lg:w-80">
          <label class="text-sm font-medium text-slate-700" for="role-search">Search roles</label>
          <div class="relative mt-1">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="role-search"
              v-model.trim="search"
              class="focus-ring w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm"
              type="search"
              placeholder="Search by role or permission"
            />
          </div>
        </div>
        <RouterLink class="focus-ring inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" to="/admin/roles/create">
          Create role
        </RouterLink>
      </div>
    </div>

    <TransitionRoot appear :show="Boolean(alert.message || store.errors.general)" as="template">
      <TransitionChild
        as="template"
        enter="duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-150 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="rounded-lg border px-4 py-3 text-sm" :class="alert.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800'">
          {{ alert.message || store.errors.general }}
        </div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Total roles</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ store.totalRoles }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Permission groups</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">3</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm text-slate-500">Visible results</p>
        <p class="mt-2 text-3xl font-semibold text-slate-950">{{ filteredRoles.length }}</p>
      </div>
    </div>

    <RoleTable :roles="filteredRoles" :loading="store.loading" @delete="requestDelete" />
    <DeleteRoleDialog :open="deleteDialogOpen" :role="selectedRole" :deleting="store.deleting" @close="deleteDialogOpen = false" @confirm="deleteRole" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import DeleteRoleDialog from '@/components/admin/DeleteRoleDialog.vue'
import RoleTable from '@/components/admin/RoleTable.vue'
import { useAdminRolesStore } from '@/stores/admin/rolesStore'

const store = useAdminRolesStore()
const search = ref('')
const deleteDialogOpen = ref(false)
const selectedRole = ref(null)
const alert = reactive({
  message: '',
  tone: 'success'
})

const filteredRoles = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return store.roles

  return store.roles.filter((role) => {
    const permissions = role.permissions.join(' ').toLowerCase()
    return role.name.toLowerCase().includes(query) || permissions.includes(query)
  })
})

onMounted(() => {
  store.fetchRoles()
})

const requestDelete = (role) => {
  alert.message = ''
  selectedRole.value = role
  deleteDialogOpen.value = true
}

const deleteRole = async () => {
  if (!selectedRole.value) return

  try {
    await store.deleteRole(selectedRole.value.id)
    alert.tone = 'success'
    alert.message = `${selectedRole.value.name} role deleted successfully.`
    deleteDialogOpen.value = false
    selectedRole.value = null
  } catch {
    alert.tone = 'error'
    alert.message = store.errors.general || 'Unable to delete role.'
  }
}
</script>
