import api from '@/services/api'

export const teacherResourceService = {
  getResources: () => api.get('/teacher/resources')
}
