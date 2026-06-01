import { defineStore } from 'pinia'
import api from '@/plugins/axios'


const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

export const useStudentPaymentStore = defineStore('studentPayments', {
  state: () => ({
    payments: [],
    invoices: [],
    checkoutCourse: { id: 4, title: 'AI for Course Creators', price: 129, instructor: 'Noah Brooks', duration: '4 weeks' },
    loading: false,
    purchasing: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.payments,
    paidPayments: (state) => (state.payments || []).filter((payment) => payment.status === 'paid'),
    totalSpent: (state) => (state.payments || []).filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0)
  },
  actions: {
    async fetchPayments() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/payments')
        this.payments = data.payments || []
      } catch (error) {
        this.errors = { general: 'Unable to sync payments. Showing local payment history.' }
      } finally {
        this.loading = false
      }
    },
    async fetchInvoices() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/invoices')
        this.invoices = data.invoices || [] 
      } catch (error) {
        this.errors = { general: 'Unable to sync invoices. Showing local invoices.' }
      } finally {
        this.loading = false
      }
    },
    async purchaseCourse(course = this.checkoutCourse) {
      this.purchasing = true
      this.errors = {}
      try {
        const { data } = await api.post('/student/payments/purchase-course', { courseId: course.id })
        const payment = data.payment || {}
       this.payments = [
  payment,
  ...(this.payments || [])
]
        return payment
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to complete purchase.' }
          throw error
        }
        const payment = { id: Date.now(), course: course.title, type: 'one_time', amount: course.price, status: 'paid', date: new Date().toISOString().slice(0, 10), invoiceNo: `INV-STU-${Date.now().toString().slice(-4)}` }
        this.payments.unshift(payment)
        this.invoices = [

          {
            id: payment.id,
            invoiceNo: payment.invoiceNo,
            title: payment.course,
            amount: payment.amount,
            status: payment.status,
            issuedAt: payment.date,
            dueAt: payment.date
          },

          ...(this.invoices || [])

        ]
        return payment
      } finally {
        this.purchasing = false
      }
    }
  }
})
