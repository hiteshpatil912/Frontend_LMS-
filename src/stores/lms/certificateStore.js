import { defineStore } from 'pinia'
import { certificateService } from '@/services/certificateService'

const unwrap = (response) => response?.data?.data || response?.data || response || {}

const normalizeError = (error, fallback = 'Unable to process certificate request.') => {
  const status = error.response?.status
  const message = error.response?.data?.message

  const messages = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to access this certificate.',
    404: 'Certificate data was not found.',
    500: 'The server could not process certificates right now.'
  }

  return {
    status,
    message: messages[status] || message || fallback
  }
}

const normalizeCertificate = (certificate) => {
  const course = certificate.course || {}
  const student = certificate.student || certificate.user || {}

  return {
    id: certificate.id,
    certificateNumber: certificate.certificate_number || certificate.number || certificate.certificate_id || certificate.id,
    courseId: certificate.course_id || course.id,
    courseName: certificate.course_name || course.title || course.name || 'Course',
    studentName: certificate.student_name || student.name || 'Student',
    issueDate: certificate.issue_date || certificate.issued_at || certificate.created_at || '',
    verificationCode: certificate.verification_code || certificate.code || '',
    status: certificate.status || (certificate.verified === false ? 'pending' : 'issued')
  }
}

export const useLmsCertificateStore = defineStore('lmsCertificates', {
  state: () => ({
    certificates: [],
    activeCertificate: null,
    loading: false,
    generating: false,
    error: null
  }),

  getters: {
    hasCertificates: (state) => state.certificates.length > 0,
    certificateCourseIds: (state) => state.certificates.map((certificate) => String(certificate.courseId)).filter(Boolean)
  },

  actions: {
    clearError() {
      this.error = null
    },

    async fetchCertificates() {
      this.loading = true
      this.clearError()

      try {
        const response = await certificateService.getCertificates()
        const payload = unwrap(response)
        const certificates = Array.isArray(payload) ? payload : payload.certificates || payload.data || []
        this.certificates = certificates.map(normalizeCertificate)
        return this.certificates
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load certificates.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async generateCertificate(courseId) {
      this.generating = true
      this.clearError()

      try {
        const response = await certificateService.generateCertificate(courseId)
        const certificate = normalizeCertificate(unwrap(response).certificate || unwrap(response))

        if (certificate.id) {
          const existingIndex = this.certificates.findIndex((item) => String(item.id) === String(certificate.id))

          if (existingIndex >= 0) {
            this.certificates.splice(existingIndex, 1, certificate)
          } else {
            this.certificates.unshift(certificate)
          }
        }

        return certificate
      } catch (error) {
        this.error = normalizeError(error, 'Unable to generate certificate.')
        throw error
      } finally {
        this.generating = false
      }
    },

    async fetchCertificate(id) {
      this.loading = true
      this.clearError()

      try {
        const response = await certificateService.getCertificate(id)
        this.activeCertificate = normalizeCertificate(unwrap(response).certificate || unwrap(response))
        return this.activeCertificate
      } catch (error) {
        this.error = normalizeError(error, 'Unable to load certificate details.')
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
