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

    <DataTable v-if="reviews.length" :columns="columns" :rows="reviews">
      <template #rating="{ row }">
        <span class="font-semibold text-slate-950">{{ row.rating }}/5</span>
      </template>
      <template #comment="{ row }">
        <span class="block max-w-xl whitespace-normal text-slate-600">{{ row.comment }}</span>
      </template>
    </DataTable>

    <div v-else class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No reviews found.
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ChatBubbleLeftRightIcon, StarIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'

const reviews = [
  { id: 1, student: 'Aarav Khan', course: 'Vue Foundations', rating: 5, comment: 'Clear lessons and useful assignments.', date: '2026-05-28' },
  { id: 2, student: 'Mina Patel', course: 'Laravel API LMS', rating: 4, comment: 'The API examples helped me understand the backend flow.', date: '2026-05-29' },
  { id: 3, student: 'Riya Das', course: 'Pinia State Management', rating: 5, comment: 'Great explanations with practical state examples.', date: '2026-06-01' }
]

const columns = [
  { key: 'student', label: 'Student' },
  { key: 'course', label: 'Course' },
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Review' },
  { key: 'date', label: 'Date' }
]

const averageRating = computed(() =>
  reviews.length ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1) : '0.0'
)

const metrics = computed(() => [
  { label: 'Average Rating', value: averageRating.value, trend: 'Out of 5 stars', icon: StarIcon },
  { label: 'Total Reviews', value: reviews.length, trend: 'Mock review data', icon: ChatBubbleLeftRightIcon },
  { label: 'Five Star Reviews', value: reviews.filter((review) => review.rating === 5).length, trend: 'Highest rated feedback', icon: StarIcon },
  { label: 'Reviewers', value: new Set(reviews.map((review) => review.student)).size, trend: 'Unique learners', icon: UserGroupIcon }
])
</script>
