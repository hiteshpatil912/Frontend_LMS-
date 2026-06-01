import { defineStore } from 'pinia'
import api from '@/plugins/axios'

const mockDashboardStats = {
  totalStudents: 24840,
  totalTeachers: 312,
  totalCourses: 186,
  enrollments: 5120,
  revenue: 92400,
  quizCompletions: 18420,
  activeUsers: 7640
}

const mockRevenueStats = {
  monthly: [
    { label: 'Jan', value: 52000 },
    { label: 'Feb', value: 61000 },
    { label: 'Mar', value: 68000 },
    { label: 'Apr', value: 74800 },
    { label: 'May', value: 92400 },
    { label: 'Jun', value: 101200 }
  ],
  byPlan: [
    { label: 'Single courses', value: 42 },
    { label: 'Subscriptions', value: 38 },
    { label: 'Enterprise', value: 20 }
  ]
}

const mockStudentStats = {
  growth: [
    { label: 'Jan', value: 18000 },
    { label: 'Feb', value: 19600 },
    { label: 'Mar', value: 21100 },
    { label: 'Apr', value: 22600 },
    { label: 'May', value: 24840 }
  ],
  enrollmentStats: [
    { label: 'Business', value: 1520 },
    { label: 'Design', value: 980 },
    { label: 'Technology', value: 1860 },
    { label: 'Marketing', value: 760 }
  ]
}

const mockCourseStats = {
  topCourses: [
    { id: 1, title: 'Product Strategy Masterclass', enrollments: 1260, revenue: '$188,740', completion: '76%' },
    { id: 2, title: 'Data Analytics for Teams', enrollments: 1730, revenue: '$136,670', completion: '68%' },
    { id: 3, title: 'UX Research Systems', enrollments: 840, revenue: '$83,160', completion: '81%' }
  ],
  topTeachers: [
    { id: 1, name: 'Daniel Kim', courses: 12, students: 4260, rating: 4.9 },
    { id: 2, name: 'Mina Patel', courses: 8, students: 3180, rating: 4.8 },
    { id: 3, name: 'Aisha Rahman', courses: 10, students: 3910, rating: 4.7 }
  ],
  quizPerformance: [
    { label: 'Passed', value: 72 },
    { label: 'Failed', value: 18 },
    { label: 'Retaking', value: 10 }
  ],
  recentActivities: [
    { id: 1, title: 'New enterprise cohort enrolled', time: '10 min ago', type: 'Enrollment' },
    { id: 2, title: 'Data Analytics crossed 1.7k students', time: '1 hour ago', type: 'Course' },
    { id: 3, title: 'Quiz completion rate improved by 8%', time: '3 hours ago', type: 'Quiz' },
    { id: 4, title: 'Monthly revenue report generated', time: 'Yesterday', type: 'Report' }
  ]
}

const normalize = (data) => data.data || data

export const useAdminAnalyticsStore = defineStore('adminAnalytics', {
  state: () => ({
    dashboardStats: mockDashboardStats,
    revenueStats: mockRevenueStats,
    studentStats: mockStudentStats,
    courseStats: mockCourseStats,
    loading: false,
    errors: {}
  }),
  getters: {
    summaryCards: (state) => [
      { label: 'Total students', value: state.dashboardStats.totalStudents, trend: '+12.5%' },
      { label: 'Total teachers', value: state.dashboardStats.totalTeachers, trend: '+4.2%' },
      { label: 'Total courses', value: state.dashboardStats.totalCourses, trend: '+8.2%' },
      { label: 'Enrollments', value: state.dashboardStats.enrollments, trend: '+16.8%' },
      { label: 'Revenue', value: `$${state.dashboardStats.revenue.toLocaleString()}`, trend: '+18.1%' },
      { label: 'Quiz completions', value: state.dashboardStats.quizCompletions, trend: '+9.4%' },
      { label: 'Active users', value: state.dashboardStats.activeUsers, trend: '+6.6%' }
    ]
  },
  actions: {
    async fetchDashboardStats() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/admin/analytics/dashboard')
        this.dashboardStats = normalize(data)
      } catch (error) {
        this.errors.general = error.response?.data?.message || 'Unable to sync dashboard analytics. Showing local data.'
      } finally {
        this.loading = false
      }
    },
    async fetchRevenueAnalytics() {
      try {
        const { data } = await api.get('/admin/analytics/revenue')
        this.revenueStats = normalize(data)
      } catch {}
    },
    async fetchStudentAnalytics() {
      try {
        const { data } = await api.get('/admin/analytics/students')
        this.studentStats = normalize(data)
      } catch {}
    },
    async fetchCourseAnalytics() {
      try {
        const { data } = await api.get('/admin/analytics/admin/courses')
        this.courseStats = normalize(data)
      } catch {}
    },
    async fetchAllAnalytics() {
      await Promise.all([
        this.fetchDashboardStats(),
        this.fetchRevenueAnalytics(),
        this.fetchStudentAnalytics(),
        this.fetchCourseAnalytics()
      ])
    }
  }
})
