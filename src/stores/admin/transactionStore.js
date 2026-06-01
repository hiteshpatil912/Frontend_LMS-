import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { mockPayments } from '@/stores/admin/paymentStore'

const normalize = (data) => data.data || data

export const useAdminTransactionStore = defineStore('adminTransactions', {
  state: () => ({
    transactions: mockPayments.map((payment) => ({
      ...payment,
      gateway: payment.status === 'failed' ? 'Stripe' : 'Razorpay',
      fee: Math.round(Number(payment.amount) * 0.03),
      net: Math.max(0, Number(payment.amount) - Math.round(Number(payment.amount) * 0.03))
    })),
    loading: false,
    errors: {}
  }),
  getters: {
    totalTransactions: (state) => state.transactions.length,
    grossRevenue: (state) => state.transactions.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0),
    netRevenue: (state) => state.transactions.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.net, 0),
    failedTransactions: (state) => state.transactions.filter((item) => item.status === 'failed')
  },
  actions: {
    async fetchTransactions(params = {}) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/admin/transactions', { params })
        this.transactions = normalize(data)
      } catch (error) {
        this.errors = { general: 'Unable to sync transactions. Showing local transaction data.' }
      } finally {
        this.loading = false
      }
    }
  }
})
