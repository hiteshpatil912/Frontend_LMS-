<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-950">Orders</h1>
        <p class="text-sm text-slate-500">Track revenue and course enrollments.</p>
      </div>
      <button @click="load" class="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        <span>Refresh</span>
      </button>
    </div>

    <div v-if="store.loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-lg bg-slate-100"></div>
    </div>

    <div v-else-if="store.error" class="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {{ store.error }}
    </div>

    <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-20 text-center">
      <p class="text-slate-500">No orders found.</p>
    </div>

    <div v-else class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th class="px-6 py-4">Order ID</th>
              <th class="px-6 py-4">Customer</th>
              <th class="px-6 py-4">Amount</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="item in store.items" :key="item.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-mono text-xs text-slate-500">#{{ item.order_number || item.id }}</td>
              <td class="px-6 py-4">
                <div class="font-medium text-slate-900">{{ item.user?.name || item.customer_name }}</div>
                <div class="text-xs text-slate-500">{{ item.user?.email }}</div>
              </td>
              <td class="px-6 py-4 font-medium text-slate-900">${{ (item.total_amount || item.amount || 0).toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize',
                  item.status === 'completed' || item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                ]">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right text-slate-600">
                {{ item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminManagementStore } from '@/stores/admin/adminManagementStore'

const store = useAdminManagementStore()
const load = () => store.fetchData('orders')

onMounted(load)
</script>