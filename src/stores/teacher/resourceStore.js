import { createResourceModuleStore, mockResources } from '@/stores/admin/resourceStore'

const teacherResources = mockResources.filter((resource) => [1, 2].includes(resource.courseId))

export const useTeacherResourceStore = createResourceModuleStore('teacherResources', '/teacher/resources', teacherResources)
