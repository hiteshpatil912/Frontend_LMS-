import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const mockAssignments = [
  {
    id: 1,
    title: 'Market Opportunity Memo',
    description: 'Write a concise opportunity memo with target user, pain point, and strategic bet.',
    courseId: 1,
    course: 'Product Strategy Masterclass',
    lessonId: 2,
    lesson: 'Opportunity Mapping',
    dueDate: '2026-05-28T23:59:00.000Z',
    attachmentName: 'opportunity-memo-brief.pdf',
    totalMarks: 100,
    submissionType: 'file_upload',
    status: 'open',
    submissionsCount: 2
  },
  {
    id: 2,
    title: 'UX Interview Guide',
    description: 'Prepare an interview script for a moderated research session.',
    courseId: 2,
    course: 'UX Research Systems',
    lessonId: 3,
    lesson: 'Research Intake',
    dueDate: '2026-05-24T23:59:00.000Z',
    attachmentName: 'interview-guide-template.docx',
    totalMarks: 50,
    submissionType: 'document',
    status: 'reviewing',
    submissionsCount: 1
  },
  {
    id: 3,
    title: 'Metric Tree Exercise',
    description: 'Map a metric tree for your course project and submit the worksheet.',
    courseId: 3,
    course: 'Data Analytics for Teams',
    lessonId: null,
    lesson: 'Course project',
    dueDate: '2026-05-18T23:59:00.000Z',
    attachmentName: 'metric-tree.zip',
    totalMarks: 80,
    submissionType: 'file_upload',
    status: 'graded',
    submissionsCount: 1
  }
]

export const mockSubmissions = [
  {
    id: 1,
    assignmentId: 1,
    studentName: 'Demo Student',
    submittedAt: '2026-05-19T11:20:00.000Z',
    fileName: 'market-opportunity-demo.pdf',
    status: 'submitted',
    late: false,
    grade: null,
    totalMarks: 100,
    feedback: ''
  },
  {
    id: 2,
    assignmentId: 1,
    studentName: 'Rohan Mehta',
    submittedAt: '2026-05-20T09:12:00.000Z',
    fileName: 'opportunity-rohan.docx',
    status: 'graded',
    late: false,
    grade: 88,
    totalMarks: 100,
    feedback: 'Strong opportunity framing. Tighten the success metric.'
  },
  {
    id: 3,
    assignmentId: 3,
    studentName: 'Sofia Chen',
    submittedAt: '2026-05-19T07:42:00.000Z',
    fileName: 'metric-tree-sofia.zip',
    status: 'late',
    late: true,
    grade: 62,
    totalMarks: 80,
    feedback: 'Late submission accepted. Add clearer dependency labels next time.'
  }
]

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)
const extractErrors = (error, fallback) => error.response?.data?.errors || { general: error.response?.data?.message || fallback }

export const useTeacherAssignmentStore = defineStore('teacherAssignments', {
  state: () => ({
    assignments: [...mockAssignments],
    submissions: [...mockSubmissions],
    currentAssignment: null,
    loading: false,
    saving: false,
    deleting: false,
    grading: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.assignments,
    openAssignments: (state) => state.assignments.filter((assignment) => assignment.status === 'open'),
    submissionsForAssignment: (state) => (assignmentId) => state.submissions.filter((submission) => String(submission.assignmentId) === String(assignmentId))
  },
  actions: {
    async fetchAssignments(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/teacher/assignments', { params })
        this.assignments = normalize(data)
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
        const { data } = await api.get(`/teacher/assignments/${id}`)
        this.currentAssignment = normalize(data)
      } catch (error) {
        this.currentAssignment = this.assignments.find((assignment) => String(assignment.id) === String(id)) || null
        if (!this.currentAssignment) this.errors = { general: 'Assignment not found.' }
      } finally {
        this.loading = false
      }
    },
    async createAssignment(payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post('/teacher/assignments', payload)
        const assignment = normalize(data)
        this.assignments.unshift(assignment)
        return assignment
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to create assignment.')
          throw error
        }
        const assignment = { ...payload, id: Date.now(), status: 'open', submissionsCount: 0 }
        this.assignments.unshift(assignment)
        return assignment
      } finally {
        this.saving = false
      }
    },
    async updateAssignment(id, payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.put(`/teacher/assignments/${id}`, payload)
        const assignment = normalize(data)
        this.assignments = this.assignments.map((item) => (String(item.id) === String(id) ? { ...item, ...assignment } : item))
        return assignment
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to update assignment.')
          throw error
        }
        this.assignments = this.assignments.map((item) => (String(item.id) === String(id) ? { ...item, ...payload } : item))
        return this.assignments.find((item) => String(item.id) === String(id))
      } finally {
        this.saving = false
      }
    },
    async deleteAssignment(id) {
      this.deleting = true
      this.errors = {}
      try {
        await api.delete(`/teacher/assignments/${id}`)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to delete assignment.' }
          throw error
        }
      } finally {
        this.assignments = this.assignments.filter((assignment) => String(assignment.id) !== String(id))
        this.deleting = false
      }
    },
    async fetchSubmissions(assignmentId) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/teacher/assignments/${assignmentId}/submissions`)
        this.submissions = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync submissions. Showing local submissions.' }
      } finally {
        this.loading = false
      }
    },
    async gradeSubmission(submissionId, payload) {
      this.grading = true
      this.errors = {}
      try {
        const { data } = await api.post(`/teacher/submissions/${submissionId}/grade`, payload)
        const submission = normalize(data)
        this.submissions = this.submissions.map((item) => (String(item.id) === String(submissionId) ? { ...item, ...submission } : item))
        return submission
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = extractErrors(error, 'Unable to grade submission.')
          throw error
        }
        this.submissions = this.submissions.map((item) => (String(item.id) === String(submissionId) ? { ...item, ...payload, status: 'graded' } : item))
        return this.submissions.find((item) => String(item.id) === String(submissionId))
      } finally {
        this.grading = false
      }
    }
  }
})
