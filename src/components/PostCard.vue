<template>
  <div class="post-card">
    <!-- 作者信息头部 -->
    <div class="post-header">
      <img :src="post.author.avatar" alt="Avatar" class="avatar">
      <div class="author-info">
        <div class="author-name">{{ post.author.name }}</div>
        <div class="post-date">{{ post.date || 'Jun 1' }} • <span class="follow-link">关注</span></div>
      </div>
      <IconMaterialSymbolsMoreVert class="icon-more" />
    </div>

    <!-- 图片区域 -->
    <div class="post-image-container">
      <img :src="post.imageUrl" alt="Post Image" class="post-image">
      <button class="recap-btn">
        <IconMaterialSymbolsPlayArrow class="play-icon" />
        Recap
      </button>
      <div class="map-thumbnail">
        <img :src="smallMapThumbnail" alt="Map Thumbnail">
      </div>
    </div>

    <!-- 帖子详情 -->
    <div class="post-content">
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-trail-info">
        <span class="trail-name">{{ post.trailName || '青城山徒步路线' }}</span> • {{ post.location }}
      </p>
      
      <!-- 统计信息 -->
      <div class="post-stats">
        <div class="stat-item">
          <div class="stat-label">长度</div>
          <div class="stat-value">{{ post.distance || '7.57 km' }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">海拔增益</div>
          <div class="stat-value">{{ post.elevation || '614 m' }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">时间</div>
          <div class="stat-value">{{ post.duration || '4h 31m' }}</div>
        </div>
      </div>

      <!-- 评分系统 -->
      <div class="rating-section">
        <div class="stars">
          <IconMaterialSymbolsStar 
            v-for="i in 5" 
            :key="i" 
            :class="['star', { 'filled': i <= (post.rating || 4) }]"
          />
        </div>
      </div>

      <!-- 互动区域 -->
      <div class="post-actions">
        <button class="action-btn like-btn" @click="toggleLike">
          <span class="action-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
          <span>{{ isLiked ? '已赞' : '点赞' }}</span>
        </button>
        <button class="action-btn comment-btn" @click="showComments">
          <span class="action-icon">💬</span>
          <span>{{ post.commentCount || 1 }} 条评论</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import smallMapThumbnail from '@/assets/Mount Qingcheng.jpg';
import IconMaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';
import IconMaterialSymbolsPlayArrow from '~icons/material-symbols/play-arrow';
import IconMaterialSymbolsStar from '~icons/material-symbols/star';
// 移除有问题的图标导入，使用简单的文本替代

const props = defineProps({
  post: Object
});

const isLiked = ref(false);

const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const showComments = () => {
  // 显示评论功能
  console.log('显示评论');
};
</script>

<style scoped>
.post-card {
  margin-bottom: 20px;
  overflow: hidden;
}

.post-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  background: linear-gradient(135deg, #f4d03f, #d4a574);
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.author-info {
  flex-grow: 1;
}

.author-name {
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.post-date {
  font-size: 14px;
  color: #666;
}

.follow-link {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}

.icon-more {
  width: 24px;
  height: 24px;
  color: #666;
  cursor: pointer;
}

.post-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recap-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.play-icon {
  width: 16px;
  height: 16px;
}

.map-thumbnail {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 2px solid white;
}

.map-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 16px;
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.post-trail-info {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
}

.trail-name {
  color: #1a1a1a;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}

.post-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.rating-section {
  margin-bottom: 20px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  width: 20px;
  height: 20px;
  color: #ddd;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #1890ff;
}

.action-icon {
  font-size: 18px;
  display: inline-block;
}
</style> 