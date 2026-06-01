<template>
  <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-base font-semibold text-slate-950">Enrollment statistics</h3>
    <div class="mt-5 h-72">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
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
      label: 'Enrollments',
      data: props.rows.map((row) => row.value),
      backgroundColor: '#0ea5e9'
    }
  ]
}))
</script>
