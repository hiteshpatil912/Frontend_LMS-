<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">Teacher workspace</p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-950">Reviews</h1>
      <p class="mt-1 text-sm text-slate-500">Monitor learner feedback and course ratings.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard v-for="metric in metrics" :key="metric.label" v-bind="metric" />
    </div>

    <div v-if="reviews.error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ reviews.error.message }}
    </div>

    <div v-if="reviews.loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="space-y-3 p-5">
        <div v-for="item in 5" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <DataTable v-else-if="reviews.reviews.length" :columns="columns" :rows="reviews.reviews">
      <template #rating="{ row }">
        <span class="font-semibold text-amber-500">{{ stars(row.rating) }}</span>
        <span class="ml-2 text-sm font-medium text-slate-700">{{ row.rating }}/5</span>
      </template>
      <template #comment="{ row }">
        <span class="block max-w-xl whitespace-normal text-slate-600">{{ row.comment }}</span>
      </template>
    </DataTable>

    <div v-else-if="!reviews.loading && !reviews.error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No reviews found.
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ChatBubbleLeftRightIcon, StarIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { useTeacherPanelReviewStore } from '@/stores/teacher/panelReviewStore'

const reviews = useTeacherPanelReviewStore()

const columns = [
  { key: 'student', label: 'Student' },
  { key: 'course', label: 'Course' },
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Review' },
  { key: 'date', label: 'Date' }
]

const averageRating = computed(() =>
  reviews.reviews.length ? (reviews.reviews.reduce((total, review) => total + review.rating, 0) / reviews.reviews.length).toFixed(1) : '0.0'
)

const metrics = computed(() => [
  { label: 'Average Rating', value: averageRating.value, trend: 'Out of 5 stars', icon: StarIcon },
  { label: 'Total Reviews', value: reviews.reviews.length, trend: 'Synced from Laravel LMS', icon: ChatBubbleLeftRightIcon },
  { label: 'Five Star Reviews', value: reviews.reviews.filter((review) => review.rating === 5).length, trend: 'Highest rated feedback', icon: StarIcon },
  { label: 'Reviewers', value: new Set(reviews.reviews.map((review) => review.student)).size, trend: 'Unique learners', icon: UserGroupIcon }
])

const loadReviews = async () => {
  try {
    await reviews.fetchReviews()
  } catch {
    // Store owns rendered error state.
  }
}

const stars = (rating) => {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating || 0))))
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`
}

onMounted(loadReviews)
</script>
