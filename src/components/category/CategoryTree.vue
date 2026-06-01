<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-slate-950">Category hierarchy</h3>
      <span class="text-xs font-medium text-slate-500">{{ total }} categories</span>
    </div>

    <div v-if="loading" class="mt-5 space-y-3">
      <div v-for="item in 4" :key="item" class="h-12 animate-pulse rounded-lg bg-slate-100"></div>
    </div>

    <p v-else-if="!nodes.length" class="mt-5 rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
      No categories have been created yet.
    </p>

    <ul v-else class="mt-5 space-y-3">
      <li v-for="node in nodes" :key="node.id" class="rounded-lg border border-slate-200 p-3">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-950">{{ node.name }}</p>
            <p class="mt-1 text-xs text-slate-500">/{{ node.slug }}</p>
          </div>
          <CategoryBadge :value="node.status" type="status" />
        </div>
        <ul v-if="node.children?.length" class="mt-3 space-y-2 border-l border-slate-200 pl-4">
          <li v-for="child in node.children" :key="child.id" class="rounded-lg bg-slate-50 p-3">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-slate-800">{{ child.name }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ child.courses }} courses</p>
              </div>
              <CategoryBadge :value="child.status" type="status" />
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryBadge from '@/components/category/CategoryBadge.vue'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const total = computed(() => props.nodes.reduce((count, node) => count + 1 + (node.children?.length || 0), 0))
</script>
