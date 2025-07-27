import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://gaxjvkvudzrwyochicps.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// 检查环境变量是否配置
if (!supabaseKey) {
  console.error('错误：缺少VITE_SUPABASE_KEY环境变量，请在.env.local文件中配置')
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // 配置认证选项
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
  // 其他配置选项
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'traillog-app'
    }
  }
})

// 导出Supabase URL（用于某些需要URL的场景）
export { supabaseUrl }

// TrailLog应用完整类型定义
export interface Database {
  public: {
    Tables: {
      // 用户基础信息表
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          total_distance: number
          total_activities: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          total_distance?: number
          total_activities?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          total_distance?: number
          total_activities?: number
          updated_at?: string
        }
      }
      
      // 用户详细档案表
      user_profiles: {
        Row: {
          id: string
          user_id: string
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          height: number | null
          weight: number | null
          fitness_level: number
          preferred_difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          medical_conditions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          height?: number | null
          weight?: number | null
          fitness_level?: number
          preferred_difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          height?: number | null
          weight?: number | null
          fitness_level?: number
          preferred_difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_conditions?: string | null
          updated_at?: string
        }
      }

      // 徒步路线表（扩展版）
      trails: {
        Row: {
          id: string
          name: string
          description: string | null
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          distance: number
          elevation_gain: number | null
          elevation_max: number | null
          duration: number | null
          location: string
          country: string
          province: string | null
          city: string | null
          rating: number
          rating_count: number
          view_count: number
          bookmark_count: number
          season_best: string | null
          features: string[] | null
          warnings: string | null
          equipment_needed: string[] | null
          trail_type: 'hiking' | 'climbing' | 'cycling' | 'running'
          is_verified: boolean
          is_public: boolean
          creator_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          distance: number
          elevation_gain?: number | null
          elevation_max?: number | null
          duration?: number | null
          location: string
          country?: string
          province?: string | null
          city?: string | null
          rating?: number
          rating_count?: number
          view_count?: number
          bookmark_count?: number
          season_best?: string | null
          features?: string[] | null
          warnings?: string | null
          equipment_needed?: string[] | null
          trail_type?: 'hiking' | 'climbing' | 'cycling' | 'running'
          is_verified?: boolean
          is_public?: boolean
          creator_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme'
          distance?: number
          elevation_gain?: number | null
          elevation_max?: number | null
          duration?: number | null
          location?: string
          country?: string
          province?: string | null
          city?: string | null
          rating?: number
          rating_count?: number
          view_count?: number
          bookmark_count?: number
          season_best?: string | null
          features?: string[] | null
          warnings?: string | null
          equipment_needed?: string[] | null
          trail_type?: 'hiking' | 'climbing' | 'cycling' | 'running'
          is_verified?: boolean
          is_public?: boolean
          updated_at?: string
        }
      }

      // 路线图片表
      trail_images: {
        Row: {
          id: string
          trail_id: string
          image_url: string
          image_type: 'photo' | 'map' | 'profile'
          caption: string | null
          is_primary: boolean
          sort_order: number
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trail_id: string
          image_url: string
          image_type?: 'photo' | 'map' | 'profile'
          caption?: string | null
          is_primary?: boolean
          sort_order?: number
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          image_url?: string
          image_type?: 'photo' | 'map' | 'profile'
          caption?: string | null
          is_primary?: boolean
          sort_order?: number
        }
      }

      // 路线GPS坐标点表
      trail_coordinates: {
        Row: {
          id: string
          trail_id: string
          latitude: number
          longitude: number
          altitude: number | null
          point_order: number
          point_type: 'start' | 'waypoint' | 'summit' | 'rest' | 'end' | 'danger'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trail_id: string
          latitude: number
          longitude: number
          altitude?: number | null
          point_order: number
          point_type?: 'start' | 'waypoint' | 'summit' | 'rest' | 'end' | 'danger'
          description?: string | null
          created_at?: string
        }
        Update: {
          latitude?: number
          longitude?: number
          altitude?: number | null
          point_order?: number
          point_type?: 'start' | 'waypoint' | 'summit' | 'rest' | 'end' | 'danger'
          description?: string | null
        }
      }

      // 用户帖子表
      posts: {
        Row: {
          id: string
          user_id: string
          trail_id: string | null
          title: string
          content: string | null
          location: string | null
          activity_date: string | null
          distance: number | null
          duration: number | null
          elevation_gain: number | null
          rating: number | null
          weather: string | null
          difficulty_felt: 'easy' | 'moderate' | 'hard' | 'extreme' | null
          like_count: number
          comment_count: number
          view_count: number
          is_public: boolean
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trail_id?: string | null
          title: string
          content?: string | null
          location?: string | null
          activity_date?: string | null
          distance?: number | null
          duration?: number | null
          elevation_gain?: number | null
          rating?: number | null
          weather?: string | null
          difficulty_felt?: 'easy' | 'moderate' | 'hard' | 'extreme' | null
          like_count?: number
          comment_count?: number
          view_count?: number
          is_public?: boolean
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          content?: string | null
          location?: string | null
          activity_date?: string | null
          distance?: number | null
          duration?: number | null
          elevation_gain?: number | null
          rating?: number | null
          weather?: string | null
          difficulty_felt?: 'easy' | 'moderate' | 'hard' | 'extreme' | null
          like_count?: number
          comment_count?: number
          view_count?: number
          is_public?: boolean
          tags?: string[] | null
          updated_at?: string
        }
      }

