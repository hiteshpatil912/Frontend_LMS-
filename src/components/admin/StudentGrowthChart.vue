<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-base font-semibold text-slate-950">Student growth</h3>
    <div class="mt-5 h-72">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { chartOptions } from '@/components/admin/chartSetup'

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.rows.map((row) => row.label),
  datasets: [
    {
      label: 'Students',
      data: props.rows.map((row) => row.value),
      borderColor: '#16a34a',
      backgroundColor: 'rgba(22, 163, 74, 0.14)',
      tension: 0.35,
      fill: true
    }
  ]
}))
</script>
