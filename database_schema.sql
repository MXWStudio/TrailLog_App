-- TrailLog应用数据库结构
-- 创建时间: 2024-12-31
-- 版本: 1.0

-- ============================================
-- 1. 启用扩展和函数
-- ============================================

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建自动更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 2. 用户相关表
-- ============================================

-- 用户基础信息表（扩展现有表）
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    username VARCHAR UNIQUE,
    avatar_url VARCHAR,
    phone VARCHAR,
    bio TEXT,
    experience_level VARCHAR(20) DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    total_distance DECIMAL DEFAULT 0, -- 总徒步距离（公里）
    total_activities INTEGER DEFAULT 0, -- 总活动次数
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 用户详细档案表
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    height INTEGER, -- 身高（厘米）
    weight DECIMAL, -- 体重（公斤）
    fitness_level INTEGER DEFAULT 3 CHECK (fitness_level BETWEEN 1 AND 5), -- 体能等级1-5
    preferred_difficulty VARCHAR(20) DEFAULT 'moderate' CHECK (preferred_difficulty IN ('easy', 'moderate', 'hard', 'extreme')),
    emergency_contact_name VARCHAR,
    emergency_contact_phone VARCHAR,
    medical_conditions TEXT, -- 医疗状况
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. 徒步路线相关表
-- ============================================

-- 徒步路线表（扩展现有表）
DROP TABLE IF EXISTS trails CASCADE;
CREATE TABLE trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'hard', 'extreme')),
    distance DECIMAL NOT NULL, -- 距离（公里）
    elevation_gain INTEGER, -- 海拔增益（米）
    elevation_max INTEGER, -- 最高海拔（米）
    duration INTEGER, -- 预计时间（分钟）
    location VARCHAR NOT NULL,
    country VARCHAR DEFAULT '中国',
    province VARCHAR,
    city VARCHAR,
    rating DECIMAL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    season_best VARCHAR, -- 最佳季节
    features TEXT[], -- 路线特色（数组）
    warnings TEXT, -- 安全警告
    equipment_needed TEXT[], -- 所需装备
    trail_type VARCHAR(20) DEFAULT 'hiking' CHECK (trail_type IN ('hiking', 'climbing', 'cycling', 'running')),
    is_verified BOOLEAN DEFAULT FALSE, -- 是否经过验证
    is_public BOOLEAN DEFAULT TRUE,
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 路线图片表
CREATE TABLE trail_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
    image_url VARCHAR NOT NULL,
    image_type VARCHAR(20) DEFAULT 'photo' CHECK (image_type IN ('photo', 'map', 'profile')),
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE, -- 是否为主图
    sort_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 路线GPS坐标点表
CREATE TABLE trail_coordinates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    altitude DECIMAL, -- 海拔高度
    point_order INTEGER NOT NULL, -- 点的顺序
    point_type VARCHAR(20) DEFAULT 'waypoint' CHECK (point_type IN ('start', 'waypoint', 'summit', 'rest', 'end', 'danger')),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. 社区功能相关表
-- ============================================

-- 用户帖子表
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trail_id UUID REFERENCES trails(id) ON DELETE SET NULL,
    title VARCHAR NOT NULL,
    content TEXT,
    location VARCHAR,
    activity_date DATE, -- 徒步活动日期
    distance DECIMAL, -- 实际徒步距离
    duration INTEGER, -- 实际用时（分钟）
    elevation_gain INTEGER, -- 实际海拔增益
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 用户对路线的评分
    weather VARCHAR, -- 天气状况
    difficulty_felt VARCHAR(20) CHECK (difficulty_felt IN ('easy', 'moderate', 'hard', 'extreme')), -- 感受到的难度
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    tags TEXT[], -- 标签数组
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 帖子图片表
CREATE TABLE post_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    image_url VARCHAR NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE, -- 是否为封面图
    created_at TIMESTAMP DEFAULT NOW()
);

-- 评论表
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 回复评论的父评论ID
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 点赞表
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL, -- 被点赞对象的ID
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id) -- 防止重复点赞
);

-- 收藏表
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('trail', 'post')),
    target_id UUID NOT NULL, -- 被收藏对象的ID
    notes TEXT, -- 收藏备注
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id) -- 防止重复收藏
);

-- ============================================
-- 5. 活动记录相关表
-- ============================================

