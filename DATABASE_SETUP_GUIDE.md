# TrailLog 数据库设置完整指南

> 🎯 为你的TrailLog应用设置完整的Supabase数据库，包含用户认证、徒步路线管理、社区功能等

## 📋 概述

本指南将帮你设置一个功能完整的TrailLog数据库，包含：

- **👥 用户管理系统** - 完整的用户认证和档案管理
- **🗺️ 徒步路线系统** - 路线信息、图片、GPS坐标管理
- **💬 社区功能** - 帖子、评论、点赞、收藏系统
- **📊 活动记录** - 用户徒步活动记录和统计
- **📁 文件存储** - 图片和GPX文件管理
- **🔒 安全策略** - 完整的行级安全(RLS)配置

## 🚀 快速开始

### 第一步：准备工作

1. **确保Supabase项目已创建**
   - 项目URL: `https://hklkdmochyykuyrwjbhy.supabase.co`
   - 获取你的 `anon key` 并配置到 `.env.local`

2. **检查环境变量**
   ```bash
   # .env.local
   VITE_SUPABASE_KEY=你的supabase_anon_key
   VITE_AMAP_API_KEY=你的高德地图API_KEY
   VITE_APP_NAME=TrailLog
   VITE_APP_VERSION=1.0.0
   ```

### 第二步：执行数据库脚本

按以下顺序在Supabase SQL编辑器中执行：

#### 1. 创建数据库结构
```sql
-- 复制并执行 database_schema.sql 中的内容
-- 这将创建所有数据表、索引、视图和基础配置
```

#### 2. 配置安全策略
```sql
-- 复制并执行 database_security.sql 中的内容
-- 这将启用RLS并配置所有安全策略
```

#### 3. 设置存储桶（可选）
```sql
-- 复制并执行 storage_setup.sql 中的内容
-- 这将创建图片和文件存储桶
```

### 第三步：测试数据库连接

```bash
# 安装测试依赖（如果还没有）
npm install @supabase/supabase-js

# 运行测试脚本
node test-database.js
```

## 📊 数据库结构详解

### 🏗️ 核心表结构

#### 1. 用户相关表

**users** - 用户基础信息
```sql
- id (UUID) - 用户唯一标识
- email (VARCHAR) - 邮箱
- username (VARCHAR) - 用户名
- avatar_url (VARCHAR) - 头像链接
- experience_level (ENUM) - 经验等级：beginner/intermediate/advanced/expert
- total_distance (DECIMAL) - 总徒步距离
- total_activities (INT) - 总活动次数
```

**user_profiles** - 用户详细档案
```sql
- user_id (UUID) - 关联用户ID
- birth_date (DATE) - 生日
- gender (ENUM) - 性别：male/female/other
- fitness_level (INT) - 体能等级 1-5
- emergency_contact_* - 紧急联系人信息
- medical_conditions (TEXT) - 医疗状况
```

#### 2. 徒步路线相关表

**trails** - 徒步路线主表
```sql
- id (UUID) - 路线唯一标识
- name (VARCHAR) - 路线名称
- difficulty (ENUM) - 难度：easy/moderate/hard/extreme
- distance (DECIMAL) - 距离（公里）
- elevation_gain (INT) - 海拔增益（米）
- location (VARCHAR) - 位置信息
- rating (DECIMAL) - 评分 0-5
- features (TEXT[]) - 路线特色数组
- equipment_needed (TEXT[]) - 所需装备数组
```

**trail_images** - 路线图片管理
```sql
- trail_id (UUID) - 关联路线ID
- image_url (VARCHAR) - 图片链接
- image_type (ENUM) - 图片类型：photo/map/profile
- is_primary (BOOLEAN) - 是否为主图
```

**trail_coordinates** - GPS坐标点
```sql
- trail_id (UUID) - 关联路线ID
- latitude/longitude (DECIMAL) - 经纬度
- point_type (ENUM) - 点类型：start/waypoint/summit/rest/end/danger
- point_order (INT) - 点的顺序
```

#### 3. 社区功能相关表

