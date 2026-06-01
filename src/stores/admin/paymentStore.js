import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const mockPayments = [
  { id: 1, customer: 'Aisha Rahman', course: 'Product Strategy Masterclass', type: 'one_time', amount: 149, status: 'paid', date: '2026-05-18', invoiceNo: 'INV-2026-1001' },
  { id: 2, customer: 'Noah Brooks', course: 'LearnSphere Pro Monthly', type: 'monthly', amount: 29, status: 'paid', date: '2026-05-17', invoiceNo: 'INV-2026-1002' },
  { id: 3, customer: 'Mina Patel', course: 'UX Research Systems', type: 'one_time', amount: 99, status: 'failed', date: '2026-05-16', invoiceNo: 'INV-2026-1003' },
  { id: 4, customer: 'Sofia Chen', course: 'LearnSphere Pro Yearly', type: 'yearly', amount: 249, status: 'refunded', date: '2026-05-14', invoiceNo: 'INV-2026-1004' }
]

const normalize = (data) => data.data || data

export const useAdminPaymentStore = defineStore('adminPayments', {
  state: () => ({
    payments: [...mockPayments],
    loading: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.payments,
    revenue: (state) => state.payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + Number(payment.amount), 0),
    pendingCount: (state) => state.payments.filter((payment) => payment.status === 'pending').length,
    refundedTotal: (state) => state.payments.filter((payment) => payment.status === 'refunded').reduce((sum, payment) => sum + Number(payment.amount), 0)
  },
  actions: {
    async fetchPayments(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/admin/payments', { params })
        this.payments = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync payments. Showing local payment data.' }
      } finally {
        this.loading = false
      }
    }
  }
})
