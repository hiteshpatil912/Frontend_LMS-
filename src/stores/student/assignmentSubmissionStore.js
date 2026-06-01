import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useStudentAssignmentSubmissionStore = defineStore('studentAssignmentSubmissions', {
  state: () => ({
    assignments: [],
    submissions:[],
    currentAssignment: null,
    loading: false,
    submitting: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.assignments,
    submissionForAssignment: (state) => (assignmentId) => (state.submissions || []).find((submission) => String(submission.assignmentId) === String(assignmentId)),
    pendingAssignments: (state) => (state.assignments || []).filter((assignment) => !state.submissions.some((submission) => String(submission.assignmentId) === String(assignment.id)))
  },
  actions: {
    async fetchAssignments() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/assignments')
        this.assignments = data.assignments || []
      } catch (error) {
        this.errors = { general: 'Unable to sync assignments. Showing local assignment data.' }
      } finally {
        this.loading = false
      }
    },
    async fetchSingleAssignment(id) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/student/assignments/${id}`)
        this.currentAssignment = normalize(data)
      } catch (error) {
        this.currentAssignment = this.assignments.find((assignment) => String(assignment.id) === String(id)) || null
        if (!this.currentAssignment) this.errors = { general: 'Assignment not found.' }
      } finally {
        this.loading = false
      }
    },
    async fetchSubmissions() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/submissions')
        this.submissions = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync submissions. Showing local submission data.' }
      } finally {
        this.loading = false
      }
    },
    async submitAssignment(assignmentId, payload) {
      this.submitting = true
      this.errors = {}
      const assignment = (this.assignments || []).find((item) => String(item.id) === String(assignmentId))
      const late = assignment ? new Date() > new Date(assignment.dueDate) : false
      try {
        const { data } = await api.post(`/student/assignments/${assignmentId}/submit`, payload)
        const submission = normalize(data)
        this.submissions = [submission, ...this.submissions.filter((item) => String(item.assignmentId) !== String(assignmentId))]
        return submission
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to submit assignment.' }
          throw error
        }
        const submission = {
          id: Date.now(),
          assignmentId: Number(assignmentId),
          studentName: 'Demo Student',
          submittedAt: new Date().toISOString(),
          fileName: payload.fileName,
          status: late ? 'late' : 'submitted',
          late,
          grade: null,
          totalMarks: assignment?.totalMarks || 100,
          feedback: ''
        }
        this.submissions = [submission, ...this.submissions.filter((item) => String(item.assignmentId) !== String(assignmentId))]
        return submission
      } finally {
        this.submitting = false
      }
    }
  }
})
