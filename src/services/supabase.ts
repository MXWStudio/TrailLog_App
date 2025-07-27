import { supabase } from '../utils/supabase'
import type { Database } from '../utils/supabase'

// 类型别名
type Tables = Database['public']['Tables']
type TrailRow = Tables['trails']['Row']
type TrailInsert = Tables['trails']['Insert']
type UserRow = Tables['users']['Row']

export class SupabaseService {
  
  // ====== 认证相关方法 ======
  
  /**
   * 用户注册
   */
  static async signUp(email: string, password: string, userData?: { username?: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 用户登录
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 用户登出
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('登出失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 获取当前用户
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, user }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 监听认证状态变化
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // ====== 徒步路线相关方法 ======

  /**
   * 获取所有徒步路线
   */
  static async getTrails() {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('获取路线失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 根据ID获取单个路线
   */
  static async getTrailById(id: string) {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('获取路线详情失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 创建新的徒步路线
   */
  static async createTrail(trailData: TrailInsert) {
    try {
      const { data, error } = await supabase
        .from('trails')
        .insert([trailData])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('创建路线失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 更新徒步路线
   */
  static async updateTrail(id: string, updates: Partial<TrailRow>) {
    try {
      const { data, error } = await supabase
        .from('trails')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('更新路线失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 删除徒步路线
   */
  static async deleteTrail(id: string) {
    try {
      const { error } = await supabase
        .from('trails')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('删除路线失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 根据用户ID获取路线
   */
  static async getTrailsByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('获取用户路线失败:', error)
      return { success: false, error: error.message }
    }
  }

  // ====== 用户信息相关方法 ======

  /**
   * 获取用户档案
   */
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('获取用户档案失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 更新用户档案
   */
  static async updateUserProfile(userId: string, updates: Partial<UserRow>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('更新用户档案失败:', error)
      return { success: false, error: error.message }
    }
  }

  // ====== 文件上传相关方法 ======

  /**
   * 上传文件到Supabase Storage
   */
  static async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('文件上传失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 获取文件的公共URL
   */
  static getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  /**
   * 删除文件
   */
  static async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('文件删除失败:', error)
      return { success: false, error: error.message }
    }
  }

  // ====== 实时订阅相关方法 ======

  /**
   * 订阅表的变化
   */
  static subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe()
  }

  /**
   * 取消订阅
   */
  static unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription)
  }
}

// 导出默认实例
export default SupabaseService 