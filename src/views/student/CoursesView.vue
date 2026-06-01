<template>
  <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    <CourseCard v-for="course in store.items" :key="course.id" :course="course" />
  </section>
</template>
<script setup>
import CourseCard from '@/components/CourseCard.vue'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'
const store = useStudentEnrolledCourseStore()
</script>
