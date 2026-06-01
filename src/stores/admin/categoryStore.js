import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const categoryPermissions = ['manage_courses']

const mockCategories = [
  {
    id: 1,
    name: 'Business',
    slug: 'business',
    description: 'Leadership, operations, product strategy, and business growth.',
    parentId: null,
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    icon: 'Briefcase',
    status: 'active',
    courses: 48
  },
  {
    id: 2,
    name: 'Product Strategy',
    slug: 'product-strategy',
    description: 'Product discovery, roadmaps, experimentation, and market positioning.',
    parentId: 1,
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    icon: 'Map',
    status: 'active',
    courses: 19
  },
  {
    id: 3,
    name: 'Design',
    slug: 'design',
    description: 'Visual design, product design, UX research, and creative systems.',
    parentId: null,
    thumbnail: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',
    icon: 'Swatch',
    status: 'active',
    courses: 35
  },
  {
    id: 4,
    name: 'UX Research',
    slug: 'ux-research',
    description: 'Interview planning, synthesis, research operations, and insight delivery.',
    parentId: 3,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    icon: 'Magnifier',
    status: 'active',
    courses: 14
  },
  {
    id: 5,
    name: 'Technology',
    slug: 'technology',
    description: 'Software, cloud, data, AI, analytics, and technical delivery.',
    parentId: null,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    icon: 'Cpu',
    status: 'active',
    courses: 67
  },
  {
    id: 6,
    name: 'Data Analytics',
    slug: 'data-analytics',
    description: 'Metrics, reporting, dashboards, and data-driven decision workflows.',
    parentId: 5,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    icon: 'Chart',
    status: 'inactive',
    courses: 22
  }
]

const normalize = (data) => data.data || data
const shouldUseLocalFallback = (error) => !error.response || [404, 405].includes(error.response.status)

const buildTree = (categories) => {
  const nodes = categories.map((category) => ({ ...category, children: [] }))
  const byId = new Map(nodes.map((category) => [String(category.id), category]))
  const roots = []

  nodes.forEach((category) => {
    const parent = category.parentId ? byId.get(String(category.parentId)) : null
    if (parent) {
      parent.children.push(category)
      return
    }
    roots.push(category)
  })

  return roots
}

export const useAdminCategoryStore = defineStore('adminCategories', {
  state: () => ({
    categories: [...mockCategories],
    currentCategory: null,
    loading: false,
    saving: false,
    deleting: false,
    errors: {}
  }),
  getters: {
    items: (state) => state.categories,
    totalCategories: (state) => state.categories.length,
    activeCategories: (state) => Array.isArray(state.categories)
  ? state.categories.filter(
      (category) => category.active !== false
    )
  : [],
    categoryTree: (state) => buildTree(state.categories),
    parentOptions: (state) => (excludeId) => state.categories.filter((category) => String(category.id) !== String(excludeId))
  },
  actions: {
    async fetchCategories() {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get('/categories')
this.categories = data.categories || [] 
     } catch (error) {
        this.errors = { general: 'Unable to sync categories. Showing local category data.' }
      } finally {
        this.loading = false
      }
    },
    async fetchSingleCategory(id) {
      this.loading = true
      this.errors = {}
      try {
        const { data } = await api.get(`/categories/${id}`)
        this.currentCategory = normalize(data)
      } catch (error) {
        this.currentCategory = this.categories.find((category) => String(category.id) === String(id)) || null
        if (!this.currentCategory) {
          this.errors = { general: 'Category not found.' }
        }
      } finally {
        this.loading = false
      }
    },
    async createCategory(payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.post('/categories', payload)
        const category = normalize(data)
        this.categories.unshift(category)
        return category
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to create category.' }
          throw error
        }
        const category = { ...payload, id: Date.now(), courses: 0 }
        this.categories.unshift(category)
        return category
      } finally {
        this.saving = false
      }
    },
    async updateCategory(id, payload) {
      this.saving = true
      this.errors = {}
      try {
        const { data } = await api.put(`/categories/${id}`, payload)
        const category = normalize(data)
        this.categories = this.categories.map((item) => (String(item.id) === String(id) ? { ...item, ...category } : item))
        this.currentCategory = { ...this.currentCategory, ...category }
        return category
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = error.response?.data?.errors || { general: error.response?.data?.message || 'Unable to update category.' }
          throw error
        }
        const category = { ...payload, id: Number(id) || id }
        this.categories = this.categories.map((item) => (String(item.id) === String(id) ? { ...item, ...category } : item))
        this.currentCategory = category
        return category
      } finally {
        this.saving = false
      }
    },
    async deleteCategory(id) {
      this.deleting = true
      this.errors = {}
      try {
        await api.delete(`/categories/${id}`)
      } catch (error) {
        if (!shouldUseLocalFallback(error)) {
          this.errors = { general: error.response?.data?.message || 'Unable to delete category.' }
          throw error
        }
      } finally {
        this.categories = this.categories.filter((category) => String(category.id) !== String(id))
        this.categories = this.categories.map((category) => (String(category.parentId) === String(id) ? { ...category, parentId: null } : category))
        this.deleting = false
      }
    }
  }
})
