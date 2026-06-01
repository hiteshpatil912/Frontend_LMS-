import api from '@/services/api'

export const certificateService = {
  generateCertificate: (courseId) => api.post(`/student/certificates/generate/${courseId}`),
  getCertificates: () => api.get('/student/certificates'),
  getCertificate: (id) => api.get(`/student/certificates/${id}`)
}
