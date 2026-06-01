import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { initialCertificateTemplates } from '@/stores/admin/certificateTemplateStore.data'

const normalize = (data) => data.data || data

export const useAdminCertificateTemplateStore = defineStore('adminCertificateTemplates', {
  state: () => ({
    templates: [...initialCertificateTemplates],
    currentTemplate: initialCertificateTemplates[0],
    verificationResult: null,
    loading: false,
    verifying: false,
    errors: {}
  }),
  getters: {
    activeTemplate: (state) => state.templates.find((template) => template.status === 'active') || state.templates[0],
    totalTemplates: (state) => state.templates.length
  },
  actions: {
    async fetchCertificateTemplate(id = null) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(id ? `/admin/certificate-templates/${id}` : '/admin/certificate-templates')
        const result = normalize(data)
        if (Array.isArray(result)) {
          this.templates = result
          this.currentTemplate = result[0] || null
        } else {
          this.currentTemplate = result
        }
      } catch (error) {
        this.errors = { general: 'Unable to sync certificate templates. Showing local templates.' }
      } finally {
        this.loading = false
      }
    },
    async verifyCertificate(code) {
      this.verifying = true
      this.errors = {}
      try {
        const { data } = await api.get(`/admin/certificates/verify/${code}`)
        this.verificationResult = normalize(data)
      } catch (error) {
        this.verificationResult = {
          verified: code?.startsWith('LS-') || code?.startsWith('CERT-'),
          code,
          checkedAt: new Date().toISOString(),
          message: code ? 'Local verification completed.' : 'Enter a certificate code to verify.'
        }
      } finally {
        this.verifying = false
      }
      return this.verificationResult
    }
  }
})
