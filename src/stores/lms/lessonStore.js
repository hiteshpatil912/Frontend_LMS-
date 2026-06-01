import { defineStore } from 'pinia'

export const useLmsLessonStore = defineStore('lmsLessons', {
  state: () => ({
    lessons: [],
    currentLesson: null,
    loading: false,
    errors: {}
  }),
  actions: {}
})
