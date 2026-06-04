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

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="space-y-3 p-5">
        <div v-for="item in 5" :key="item" class="h-10 animate-pulse rounded bg-slate-100"></div>
      </div>
    </div>

    <DataTable v-else-if="reviews.length" :columns="columns" :rows="reviews">
      <template #rating="{ row }">
        <span class="font-semibold text-slate-950">{{ row.rating }}/5</span>
      </template>
      <template #comment="{ row }">
        <span class="block max-w-xl whitespace-normal text-slate-600">{{ row.comment }}</span>
      </template>
    </DataTable>

    <div v-else-if="!loading && !error" class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      No reviews found.
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ChatBubbleLeftRightIcon, StarIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import { teacherReviewService } from '@/services/teacherReviewService'

const reviews = ref([])
const loading = ref(false)
const error = ref('')

const columns = [
  { key: 'student', label: 'Student' },
  { key: 'course', label: 'Course' },
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Review' },
  { key: 'date', label: 'Date' }
]

const averageRating = computed(() =>
  reviews.value.length ? (reviews.value.reduce((total, review) => total + review.rating, 0) / reviews.value.length).toFixed(1) : '0.0'
)

const metrics = computed(() => [
  { label: 'Average Rating', value: averageRating.value, trend: 'Out of 5 stars', icon: StarIcon },
  { label: 'Total Reviews', value: reviews.value.length, trend: 'Synced from Laravel LMS', icon: ChatBubbleLeftRightIcon },
  { label: 'Five Star Reviews', value: reviews.value.filter((review) => review.rating === 5).length, trend: 'Highest rated feedback', icon: StarIcon },
  { label: 'Reviewers', value: new Set(reviews.value.map((review) => review.student)).size, trend: 'Unique learners', icon: UserGroupIcon }
])

const reviewRowsFrom = (response) => {
  const payload = response?.data
  const data = payload?.data

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.reviews)) return data.reviews
  if (Array.isArray(payload?.reviews)) return payload.reviews

  return []
}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

const normalizeReview = (review) => ({
  id: review.review_id ?? review.id ?? `${review.course_id || 'course'}-${review.created_at || Math.random()}`,
  student: review.student_name || 'Student',
  course: review.course_title || `Course #${review.course_id}`,
  rating: Number(review.rating || 0),
  comment: review.comment || '',
  date: formatDate(review.created_at)
})

const loadReviews = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await teacherReviewService.getReviews()
    reviews.value = reviewRowsFrom(response).map(normalizeReview)
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Unable to load reviews.'
    reviews.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadReviews)
</script>
