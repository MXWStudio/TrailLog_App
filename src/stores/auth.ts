import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import SupabaseService from '../services/supabase'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!session.value)
  const userId = computed(() => user.value?.id)

  // 动作
  
  /**
   * 初始化认证状态
   */
  async function initialize() {
    loading.value = true
    
    try {
      // 获取当前用户
      const result = await SupabaseService.getCurrentUser()
      if (result.success && result.user) {
        user.value = result.user
        session.value = result.user // 简化处理，实际项目可能需要获取完整session
      }
      
      // 监听认证状态变化
      SupabaseService.onAuthStateChange((event, session) => {
        console.log('认证状态变化:', event, session)
        
        if (session) {
          user.value = session.user
          this.session = session
        } else {
          user.value = null
          this.session = null
        }
      })
      
    } catch (error) {
      console.error('初始化认证失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 用户注册
   */
  async function signUp(email: string, password: string, userData?: { username?: string }) {
    loading.value = true
    console.log('[AuthStore] signUp action called. Preparing to call SupabaseService.');
    
    try {
      const result = await SupabaseService.signUp(email, password, userData)
      
      if (result.success) {
        console.log('[AuthStore] SupabaseService.signUp succeeded.', result.message);
        return { success: true, message: result.message || '注册成功，请查看邮箱验证链接' }
      } else {
        console.error('[AuthStore] SupabaseService.signUp failed:', result.error);
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('[AuthStore] An unexpected error occurred during signUp:', error);
      return { success: false, error: '发生未知错误' };
    } finally {
      loading.value = false
      console.log('[AuthStore] signUp action finished.');
    }
  }

  /**
   * 用户登录
   */
  async function signIn(email: string, password: string) {
    loading.value = true
    
    try {
      const result = await SupabaseService.signIn(email, password)
      
      if (result.success) {
        user.value = result.data.user
        session.value = result.data.session
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Google第三方登录
   */
  async function signInWithGoogle() {
    loading.value = true
    
    try {
      const result = await SupabaseService.signInWithGoogle()
      return result
    } finally {
      loading.value = false
    }
  }

  /**
   * Apple第三方登录
   */
  async function signInWithApple() {
    loading.value = true
    
    try {
      const result = await SupabaseService.signInWithApple()
      return result
    } finally {
      loading.value = false
    }
  }

  /**
   * 用户登出
   */
  async function signOut() {
    loading.value = true
    
    try {
      const result = await SupabaseService.signOut()
      
      if (result.success) {
        user.value = null
        session.value = null
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户档案
   */
  async function getUserProfile() {
    if (!userId.value) return { success: false, error: '用户未登录' }
    
    loading.value = true
    
    try {
      const result = await SupabaseService.getUserProfile(userId.value)
      return result
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新用户档案
   */
  async function updateUserProfile(updates: any) {
    if (!userId.value) return { success: false, error: '用户未登录' }
    
    loading.value = true
    
    try {
      const result = await SupabaseService.updateUserProfile(userId.value, updates)
      return result
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    user,
    session,
    loading,
    
    // 计算属性
    isAuthenticated,
    userId,
    
    // 动作
    initialize,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    getUserProfile,
    updateUserProfile
  }
}) 