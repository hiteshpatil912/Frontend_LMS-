<template>
  <ReviewAnalyticsPage :store="store" eyebrow="Review management" />
</template>

<script setup>
import ReviewAnalyticsPage from '@/views/shared/ReviewAnalyticsPage.vue'
import { useTeacherReviewAnalyticsStore } from '@/stores/teacher/reviewAnalyticsStore'

const store = useTeacherReviewAnalyticsStore()
</script>
