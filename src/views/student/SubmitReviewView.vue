<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-medium text-brand-700">Course feedback</p>
        <h2 class="mt-1 text-2xl font-semibold text-slate-950">{{ course?.title || 'Submit Review' }}</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-500">Share a rating and review for a course you are enrolled in.</p>
      </div>
      <RouterLink class="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" :to="`/student/admin/courses/${route.params.id}`">Back to course</RouterLink>
    </div>

    <TransitionRoot appear :show="Boolean(store.errors.general)" as="template">
      <TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ store.errors.general }}</div>
      </TransitionChild>
    </TransitionRoot>

    <div class="grid gap-6 xl:grid-cols-[360px_1fr]">
      <RatingSummaryCard :summary="summary" title="Course rating summary" />
      <div class="space-y-5">
        <ReviewForm :initial-value="myReview" :loading="store.saving" :submit-label="myReview ? 'Update review' : 'Submit review'" @submit="saveReview" />
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-slate-950">Recent reviews</h3>
          <EmptyReviewState v-if="!courseReviews.length" />
          <ReviewCard v-for="review in courseReviews" v-else :key="review.id" :review="review" :manageable="review.id === myReview?.id" @delete="deleteReview" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import EmptyReviewState from '@/components/review/EmptyReviewState.vue'
import RatingSummaryCard from '@/components/review/RatingSummaryCard.vue'
import ReviewCard from '@/components/review/ReviewCard.vue'
import ReviewForm from '@/components/review/ReviewForm.vue'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'
import { useStudentReviewStore } from '@/stores/student/reviewStore'

const route = useRoute()
const router = useRouter()
const store = useStudentReviewStore()
const enrollmentStore = useStudentEnrolledCourseStore()

const course = computed(() => enrollmentStore.currentCourse)
const courseReviews = computed(() => store.reviewsForCourse(route.params.id))
const summary = computed(() => store.ratingSummary(route.params.id))
const myReview = computed(() => store.myReviewForCourse(route.params.id))

const saveReview = async (payload) => {
  if (myReview.value) {
    await store.updateReview(myReview.value.id, payload)
    return
  }
  await store.submitReview(route.params.id, payload)
}

const deleteReview = async (review) => {
  await store.deleteReview(review.id)
  router.push(`/student/admin/courses/${route.params.id}`)
}

onMounted(async () => {
  await enrollmentStore.fetchSingleCourse(route.params.id)
  await store.fetchReviews(route.params.id)
})
</script>
