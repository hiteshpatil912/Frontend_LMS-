import { createResourceStore } from '@/stores/createResourceStore'

export const useTeacherStudentStore = createResourceStore('teacherStudents', '/teacher/students', [
  { id: 1, name: 'Aisha Rahman', course: 'Product Strategy', progress: '86%', status: 'active' },
  { id: 2, name: 'Mina Patel', course: 'Design Systems', progress: '72%', status: 'active' },
  { id: 3, name: 'Noah Brooks', course: 'Data Storytelling', progress: '54%', status: 'at risk' }
])
