<template>
  <ReviewAnalyticsPage :store="store" eyebrow="Instructor feedback" />
</template>

<script setup>
import ReviewAnalyticsPage from '@/views/shared/ReviewAnalyticsPage.vue'
import { useTeacherReviewAnalyticsStore } from '@/stores/teacher/reviewAnalyticsStore'

const store = useTeacherReviewAnalyticsStore()
</script>
