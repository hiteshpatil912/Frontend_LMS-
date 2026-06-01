import { createResourceStore } from '@/stores/createResourceStore'

export const useStudentLessonStore = createResourceStore('studentLessons', '/student/lessons', [
  { id: 1, title: 'Interview Planning', duration: '24 min', course: 'UX Research Systems', status: 'completed' },
  { id: 2, title: 'Synthesis Wall', duration: '36 min', course: 'UX Research Systems', status: 'in progress' },
  { id: 3, title: 'Metric Trees', duration: '42 min', course: 'Data Analytics', status: 'locked' }
])
