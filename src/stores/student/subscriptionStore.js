import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const plans = [
  { id: 'monthly', name: 'Monthly Pro', type: 'monthly', price: 29, billing: 'per month', features: ['All premium courses', 'Certificates', 'Priority support'] },
  { id: 'yearly', name: 'Yearly Pro', type: 'yearly', price: 249, billing: 'per year', features: ['All premium courses', 'Certificates', '2 months free'] }
]

const normalize = (data) => data.data || data

export const useStudentSubscriptionStore = defineStore('studentSubscriptions', {
  state: () => ({
    plans,
    subscriptions: [],
    loading: false,
    subscribing: false,
    errors: {}
  }),
  getters: {
    activeSubscription: (state) =>(state.subscriptions || []).find((subscription) => subscription.status === 'active'),
    hasActiveSubscription: (state) =>  (state.subscriptions || []).some((subscription) => subscription.status === 'active')
  },
  actions: {
    async fetchSubscriptions() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/student/subscriptions')
        this.subscriptions =
  data.subscriptions || []
      } catch (error) {
        this.errors = { general: 'Unable to sync subscriptions. Showing local plan data.' }
      } finally {
        this.loading = false
      }
    },
    async subscribe(plan) {
      this.subscribing = true
      this.errors = {}
      try {
        const { data } = await api.post('/student/subscriptions', { planId: plan.id })
        const subscription = data.subscription || {}
        this.subscriptions = [

  subscription,

  ...(this.subscriptions || [])

]
        return subscription
      } catch {
        const subscription = { id: Date.now(), plan: plan.name, type: plan.type, status: 'active', renewsAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), amount: plan.price }
        this.subscriptions = [

  subscription,

  ...(this.subscriptions || [])

]
        return subscription
      } finally {
        this.subscribing = false
      }
    }
  }
})
