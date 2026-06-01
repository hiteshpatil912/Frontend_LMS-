<template>
  <section class="space-y-6">
    <div>
      <p class="text-sm font-medium text-brand-700">{{ eyebrow }}</p>
      <h2 class="mt-1 text-2xl font-semibold text-slate-950">Reviews & Ratings</h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">Review course sentiment, rating distribution, and recent student feedback.</p>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div v-if="store.loading" class="grid gap-4 md:grid-cols-2">
      <div v-for="item in 4" :key="item" class="h-56 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
    <div v-else class="space-y-6">
      <div class="grid gap-4 xl:grid-cols-[360px_1fr]">
        <RatingSummaryCard :summary="store.summary" title="Instructor feedback analytics" />
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm text-slate-500">Total reviews</p>
            <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.summary.totalReviews }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm text-slate-500">Top course</p>
            <p class="mt-2 text-base font-semibold text-slate-950">{{ store.topRatedCourses[0]?.courseTitle || 'No data' }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm text-slate-500">Needs attention</p>
            <p class="mt-2 text-2xl font-semibold text-slate-950">{{ store.lowRatedReviews.length }}</p>
          </div>
        </div>
      </div>

      <section class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-950">Course ratings</h3>
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="course in store.topRatedCourses" :key="course.courseId" class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h4 class="text-sm font-semibold text-slate-950">{{ course.courseTitle }}</h4>
            <CourseRatingBadge class="mt-3" :rating="course.averageRating" :count="course.totalReviews" />
          </article>
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-lg font-semibold text-slate-950">Recent reviews</h3>
        <EmptyReviewState v-if="!store.reviews.length" />
        <div v-else class="grid gap-4 xl:grid-cols-2">
          <ReviewCard v-for="review in store.reviews" :key="review.id" :review="review" manageable @delete="store.deleteReview(review.id)" />
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import CourseRatingBadge from '@/components/review/CourseRatingBadge.vue'
import EmptyReviewState from '@/components/review/EmptyReviewState.vue'
import RatingSummaryCard from '@/components/review/RatingSummaryCard.vue'
import ReviewCard from '@/components/review/ReviewCard.vue'

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  eyebrow: {
    type: String,
    default: 'Feedback'
  }
})

onMounted(() => props.store.fetchReviews())
</script>
