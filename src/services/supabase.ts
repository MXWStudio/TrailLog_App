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
      console.log('[SupabaseService] 开始注册流程...');
      
      console.log('[SupabaseService] 步骤1: 调用 supabase.auth.signUp 创建认证用户...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      })
      
      if (error) throw error
      if (!data.user) throw new Error('注册成功但未返回用户信息')
      console.log('[SupabaseService] 步骤1成功: 认证用户已创建, 用户ID:', data.user.id);

      // 在 public.users 表中创建对应的用户记录
      console.log('[SupabaseService] 步骤2: 向 public.users 表插入新用户记录...');
      
      // 准备用户数据
      const userRecord = {
        id: data.user.id,
        email: data.user.email,
        username: userData?.username || email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('[SupabaseService] 准备插入的用户数据:', userRecord);
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([userRecord])

      if (insertError) {
        console.error('[SupabaseService] 步骤2失败: 在 public.users 表中创建用户记录失败:', insertError)
        
        // 如果插入失败，尝试检查表结构
        console.log('[SupabaseService] 尝试检查 users 表结构...');
        const { data: tableInfo, error: tableError } = await supabase
          .from('users')
          .select('*')
          .limit(1)
        
        if (tableError) {
          console.error('[SupabaseService] 无法访问 users 表，可能需要先创建表结构:', tableError);
          console.log('[SupabaseService] 请确保已执行 database_schema.sql 脚本');
        }
        
        // 即使插入失败，我们也返回成功，因为认证用户已经创建
        // 用户可以在后续手动创建用户记录
        console.log('[SupabaseService] 认证用户创建成功，但用户记录插入失败。用户需要手动完成设置。');
      } else {
        console.log('[SupabaseService] 步骤2成功: public.users 表记录已插入。');
      }

      console.log('[SupabaseService] 注册流程全部完成。');
      return { 
        success: true, 
        data,
        message: '注册成功！请查看邮箱验证链接完成注册。'
      }
    } catch (error) {
      console.error('[SupabaseService] 注册流程出现严重错误:', error)
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
   * Google第三方登录
   */
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Google登录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Apple第三方登录
   */
  static async signInWithApple() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Apple登录失败:', error)
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