import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useBreadcrumbs() {
  const route = useRoute()

  const breadcrumbs = computed(() =>
    route.matched
      .filter((record) => record.meta?.breadcrumb)
      .map((record) => ({
        label: record.meta.breadcrumb,
        path: record.path
      }))
  )

  return { breadcrumbs }
}
