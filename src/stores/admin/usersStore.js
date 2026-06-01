import { createResourceStore } from '@/stores/createResourceStore'

export const useAdminUsersStore = createResourceStore('adminUsers', '/admin/users', [
  { id: 1, name: 'Aisha Rahman', role: 'student', status: 'active', email: 'aisha@example.com' },
  { id: 2, name: 'Daniel Kim', role: 'teacher', status: 'active', email: 'daniel@example.com' },
  { id: 3, name: 'Mina Patel', role: 'student', status: 'pending', email: 'mina@example.com' }
])
