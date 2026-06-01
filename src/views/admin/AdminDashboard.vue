<script setup>
import { onMounted } from 'vue'
import { AcademicCapIcon } from '@heroicons/vue/24/outline'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

import ChartContainer from '@/components/ChartContainer.vue'
import CourseCard from '@/components/CourseCard.vue'
import DashboardCard from '@/components/DashboardCard.vue'
import DataTable from '@/components/DataTable.vue'
import StatsWidget from '@/components/StatsWidget.vue'

import { useAdminCoursesStore } from '@/stores/admin/coursesStore'
import { useAdminDashboardStore } from '@/stores/admin/dashboardStore'

const store = useAdminDashboardStore()
const courses = useAdminCoursesStore()

const metricIcon = AcademicCapIcon

const tabs = ['Activity', 'Featured courses']

const activityColumns = [
  { key: 'user', label: 'User' },
  { key: 'action', label: 'Action' },
  { key: 'status', label: 'Status' }
]

const snapshot = [
  { label: 'Creators', value: 312 },
  { label: 'Reviews', value: 46 },
  { label: 'Tickets', value: 11 }
]

const bars = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 56 },
  { label: 'Wed', value: 48 },
  { label: 'Thu', value: 72 },
  { label: 'Fri', value: 68 },
  { label: 'Sat', value: 81 },
  { label: 'Sun', value: 64 }
]

onMounted(() => {
  courses.fetchCourses()
})
</script>