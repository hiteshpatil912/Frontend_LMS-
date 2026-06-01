import { createResourceModuleStore } from '@/stores/admin/resourceStore'

const studentResources = []

export const useStudentLearningResourceStore = createResourceModuleStore('studentLearningResources', '/student/resources', studentResources)