      // 帖子图片表
      post_images: {
        Row: {
          id: string
          post_id: string
          image_url: string
          caption: string | null
          sort_order: number
          is_cover: boolean
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          image_url: string
          caption?: string | null
          sort_order?: number
          is_cover?: boolean
          created_at?: string
        }
        Update: {
          image_url?: string
          caption?: string | null
          sort_order?: number
          is_cover?: boolean
        }
      }

      // 评论表
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          like_count: number
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          parent_id?: string | null
          content: string
          like_count?: number
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          like_count?: number
          is_deleted?: boolean
          updated_at?: string
        }
      }

      // 点赞表
      likes: {
        Row: {
          id: string
          user_id: string
          target_type: 'post' | 'comment'
          target_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: 'post' | 'comment'
          target_id: string
          created_at?: string
        }
        Update: never
      }

      // 收藏表
      bookmarks: {
        Row: {
          id: string
          user_id: string
          target_type: 'trail' | 'post'
          target_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: 'trail' | 'post'
          target_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          notes?: string | null
        }
      }

      // 用户活动记录表
      user_activities: {
        Row: {
          id: string
          user_id: string
          trail_id: string | null
          post_id: string | null
          activity_type: 'hiking' | 'climbing' | 'cycling' | 'running'
          title: string
          start_time: string | null
          end_time: string | null
          distance: number | null
          duration: number | null
          elevation_gain: number | null
          max_speed: number | null
          avg_speed: number | null
          calories_burned: number | null
          max_heart_rate: number | null
          avg_heart_rate: number | null
          weather: string | null
          temperature: number | null
          notes: string | null
          gpx_data: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trail_id?: string | null
          post_id?: string | null
          activity_type?: 'hiking' | 'climbing' | 'cycling' | 'running'
          title: string
          start_time?: string | null
          end_time?: string | null
          distance?: number | null
          duration?: number | null
          elevation_gain?: number | null
          max_speed?: number | null
          avg_speed?: number | null
          calories_burned?: number | null
          max_heart_rate?: number | null
          avg_heart_rate?: number | null
          weather?: string | null
          temperature?: number | null
          notes?: string | null
          gpx_data?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          trail_id?: string | null
          post_id?: string | null
          activity_type?: 'hiking' | 'climbing' | 'cycling' | 'running'
          title?: string
          start_time?: string | null
          end_time?: string | null
          distance?: number | null
          duration?: number | null
          elevation_gain?: number | null
          max_speed?: number | null
          avg_speed?: number | null
          calories_burned?: number | null
          max_heart_rate?: number | null
          avg_heart_rate?: number | null
          weather?: string | null
          temperature?: number | null
          notes?: string | null
          gpx_data?: string | null
          is_completed?: boolean
          updated_at?: string
        }
      }

      // 活动照片表
      activity_photos: {
        Row: {
          id: string
          activity_id: string
          image_url: string
          latitude: number | null
          longitude: number | null
          caption: string | null
          taken_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          image_url: string
          latitude?: number | null
          longitude?: number | null
          caption?: string | null
          taken_at?: string | null
          created_at?: string
        }
        Update: {
          image_url?: string
          latitude?: number | null
          longitude?: number | null
          caption?: string | null
          taken_at?: string | null
        }
      }

      // 用户关注表
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: never
      }

      // 应用配置表
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string | null
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: string | null
          description?: string | null
          updated_at?: string
        }
        Update: {
          setting_value?: string | null
          description?: string | null
          updated_at?: string
        }
      }
    }
    
    Views: {
      // 路线详情视图
      trail_details: {
        Row: {
          id: string
          name: string
          description: string | null
          difficulty: 'easy' | 'moderate' | 'hard' | 'extreme'
          distance: number
          location: string
          rating: number
          primary_image: string | null
          post_count: number
          bookmark_count_real: number
          avg_user_rating: number | null
        }
      }
      
      // 用户统计视图
      user_stats: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          post_count: number
          activity_count: number
          following_count: number
          follower_count: number
          total_distance_real: number
          total_elevation: number
        }
      }
      
      // 帖子详情视图
      post_details: {
        Row: {
          id: string
          title: string
          content: string | null
          location: string | null
          activity_date: string | null
          distance: number | null
          duration: number | null
          elevation_gain: number | null
          username: string | null
          avatar_url: string | null
          trail_name: string | null
          cover_image: string | null
          like_count: number
          comment_count: number
          view_count: number
          created_at: string
        }
      }
    }

    Functions: {
      // 辅助查询函数
      user_has_liked: {
        Args: {
          user_uuid: string
          target_type_param: 'post' | 'comment'
          target_id_param: string
        }
        Returns: boolean
      }
      
      user_has_bookmarked: {
        Args: {
          user_uuid: string
          target_type_param: 'trail' | 'post'
          target_id_param: string
        }
        Returns: boolean
      }
      
      user_is_following: {
        Args: {
          follower_uuid: string
          following_uuid: string
        }
        Returns: boolean
      }
      
      get_storage_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      
      get_user_file_stats: {
        Args: {
          user_uuid?: string
        }
        Returns: Json
      }
      
      batch_upload_trail_images: {
        Args: {
          trail_uuid: string
          image_urls: string[]
          captions?: string[]
        }
        Returns: Json
      }
    }
  }
}

// 为TypeScript提供类型化的Supabase客户端
export type SupabaseClient = typeof supabase 