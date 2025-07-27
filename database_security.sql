-- TrailLog应用行级安全策略（RLS）配置
-- 创建时间: 2024-12-31
-- 版本: 1.0

-- ============================================
-- 1. 启用所有表的行级安全
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_coordinates ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. 用户相关表的RLS策略
-- ============================================

-- users表策略
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON users FOR DELETE USING (auth.uid() = id);

-- user_profiles表策略
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON user_profiles FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. 徒步路线相关表的RLS策略
-- ============================================

-- trails表策略
CREATE POLICY "Anyone can view public trails" ON trails FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own trails" ON trails FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Authenticated users can create trails" ON trails FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own trails" ON trails FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own trails" ON trails FOR DELETE USING (auth.uid() = creator_id);

-- trail_images表策略
CREATE POLICY "Anyone can view trail images" ON trail_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM trails WHERE trails.id = trail_id AND (trails.is_public = true OR trails.creator_id = auth.uid()))
);
CREATE POLICY "Users can upload trail images" ON trail_images FOR INSERT WITH CHECK (
  auth.uid() = uploaded_by AND
  EXISTS (SELECT 1 FROM trails WHERE trails.id = trail_id AND trails.creator_id = auth.uid())
);
CREATE POLICY "Users can update own trail images" ON trail_images FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own trail images" ON trail_images FOR DELETE USING (auth.uid() = uploaded_by);

-- trail_coordinates表策略
CREATE POLICY "Anyone can view public trail coordinates" ON trail_coordinates FOR SELECT USING (
  EXISTS (SELECT 1 FROM trails WHERE trails.id = trail_id AND (trails.is_public = true OR trails.creator_id = auth.uid()))
);
CREATE POLICY "Trail creators can manage coordinates" ON trail_coordinates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM trails WHERE trails.id = trail_id AND trails.creator_id = auth.uid())
);
CREATE POLICY "Trail creators can update coordinates" ON trail_coordinates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trails WHERE trails.id = trail_id AND trails.creator_id = auth.uid())
);
CREATE POLICY "Trail creators can delete coordinates" ON trail_coordinates FOR DELETE USING (
  EXISTS (SELECT 1 FROM trails WHERE trails.id = trail_id AND trails.creator_id = auth.uid())
);

-- ============================================
-- 4. 社区功能相关表的RLS策略
-- ============================================

-- posts表策略
CREATE POLICY "Anyone can view public posts" ON posts FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own posts" ON posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- post_images表策略
CREATE POLICY "Anyone can view public post images" ON post_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND (posts.is_public = true OR posts.user_id = auth.uid()))
);
CREATE POLICY "Users can upload post images" ON post_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
);
CREATE POLICY "Post authors can manage images" ON post_images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
);
CREATE POLICY "Post authors can delete images" ON post_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
);

-- comments表策略
CREATE POLICY "Anyone can view public post comments" ON comments FOR SELECT USING (
  NOT is_deleted AND
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.is_public = true)
);
CREATE POLICY "Users can view comments on own posts" ON comments FOR SELECT USING (
  NOT is_deleted AND
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.is_public = true)
);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- likes表策略
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- bookmarks表策略
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. 活动记录相关表的RLS策略
-- ============================================

-- user_activities表策略
CREATE POLICY "Users can view own activities" ON user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create activities" ON user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON user_activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own activities" ON user_activities FOR DELETE USING (auth.uid() = user_id);

-- activity_photos表策略
CREATE POLICY "Users can view own activity photos" ON activity_photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_activities WHERE user_activities.id = activity_id AND user_activities.user_id = auth.uid())
);
CREATE POLICY "Users can upload activity photos" ON activity_photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_activities WHERE user_activities.id = activity_id AND user_activities.user_id = auth.uid())
);
CREATE POLICY "Users can update own activity photos" ON activity_photos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_activities WHERE user_activities.id = activity_id AND user_activities.user_id = auth.uid())
);
CREATE POLICY "Users can delete own activity photos" ON activity_photos FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_activities WHERE user_activities.id = activity_id AND user_activities.user_id = auth.uid())
);

