<template>
  <div class="supabase-example p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Supabase 功能演示</h2>
    
    <!-- 认证状态显示 -->
    <div class="mb-6 p-4 rounded-lg" :class="authStore.isAuthenticated ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'">
      <div class="flex items-center mb-2">
        <div class="w-3 h-3 rounded-full mr-2" :class="authStore.isAuthenticated ? 'bg-green-500' : 'bg-gray-400'"></div>
        <span class="font-medium">{{ authStore.isAuthenticated ? '已登录' : '未登录' }}</span>
      </div>
      
      <div v-if="authStore.isAuthenticated && authStore.user" class="text-sm text-gray-600">
        <p>用户ID: {{ authStore.userId }}</p>
        <p>邮箱: {{ authStore.user.email }}</p>
      </div>
    </div>

    <!-- 登录/注册表单 -->
    <div v-if="!authStore.isAuthenticated" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
        <input 
          v-model="email"
          type="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入邮箱"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
        <input 
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入密码"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">用户名（可选）</label>
        <input 
          v-model="username"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入用户名"
        />
      </div>

      <div class="flex space-x-2">
        <button 
          @click="handleSignIn"
          :disabled="authStore.loading || !email || !password"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
        
        <button 
          @click="handleSignUp"
          :disabled="authStore.loading || !email || !password"
          class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
      </div>
    </div>

    <!-- 用户操作 -->
    <div v-if="authStore.isAuthenticated" class="space-y-4">
      <button 
        @click="handleSignOut"
        :disabled="authStore.loading"
        class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {{ authStore.loading ? '登出中...' : '登出' }}
      </button>
      
      <button 
        @click="loadTrails"
        :disabled="loadingTrails"
        class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {{ loadingTrails ? '加载中...' : '加载路线数据' }}
      </button>
      
      <!-- 路线数据展示 -->
      <div v-if="trails.length > 0" class="mt-4">
        <h3 class="font-medium text-gray-700 mb-2">路线列表：</h3>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div 
            v-for="trail in trails" 
            :key="trail.id"
            class="p-2 bg-gray-50 rounded text-sm"
          >
            <div class="font-medium">{{ trail.name }}</div>
            <div class="text-gray-600">{{ trail.distance }}km · {{ trail.difficulty }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="mt-4 p-3 rounded-md" :class="message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'">
      {{ message.text }}
    </div>

    <!-- 配置提示 -->
    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <h4 class="font-medium text-yellow-800 mb-2">⚠️ 配置提醒</h4>
      <p class="text-sm text-yellow-700">
        请确保在 `.env.local` 文件中配置了 `VITE_SUPABASE_KEY` 环境变量。
        详细配置说明请查看 `ENV_SETUP.md` 文件。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import SupabaseService from '../services/supabase'

// 状态管理
const authStore = useAuthStore()

// 表单数据
const email = ref('')
const password = ref('')
const username = ref('')

// 路线数据
const trails = ref([])
const loadingTrails = ref(false)

// 消息提示
const message = ref<{ type: 'success' | 'error', text: string } | null>(null)

// 显示消息
function showMessage(type: 'success' | 'error', text: string) {
  message.value = { type, text }
  setTimeout(() => {
    message.value = null
  }, 5000)
}

// 处理登录
async function handleSignIn() {
  const result = await authStore.signIn(email.value, password.value)
  
  if (result.success) {
    showMessage('success', '登录成功！')
    email.value = ''
    password.value = ''
  } else {
    showMessage('error', `登录失败：${result.error}`)
  }
}

// 处理注册
async function handleSignUp() {
  const userData = username.value ? { username: username.value } : undefined
  const result = await authStore.signUp(email.value, password.value, userData)
  
  if (result.success) {
    showMessage('success', result.message || '注册成功！')
    email.value = ''
    password.value = ''
    username.value = ''
  } else {
    showMessage('error', `注册失败：${result.error}`)
  }
}

// 处理登出
async function handleSignOut() {
  const result = await authStore.signOut()
  
  if (result.success) {
    showMessage('success', '已成功登出')
    trails.value = []
  } else {
    showMessage('error', `登出失败：${result.error}`)
  }
}

// 加载路线数据
async function loadTrails() {
  loadingTrails.value = true
  
  try {
    const result = await SupabaseService.getTrails()
    
    if (result.success) {
      trails.value = result.data || []
      showMessage('success', `成功加载 ${trails.value.length} 条路线`)
    } else {
      showMessage('error', `加载路线失败：${result.error}`)
    }
  } finally {
    loadingTrails.value = false
  }
}
</script>

<style scoped>
/* 组件样式已通过 Tailwind CSS 类处理 */
</style> 