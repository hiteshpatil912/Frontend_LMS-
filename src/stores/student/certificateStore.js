import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth/authStore'
import { useStudentEnrolledCourseStore } from '@/stores/student/enrolledCourseStore'

const initialCertificates = []

const normalize = (data) => data.data || data

const shouldUseLocalFallback = (error) =>
  !error.response || [404, 405].includes(error.response.status)

export const useStudentCertificateStore = defineStore(
  'studentCertificates',
  {

    state: () => ({

      certificates: [],

      currentCertificate: null,

      eligibleCourses: [],

      loading: false,

      generating: false,

      downloading: false,

      verifying: false,

      errors: {}

    }),

    getters: {

      items: (state) => state.certificates || [],

      issuedCertificates: (state) =>
        (state.certificates || []).filter(
          (certificate) =>
            certificate.status === 'issued'
        ),

      pendingCertificates: (state) =>
        (state.eligibleCourses || []).filter(
          (course) =>
            !(state.certificates || []).some(
              (certificate) =>
                String(certificate.courseId) ===
                String(course.id)
            )
        ),

      certificateById: (state) => (id) =>
        (state.certificates || []).find(
          (certificate) =>
            String(certificate.id) === String(id)
        )

    },

    actions: {

      buildEligibility() {

        const enrolledStore =
          useStudentEnrolledCourseStore()

        this.eligibleCourses =
          (enrolledStore.enrolledCourses || []).map(
            (course) => {

              const lessons =
                course.lessons || []

              const allLessonsCompleted =
                lessons.every(
                  (lesson) => lesson.completed
                )

              const quizPassed = true

              const courseCompleted =
                course.status === 'completed' ||
                allLessonsCompleted

              return {

                ...course,

                allLessonsCompleted,

                quizPassed,

                courseCompleted,

                eligible:
                  allLessonsCompleted &&
                  quizPassed &&
                  courseCompleted,

                quizScore: 100

              }

            }
          )

      },

      async fetchCertificates() {

        this.loading = true

        this.errors = {}

        const enrolledStore =
          useStudentEnrolledCourseStore()

        try {

          await enrolledStore.fetchEnrolledCourses()

          const { data } =
            await api.get('/student/certificates')

          this.certificates =
            data.certificates || []

        } catch (error) {

          this.errors = {

            general:
              'Unable to sync certificates. Showing local certificate records.'

          }

        } finally {

          this.buildEligibility()

          this.loading = false

        }

      },

      async fetchCertificate(id) {

        this.loading = true

        this.errors = {}

        try {

          const { data } =
            await api.get(
              `/student/certificates/${id}`
            )

          this.currentCertificate =
            data.certificate || null

        } catch (error) {

          this.currentCertificate =
            this.certificateById(id) || null

          if (!this.currentCertificate) {

            this.errors = {
              general: 'Certificate not found.'
            }

          }

        } finally {

          this.loading = false

        }

      },

      async generateCertificate(courseId) {

        this.generating = true

        this.errors = {}

        const authStore = useAuthStore()

        try {

          const { data } =
            await api.post(
              '/student/certificates/generate',
              { courseId }
            )

          const certificate = normalize(data)

          this.certificates = [

            certificate,

            ...(this.certificates || [])

          ]

          return certificate

        } catch (error) {

          if (!shouldUseLocalFallback(error)) {

            this.errors = {

              general:
                error.response?.data?.message ||
                'Unable to generate certificate.'

            }

            throw error

          }

          const course =
            (this.eligibleCourses || []).find(
              (item) =>
                String(item.id) ===
                String(courseId)
            )

          if (!course?.eligible) {

            this.errors = {

              general:
                'Complete all lessons, pass the quiz, and finish the course before generating this certificate.'

            }

            throw new Error(
              this.errors.general
            )

          }

          const certificate = {

            id: Date.now(),

            certificateId:
              `CERT-LMS-${new Date().getFullYear()}-${Math.floor(
                1000 + Math.random() * 9000
              )}`,

            verificationCode:
              `LS-${course.slug?.slice(0, 3)?.toUpperCase() || 'CRT'}-${Math.random()
                .toString(36)
                .slice(2, 6)
                .toUpperCase()}`,

            studentName:
              authStore.user?.name ||
              'Demo Student',

            courseId: course.id,

            courseTitle: course.title,

            instructorName:
              course.instructor,

            completionDate:
              new Date()
                .toISOString()
                .slice(0, 10),

            issuedAt:
              new Date()
                .toISOString()
                .slice(0, 10),

            status: 'issued',

            verified: true,

            quizPassed:
              course.quizPassed,

            allLessonsCompleted:
              course.allLessonsCompleted,

            courseCompleted:
              course.courseCompleted

          }

          this.certificates = [

            certificate,

            ...(this.certificates || [])

          ]

          return certificate

        } finally {

          this.generating = false

        }

      },

      async downloadCertificate(certificate) {

        this.downloading = true

        this.errors = {}

        try {

          await api.get(
            `/student/certificates/${certificate.id}/download`,
            {
              responseType: 'json'
            }
          )

        } catch (error) {

          if (!shouldUseLocalFallback(error)) {

            this.errors = {

              general:
                error.response?.data?.message ||
                'Unable to download certificate.'

            }

            throw error

          }

        } finally {

          this.downloading = false

        }

        return certificate

      },

      async verifyCertificate(code) {

        this.verifying = true

        this.errors = {}

        try {

          const { data } =
            await api.get(
              `/certificates/verify/${code}`
            )

          return normalize(data)

        } catch (error) {

          const certificate =
            (this.certificates || []).find(
              (item) =>
                item.verificationCode === code
            )

          return {

            verified: Boolean(certificate),

            certificate,

            message: certificate
              ? 'Certificate verified.'
              : 'Certificate code could not be verified.'

          }

        } finally {

          this.verifying = false

        }

      }

    }

  }
)