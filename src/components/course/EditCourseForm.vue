<template>
  <CourseForm :initial-value="course" :saving="saving" :cancel-to="cancelTo" submit-label="Update course" @submit="$emit('submit', $event)" />
</template>

<script setup>
import CourseForm from '@/components/course/CourseForm.vue'

defineEmits(['submit'])
defineProps({
  course: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  },
  cancelTo: {
    type: String,
    required: true
  }
})
</script>