**posts** - 用户帖子
```sql
- user_id (UUID) - 发帖用户ID
- trail_id (UUID) - 关联路线ID（可选）
- title (VARCHAR) - 帖子标题
- activity_date (DATE) - 活动日期
- distance/duration/elevation_gain - 实际徒步数据
- rating (INT) - 用户对路线的评分
- like_count/comment_count - 统计数据
```

**comments** - 评论系统
```sql
- post_id (UUID) - 关联帖子ID
- user_id (UUID) - 评论用户ID
- parent_id (UUID) - 父评论ID（支持回复）
- content (TEXT) - 评论内容
```

**likes** - 点赞系统
```sql
- user_id (UUID) - 点赞用户ID
- target_type (ENUM) - 目标类型：post/comment
- target_id (UUID) - 目标对象ID
```

**bookmarks** - 收藏系统
```sql
- user_id (UUID) - 收藏用户ID
- target_type (ENUM) - 收藏类型：trail/post
- target_id (UUID) - 目标对象ID
- notes (TEXT) - 收藏备注
```

#### 4. 活动记录相关表

**user_activities** - 用户活动记录
```sql
- user_id (UUID) - 用户ID
- trail_id (UUID) - 关联路线ID
- activity_type (ENUM) - 活动类型：hiking/climbing/cycling/running
- start_time/end_time - 开始/结束时间
- distance/duration/elevation_gain - 实际数据
- gpx_data (TEXT) - GPX轨迹数据
- heart_rate/speed - 运动数据
```

### 🔍 数据视图

#### trail_details - 路线详情视图
包含路线基础信息 + 统计数据（帖子数量、收藏数量、用户评分等）

#### user_stats - 用户统计视图
包含用户基础信息 + 活动统计（帖子数、关注数、总距离等）

#### post_details - 帖子详情视图
包含帖子信息 + 用户信息 + 路线信息的完整视图

### 🔧 实用函数

#### 查询辅助函数
- `user_has_liked(user_id, target_type, target_id)` - 检查用户是否点赞
- `user_has_bookmarked(user_id, target_type, target_id)` - 检查用户是否收藏
- `user_is_following(follower_id, following_id)` - 检查关注关系

#### 批量操作函数
- `batch_upload_trail_images(trail_id, image_urls, captions)` - 批量上传路线图片

#### 统计函数
- `get_storage_stats()` - 获取存储使用统计
- `get_user_file_stats(user_id)` - 获取用户文件统计

## 📁 存储桶配置

### 存储桶列表

| 存储桶 | 用途 | 大小限制 | 访问权限 |
|--------|------|----------|----------|
| `avatars` | 用户头像 | 5MB | 公开 |
| `trail-images` | 路线图片 | 10MB | 公开 |
| `post-images` | 帖子图片 | 10MB | 公开 |
| `activity-photos` | 活动照片 | 10MB | 公开 |
| `gpx-files` | GPX轨迹文件 | 2MB | 私有 |

### 文件命名规则
- 格式：`{user_id}/{filename}_{timestamp}_{random}.{ext}`
- 自动生成唯一文件名，避免冲突
- 支持文件类型验证和大小限制

## 🔒 安全策略(RLS)

### 权限概述
- **公开数据**：所有人可查看公开的路线、帖子
- **用户数据**：用户只能编辑自己的数据
- **私有数据**：活动记录、收藏等只有本人可见
- **文件安全**：用户只能访问和管理自己上传的文件

### 主要安全规则
1. **用户表**：所有人可查看基础信息，用户只能修改自己的资料
2. **路线表**：所有人可查看公开路线，创建者可管理自己的路线
3. **帖子表**：所有人可查看公开帖子，作者可管理自己的帖子
4. **评论表**：所有人可查看公开帖子的评论，用户可管理自己的评论
5. **私有表**：收藏、活动记录等只有用户本人可访问

## 🎯 使用示例

### 基础认证操作
```typescript
import { useAuthStore } from '@/stores/auth'

// 用户注册
await authStore.signUp('user@example.com', 'password', {
  username: 'hiking_lover'
})

// 用户登录
await authStore.signIn('user@example.com', 'password')
```

