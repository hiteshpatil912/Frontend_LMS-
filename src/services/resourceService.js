import api from '@/plugins/axios'

export const resourceService = (resource) => ({
  list: (params = {}) => api.get(resource, { params }),
  get: (id) => api.get(`${resource}/${id}`),
  create: (payload) => api.post(resource, payload),
  update: (id, payload) => api.put(`${resource}/${id}`, payload),
  remove: (id) => api.delete(`${resource}/${id}`)
})
