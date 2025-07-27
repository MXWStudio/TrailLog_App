import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// 导入认证store
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 在应用挂载前初始化Supabase认证状态
const authStore = useAuthStore()
authStore.initialize().then(() => {
  console.log('✅ Supabase 认证状态初始化完成')
}).catch((error) => {
  console.error('❌ Supabase 认证状态初始化失败:', error)
})

app.mount('#app')
