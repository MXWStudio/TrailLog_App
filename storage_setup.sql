-- TrailLog应用存储桶配置
-- 创建时间: 2024-12-31
-- 版本: 1.0

-- ============================================
-- 1. 创建存储桶
-- ============================================

-- 用户头像存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 路线图片存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'trail-images',
    'trail-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 帖子图片存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'post-images',
    'post-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 活动照片存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'activity-photos',
    'activity-photos',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- GPX文件存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gpx-files',
    'gpx-files',
    false, -- 私有，只有用户可以访问自己的GPX文件
    2097152, -- 2MB
    ARRAY['application/gpx+xml', 'text/xml', 'application/xml']
);

-- ============================================
-- 2. 存储桶访问策略
-- ============================================

-- 用户头像访问策略
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 路线图片访问策略
CREATE POLICY "Trail images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'trail-images');

CREATE POLICY "Authenticated users can upload trail images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'trail-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own trail images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'trail-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own trail images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'trail-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 帖子图片访问策略
CREATE POLICY "Post images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'post-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own post images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'post-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own post images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'post-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 活动照片访问策略
CREATE POLICY "Activity photos are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'activity-photos');

CREATE POLICY "Authenticated users can upload activity photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'activity-photos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own activity photos" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'activity-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own activity photos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'activity-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- GPX文件访问策略（私有）
CREATE POLICY "Users can only access own GPX files" ON storage.objects
FOR SELECT USING (
    bucket_id = 'gpx-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own GPX files" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'gpx-files' 
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own GPX files" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'gpx-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own GPX files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'gpx-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 3. 创建文件管理辅助函数
-- ============================================

-- 生成唯一文件名的函数
CREATE OR REPLACE FUNCTION generate_unique_filename(
    original_filename TEXT,
    user_id UUID DEFAULT auth.uid()
)
RETURNS TEXT AS $$
DECLARE
    file_extension TEXT;
    base_name TEXT;
    timestamp_str TEXT;
    random_str TEXT;
BEGIN
    -- 获取文件扩展名
    file_extension := lower(substring(original_filename from '\.([^.]*)$'));
    
    -- 获取不含扩展名的文件名
    base_name := substring(original_filename from '^(.*)\.([^.]*)$');
    
    -- 生成时间戳字符串
    timestamp_str := to_char(NOW(), 'YYYYMMDDHH24MISS');
    
    -- 生成随机字符串
    random_str := substring(encode(gen_random_bytes(4), 'hex') from 1 for 8);
    
    -- 返回格式: {user_id}/{base_name}_{timestamp}_{random}.{ext}
    RETURN user_id::text || '/' || base_name || '_' || timestamp_str || '_' || random_str || '.' || file_extension;
END;
$$ LANGUAGE plpgsql;

-- 清理旧文件的函数（定期清理未使用的文件）
CREATE OR REPLACE FUNCTION cleanup_unused_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- 删除7天前上传但未在数据库中引用的头像文件
    DELETE FROM storage.objects
    WHERE bucket_id = 'avatars'
    AND created_at < NOW() - INTERVAL '7 days'
    AND name NOT IN (
        SELECT DISTINCT avatar_url 
        FROM users 
        WHERE avatar_url IS NOT NULL
        AND avatar_url LIKE '%supabase%'
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- 可以添加更多清理逻辑...
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. 文件上传大小和类型验证函数
-- ============================================

-- 验证文件类型的函数
CREATE OR REPLACE FUNCTION validate_file_type(
    bucket_name TEXT,
    file_name TEXT,
    content_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    allowed_types TEXT[];
BEGIN
    -- 根据存储桶获取允许的文件类型
    SELECT allowed_mime_types INTO allowed_types
    FROM storage.buckets
    WHERE id = bucket_name;
    
    -- 检查文件类型是否在允许列表中
    RETURN content_type = ANY(allowed_types);
END;
$$ LANGUAGE plpgsql;

-- 验证文件大小的函数
CREATE OR REPLACE FUNCTION validate_file_size(
    bucket_name TEXT,
    file_size BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    size_limit BIGINT;
BEGIN
    -- 获取存储桶的文件大小限制
    SELECT file_size_limit INTO size_limit
    FROM storage.buckets
    WHERE id = bucket_name;
    
    -- 检查文件大小是否在限制内
    RETURN file_size <= size_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. 文件处理触发器函数
-- ============================================

-- 当用户更新头像时，删除旧头像文件
CREATE OR REPLACE FUNCTION handle_avatar_update()
RETURNS TRIGGER AS $$
DECLARE
    old_file_path TEXT;
BEGIN
    -- 如果头像URL发生变化且旧URL指向我们的存储
    IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url 
       AND OLD.avatar_url IS NOT NULL
       AND OLD.avatar_url LIKE '%supabase%' THEN
        
        -- 提取文件路径
        old_file_path := substring(OLD.avatar_url from 'avatars/(.+)$');
        
        -- 删除旧文件（异步执行，不影响更新操作）
        PERFORM pg_notify('delete_old_file', json_build_object(
            'bucket', 'avatars',
            'path', old_file_path
        )::text);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为用户表创建头像更新触发器
CREATE TRIGGER handle_user_avatar_update
    AFTER UPDATE OF avatar_url ON users
    FOR EACH ROW
    EXECUTE FUNCTION handle_avatar_update();

-- ============================================
-- 6. 批量操作函数
-- ============================================

-- 批量上传路线图片的函数
CREATE OR REPLACE FUNCTION batch_upload_trail_images(
    trail_uuid UUID,
    image_urls TEXT[],
    captions TEXT[] DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    i INTEGER;
    image_count INTEGER;
BEGIN
    image_count := array_length(image_urls, 1);
    
    -- 批量插入图片记录
    FOR i IN 1..image_count LOOP
        INSERT INTO trail_images (trail_id, image_url, caption, sort_order, uploaded_by)
        VALUES (
            trail_uuid,
            image_urls[i],
            CASE WHEN captions IS NOT NULL THEN captions[i] ELSE NULL END,
            i,
            auth.uid()
        );
    END LOOP;
    
    result := json_build_object(
        'success', true,
        'uploaded_count', image_count,
        'trail_id', trail_uuid
    );
    
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. 文件统计和监控函数
-- ============================================

-- 获取存储使用统计的函数
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_object_agg(bucket_id, bucket_stats) INTO stats
    FROM (
        SELECT 
            bucket_id,
            json_build_object(
                'total_files', COUNT(*),
                'total_size', COALESCE(SUM(metadata->>'size')::BIGINT, 0),
                'avg_size', COALESCE(AVG((metadata->>'size')::BIGINT), 0)
            ) as bucket_stats
        FROM storage.objects
        GROUP BY bucket_id
    ) bucket_data;
    
    RETURN COALESCE(stats, '{}'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户文件使用情况的函数
CREATE OR REPLACE FUNCTION get_user_file_stats(user_uuid UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_object_agg(bucket_id, bucket_stats) INTO stats
    FROM (
        SELECT 
            bucket_id,
            json_build_object(
                'file_count', COUNT(*),
                'total_size', COALESCE(SUM((metadata->>'size')::BIGINT), 0)
            ) as bucket_stats
        FROM storage.objects
        WHERE (storage.foldername(name))[1] = user_uuid::text
        GROUP BY bucket_id
    ) user_bucket_data;
    
    RETURN COALESCE(stats, '{}'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 