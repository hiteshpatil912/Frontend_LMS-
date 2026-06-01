<template>
  <section class="space-y-6">
    <ChartContainer title="Analytics overview" :bars="bars" />
    <ResourcePanel title="Signals" description="Monitor the KPIs that drive learning and revenue." :columns="columns" :rows="store.items" />
  </section>
</template>
<script setup>
import ChartContainer from '@/components/ChartContainer.vue'
import ResourcePanel from '@/components/ResourcePanel.vue'
import { useAdminAnalyticsStore } from '@/stores/admin/analyticsStore'
const store = useAdminAnalyticsStore()
const columns = [{ key: 'label', label: 'Metric' }, { key: 'value', label: 'Value' }, { key: 'status', label: 'Status' }]
const bars = [{ label: 'Q1', value: 52 }, { label: 'Q2', value: 67 }, { label: 'Q3', value: 74 }, { label: 'Q4', value: 88 }]
</script>