### 路线数据操作
```typescript
import SupabaseService from '@/services/supabase'

// 创建路线
const newTrail = await SupabaseService.createTrail({
  name: '黄山登山路线',
  difficulty: 'hard',
  distance: 15.2,
  elevation_gain: 1200,
  location: '安徽省黄山市',
  creator_id: user.id
})

// 查询路线（使用视图获取完整信息）
const { data: trails } = await supabase
  .from('trail_details')
  .select('*')
  .order('rating', { ascending: false })
```

### 社区互动操作
```typescript
// 创建帖子
const newPost = await SupabaseService.createPost({
  title: '黄山日出之旅',
  trail_id: trail.id,
  activity_date: '2024-01-01',
  distance: 15.2,
  duration: 480, // 分钟
  rating: 5,
  user_id: user.id
})

// 点赞帖子
await supabase.from('likes').insert({
  user_id: user.id,
  target_type: 'post',
  target_id: post.id
})

// 收藏路线
await supabase.from('bookmarks').insert({
  user_id: user.id,
  target_type: 'trail',
  target_id: trail.id,
  notes: '下次一定要去！'
})
```

### 文件上传操作
```typescript
// 上传用户头像
const avatarFile = document.querySelector('input[type="file"]').files[0]
const avatarPath = `${user.id}/avatar_${Date.now()}.jpg`
const { data } = await supabase.storage
  .from('avatars')
  .upload(avatarPath, avatarFile)

// 获取公开URL
const avatarUrl = supabase.storage
  .from('avatars')
  .getPublicUrl(avatarPath).data.publicUrl

// 更新用户头像
await supabase.from('users').update({
  avatar_url: avatarUrl
}).eq('id', user.id)
```

## 🔍 性能优化

### 索引策略
- 为常用查询字段创建索引（用户邮箱、路线难度、帖子创建时间等）
- 为外键关系创建索引提升关联查询性能
- 为地理位置查询优化GPS坐标索引

### 缓存机制
- 使用视图预计算复杂统计数据
- 触发器自动维护计数字段（点赞数、评论数等）
- 实时订阅关键数据变化

### 查询优化
- 使用视图简化复杂查询
- 批量操作函数减少网络请求
- 合理使用分页和限制结果数量

## 🚨 故障排除

### 常见问题

#### 1. 连接失败
```
错误：连接失败
解决：检查VITE_SUPABASE_KEY是否正确配置
```

#### 2. 表不存在
```
错误：表 'users' 不存在
解决：确保已执行 database_schema.sql
```

#### 3. 权限拒绝
```
错误：RLS policy violation
解决：确保已执行 database_security.sql 并启用RLS
```

#### 4. 存储桶访问失败
```
错误：存储桶访问失败
解决：确保已执行 storage_setup.sql 并配置存储策略
```

### 测试检查清单

- [ ] 数据库连接正常
- [ ] 所有表创建成功
- [ ] RLS策略配置正确
- [ ] 存储桶创建成功
- [ ] 视图查询正常
- [ ] 辅助函数可用
- [ ] TypeScript类型正确
- [ ] 认证功能正常

## 📚 相关文件

- `database_schema.sql` - 完整数据库结构
- `database_security.sql` - RLS安全策略
- `storage_setup.sql` - 存储桶配置
- `src/utils/supabase.ts` - TypeScript类型定义
- `src/services/supabase.ts` - 数据库操作服务
- `test-database.js` - 连接测试脚本

## 🎉 完成！

恭喜！你已经成功设置了TrailLog应用的完整数据库。现在你可以：

1. **开始开发** - 使用现有的SupabaseService进行数据操作
2. **添加数据** - 创建用户、路线、帖子等测试数据
3. **扩展功能** - 根据需要添加新的表和功能
4. **监控使用** - 使用Supabase Dashboard监控数据库使用情况

如有问题，请参考故障排除部分或查看Supabase官方文档。祝你的TrailLog应用开发顺利！ 🚀 