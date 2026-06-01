import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const mockReports = [
  { id: 1, name: 'Revenue Report', type: 'Finance', format: 'CSV', lastExported: '2026-05-18' },
  { id: 2, name: 'Enrollment Report', type: 'Learning', format: 'XLSX', lastExported: '2026-05-17' },
  { id: 3, name: 'Quiz Performance Report', type: 'Assessment', format: 'PDF', lastExported: '2026-05-15' },
  { id: 4, name: 'Instructor Report', type: 'Operations', format: 'CSV', lastExported: '2026-05-12' }
]

export const useAdminReportsStore = defineStore('adminReports', {
  state: () => ({
    reports: mockReports,
    dateRange: {
      from: '2026-05-01',
      to: '2026-05-19'
    },
    loading: false,
    exporting: false,
    errors: {}
  }),
  getters: {
    totalReports: (state) => state.reports.length
  },
  actions: {
    async fetchReports(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/admin/reports', { params })
        this.reports = data.data || data
      } catch (error) {
        this.errors.general = error.response?.data?.message || 'Unable to sync reports. Showing local report templates.'
      } finally {
        this.loading = false
      }
    },
    async exportReport(report) {
      this.exporting = true
      try {
        await api.post(`/admin/reports/${report.id}/export`, {
          from: this.dateRange.from,
          to: this.dateRange.to,
          format: report.format
        })
      } catch {
        // Local UI export stub.
      } finally {
        this.exporting = false
      }
    }
  }
})
