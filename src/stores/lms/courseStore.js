import { defineStore } from 'pinia'

export const useLmsCourseStore = defineStore('lmsCourses', {
  state: () => ({
    courses: [],
    course: null,
    filters: {},
    pagination: null,
    loading: false,
    errors: {}
  }),
  actions: {}
})