-- ============================================
-- 6. 关注系统的RLS策略
-- ============================================

-- user_follows表策略
CREATE POLICY "Anyone can view follows" ON user_follows FOR SELECT USING (true);
CREATE POLICY "Users can create follows" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete own follows" ON user_follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- 7. 系统配置表的RLS策略
-- ============================================

-- app_settings表策略（只读，管理员可写）
CREATE POLICY "Anyone can read app settings" ON app_settings FOR SELECT USING (true);

-- ============================================
-- 8. 创建用于统计和缓存的函数
-- ============================================

-- 更新帖子点赞数的函数
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.target_id AND NEW.target_type = 'post';
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.target_id AND OLD.target_type = 'post';
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新评论点赞数的函数
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.target_id AND NEW.target_type = 'comment';
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.target_id AND OLD.target_type = 'comment';
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新帖子评论数的函数
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新路线收藏数的函数
CREATE OR REPLACE FUNCTION update_trail_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE trails SET bookmark_count = bookmark_count + 1 WHERE id = NEW.target_id AND NEW.target_type = 'trail';
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE trails SET bookmark_count = bookmark_count - 1 WHERE id = OLD.target_id AND OLD.target_type = 'trail';
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新用户统计数据的函数
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET 
            total_activities = total_activities + 1,
            total_distance = total_distance + COALESCE(NEW.distance, 0)
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE users SET 
            total_distance = total_distance - COALESCE(OLD.distance, 0) + COALESCE(NEW.distance, 0)
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET 
            total_activities = total_activities - 1,
            total_distance = total_distance - COALESCE(OLD.distance, 0)
        WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. 创建触发器来维护统计数据
-- ============================================

-- 点赞相关触发器
CREATE TRIGGER trigger_update_like_count 
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER trigger_update_comment_like_count 
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- 评论相关触发器
CREATE TRIGGER trigger_update_comment_count 
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- 收藏相关触发器
CREATE TRIGGER trigger_update_bookmark_count 
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_trail_bookmark_count();

-- 用户活动统计触发器
CREATE TRIGGER trigger_update_user_stats 
    AFTER INSERT OR UPDATE OR DELETE ON user_activities
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- ============================================
-- 10. 创建用于实时通知的函数
-- ============================================

-- 发送实时通知的函数
CREATE OR REPLACE FUNCTION notify_realtime_changes()
RETURNS TRIGGER AS $$
DECLARE
    payload JSON;
BEGIN
    payload = json_build_object(
        'table', TG_TABLE_NAME,
        'type', TG_OP,
        'record', CASE 
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            ELSE row_to_json(NEW)
        END
    );
    
    PERFORM pg_notify('realtime:' || TG_TABLE_NAME, payload::text);
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 为关键表添加实时通知触发器
CREATE TRIGGER realtime_posts 
    AFTER INSERT OR UPDATE OR DELETE ON posts
    FOR EACH ROW EXECUTE FUNCTION notify_realtime_changes();

CREATE TRIGGER realtime_comments 
    AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION notify_realtime_changes();

CREATE TRIGGER realtime_likes 
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION notify_realtime_changes();

-- ============================================
-- 11. 辅助查询函数
-- ============================================

-- 获取用户是否点赞了某个对象
CREATE OR REPLACE FUNCTION user_has_liked(user_uuid UUID, target_type_param VARCHAR, target_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM likes 
        WHERE user_id = user_uuid 
        AND target_type = target_type_param 
        AND target_id = target_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户是否收藏了某个对象
CREATE OR REPLACE FUNCTION user_has_bookmarked(user_uuid UUID, target_type_param VARCHAR, target_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM bookmarks 
        WHERE user_id = user_uuid 
        AND target_type = target_type_param 
        AND target_id = target_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户是否关注了某个用户
CREATE OR REPLACE FUNCTION user_is_following(follower_uuid UUID, following_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_follows 
        WHERE follower_id = follower_uuid 
        AND following_id = following_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 