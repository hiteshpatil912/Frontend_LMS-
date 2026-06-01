<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-950">{{ title }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ description }}</p>
      </div>
      <button class="focus-ring rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" @click="modalOpen = true">
        Add record
      </button>
    </div>

    <DataTable :columns="columns" :rows="rows">
      <template #status="{ row }">
        <span class="rounded-full px-2.5 py-1 text-xs font-medium capitalize" :class="statusClass(row.status)">
          {{ row.status }}
        </span>
      </template>
    </DataTable>

    <BaseModal :open="modalOpen" :title="`Add ${title}`" @close="modalOpen = false">
      <BaseForm @submit="modalOpen = false" @cancel="modalOpen = false">
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Name or title</span>
          <input class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-slate-700">Status</span>
          <input class="focus-ring mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="text" />
        </label>
      </BaseForm>
    </BaseModal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import BaseForm from '@/components/BaseForm.vue'
import BaseModal from '@/components/BaseModal.vue'
import DataTable from '@/components/DataTable.vue'

defineProps({
  title: String,
  description: String,
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
})

const modalOpen = ref(false)
const statusClass = (status) => {
  if (status === 'failed' || status === 'at risk') return 'bg-rose-50 text-rose-700'
  if (status === 'pending' || status === 'processing' || status === 'reviewing') return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}
</script>
