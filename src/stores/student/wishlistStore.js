import { createResourceStore } from '@/stores/createResourceStore'

export const useStudentWishlistStore = createResourceStore('studentWishlist', '/student/wishlist', [
  { id: 1, title: 'AI for Course Creators', level: 'Advanced', price: '$129', lessons: 22, students: 540, description: 'Build assisted learning workflows.' },
  { id: 2, title: 'Finance for Operators', level: 'Beginner', price: '$69', lessons: 18, students: 920, description: 'Budgeting, forecasting, and unit economics.' }
])