-- 用户活动记录表
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trail_id UUID REFERENCES trails(id) ON DELETE SET NULL,
    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    activity_type VARCHAR(20) DEFAULT 'hiking' CHECK (activity_type IN ('hiking', 'climbing', 'cycling', 'running')),
    title VARCHAR NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    distance DECIMAL, -- 实际距离
    duration INTEGER, -- 实际用时（分钟）
    elevation_gain INTEGER, -- 实际海拔增益
    max_speed DECIMAL, -- 最大速度
    avg_speed DECIMAL, -- 平均速度
    calories_burned INTEGER, -- 消耗卡路里
    max_heart_rate INTEGER, -- 最大心率
    avg_heart_rate INTEGER, -- 平均心率
    weather VARCHAR,
    temperature DECIMAL, -- 温度
    notes TEXT,
    gpx_data TEXT, -- GPX轨迹数据
    is_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 活动照片表
CREATE TABLE activity_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES user_activities(id) ON DELETE CASCADE,
    image_url VARCHAR NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    caption TEXT,
    taken_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. 关注系统表
-- ============================================

-- 用户关注表
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE, -- 关注者
    following_id UUID REFERENCES users(id) ON DELETE CASCADE, -- 被关注者
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id) -- 不能关注自己
);

-- ============================================
-- 7. 系统配置表
-- ============================================

-- 应用配置表
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. 创建触发器
-- ============================================

-- 为有updated_at字段的表创建自动更新触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trails_updated_at BEFORE UPDATE ON trails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_activities_updated_at BEFORE UPDATE ON user_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. 创建索引以提升性能
-- ============================================

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 路线表索引
CREATE INDEX idx_trails_difficulty ON trails(difficulty);
CREATE INDEX idx_trails_location ON trails(location);
CREATE INDEX idx_trails_rating ON trails(rating DESC);
CREATE INDEX idx_trails_created_at ON trails(created_at DESC);

-- 帖子表索引
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_trail_id ON posts(trail_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_activity_date ON posts(activity_date DESC);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- 点赞表索引
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
CREATE INDEX idx_likes_user_target ON likes(user_id, target_type, target_id);

-- 收藏表索引
CREATE INDEX idx_bookmarks_target ON bookmarks(target_type, target_id);
CREATE INDEX idx_bookmarks_user_target ON bookmarks(user_id, target_type, target_id);

-- 活动表索引
CREATE INDEX idx_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_activities_trail_id ON user_activities(trail_id);
CREATE INDEX idx_activities_start_time ON user_activities(start_time DESC);

-- 关注表索引
CREATE INDEX idx_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_follows_following ON user_follows(following_id);

-- GPS坐标索引
CREATE INDEX idx_coordinates_trail_order ON trail_coordinates(trail_id, point_order);

-- ============================================
-- 10. 插入基础配置数据
-- ============================================

INSERT INTO app_settings (setting_key, setting_value, description) VALUES
('app_version', '1.0.0', '应用版本号'),
('default_difficulty', 'moderate', '默认难度等级'),
('max_upload_size', '10485760', '最大上传文件大小（字节）'),
('supported_image_formats', 'jpg,jpeg,png,webp', '支持的图片格式'),
('default_activity_type', 'hiking', '默认活动类型');

-- ============================================
-- 11. 创建视图（便于查询）
-- ============================================

-- 路线详情视图（包含统计信息）
CREATE VIEW trail_details AS
SELECT 
    t.*,
    ti.image_url as primary_image,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT b.id) as bookmark_count_real,
    AVG(p.rating) as avg_user_rating
FROM trails t
LEFT JOIN trail_images ti ON t.id = ti.trail_id AND ti.is_primary = TRUE
LEFT JOIN posts p ON t.id = p.trail_id
LEFT JOIN bookmarks b ON t.id = b.target_id AND b.target_type = 'trail'
GROUP BY t.id, ti.image_url;

-- 用户统计视图
CREATE VIEW user_stats AS
SELECT 
    u.*,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT a.id) as activity_count,
    COUNT(DISTINCT f1.id) as following_count,
    COUNT(DISTINCT f2.id) as follower_count,
    COALESCE(SUM(a.distance), 0) as total_distance_real,
    COALESCE(SUM(a.elevation_gain), 0) as total_elevation
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN user_activities a ON u.id = a.user_id
LEFT JOIN user_follows f1 ON u.id = f1.follower_id
LEFT JOIN user_follows f2 ON u.id = f2.following_id
GROUP BY u.id;

-- 帖子详情视图（包含用户信息）
CREATE VIEW post_details AS
SELECT 
    p.*,
    u.username,
    u.avatar_url,
    t.name as trail_name,
    pi.image_url as cover_image
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN trails t ON p.trail_id = t.id
LEFT JOIN post_images pi ON p.id = pi.post_id AND pi.is_cover = TRUE; 