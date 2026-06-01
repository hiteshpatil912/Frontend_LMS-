<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-slate-500">{{ title }}</p>
        <div class="mt-2 flex items-end gap-2">
          <span class="text-4xl font-semibold text-slate-950">{{ summary.averageRating?.toFixed ? summary.averageRating.toFixed(1) : summary.averageRating }}</span>
          <span class="pb-1 text-sm text-slate-500">/ 5</span>
        </div>
      </div>
      <CourseRatingBadge :rating="Number(summary.averageRating || 0)" :count="summary.totalReviews || 0" />
    </div>
    <div class="mt-5 space-y-2">
      <div v-for="row in summary.breakdown || []" :key="row.rating" class="grid grid-cols-[36px_1fr_32px] items-center gap-2 text-xs text-slate-500">
        <span>{{ row.rating }} star</span>
        <div class="h-2 rounded-full bg-slate-200">
          <div class="h-2 rounded-full bg-amber-400" :style="{ width: `${percent(row.count)}%` }"></div>
        </div>
        <span class="text-right">{{ row.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import CourseRatingBadge from '@/components/review/CourseRatingBadge.vue'

const props = defineProps({
  summary: {
    type: Object,
    default: () => ({ averageRating: 0, totalReviews: 0, breakdown: [] })
  },
  title: {
    type: String,
    default: 'Course rating'
  }
})

const percent = (count) => {
  if (!props.summary.totalReviews) return 0
  return Math.round((count / props.summary.totalReviews) * 100)
}
</script>
