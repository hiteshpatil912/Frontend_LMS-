import { defineStore } from 'pinia'
import * as courseService from '@/services/courseService'

export const useCourseStore = defineStore('course', {

  state: () => ({
    courses: [],
    loading: false,
    error: null
  }),

  actions: {

    async fetchCourses() {

      this.loading = true

      try {

        const { data } = await courseService.getCourses()

        this.courses = data.courses

      } catch (error) {

        this.error = error

      } finally {

        this.loading = false

      }

    }

  }

})