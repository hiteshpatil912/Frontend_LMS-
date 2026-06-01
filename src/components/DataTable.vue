<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th v-for="column in columns" :key="column.key" class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="row in rows" :key="row.id" class="hover:bg-slate-50">
            <td v-for="column in columns" :key="column.key" class="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
              <slot :name="column.key" :row="row">{{ row[column.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
})
</script>
