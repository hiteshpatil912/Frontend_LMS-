import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth/authStore'
import '@/assets/main.css'
import '@/plugins/axios'

const pinia = createPinia()

window.addEventListener('auth:unauthorized', async () => {
  const auth = useAuthStore()
  auth.clearSession()
  if (router.currentRoute.value.name !== 'login') {
    router.push('/login')
  }
})

window.addEventListener('auth:forbidden', () => {
  if (router.currentRoute.value.name !== 'forbidden') {
    router.push('/403')
  }
})

createApp(App).use(pinia).use(router).mount('#app')
