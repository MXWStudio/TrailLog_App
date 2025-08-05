<template>
  <div class="post-card">
    <!-- 作者信息头部 -->
    <div class="post-header">
      <img :src="post.author.avatar" alt="Avatar" class="avatar">
      <div class="author-info">
        <div class="author-name">{{ post.author.name }}</div>
        <div class="post-date">{{ post.date || 'Jun 1' }} • <span class="follow-link">关注</span></div>
      </div>
      <svg class="icon-more" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
        <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor"/>
        <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor"/>
      </svg>
    </div>

    <!-- 图片区域 -->
    <div class="post-image-container">
      <img :src="post.imageUrl" alt="Post Image" class="post-image">
      <button v-if="post.recap" class="recap-btn">
        <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
        </svg>
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
          <svg 
            v-for="i in 5" 
            :key="i" 
            :class="['star', { 'filled': i <= (post.rating || 4) }]"
            width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- 互动区域 -->
      <div class="post-actions">
        <button class="action-btn like-btn" @click="toggleLike">
          <svg class="action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" fill="currentColor"/>
          </svg>
          <span>{{ isLiked ? '已赞' : '点赞' }}</span>
        </button>
        <button class="action-btn comment-btn" @click="showComments">
          <svg class="action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ post.commentCount || 1 }} 条评论</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import smallMapThumbnail from '@/assets/Mount Qingcheng.jpg';

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
  margin-bottom: 16px;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  background-color: white;
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 16px 16px 0 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  background: linear-gradient(135deg, #f4d03f, #d4a574);
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.author-info {
  flex-grow: 1;
}

.author-name {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.post-date {
  font-size: 13px;
  color: #666;
}

.follow-link {
  color: #007AFF;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.icon-more {
  width: 24px;
  height: 24px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.icon-more:hover {
  background-color: #f0f0f0;
  color: #333;
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
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.02);
}

.recap-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}

.recap-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.play-icon {
  width: 16px;
  height: 16px;
  color: #333;
}

.map-thumbnail {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  border: 2px solid white;
}

.map-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 20px;
  background-color: white;
  border-radius: 0 0 16px 16px;
}

.post-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.post-trail-info {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.trail-name {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.post-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
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
  gap: 24px;
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
  transition: all 0.2s ease;
  font-weight: 500;
  border-radius: 8px;
}

.action-btn:hover {
  color: #007AFF;
  background-color: #f8f9fa;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-icon {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.like-btn .action-icon {
  color: #ff4757;
}

.comment-btn .action-icon {
  color: #666;
}

/* iOS 触摸优化 */
@media (hover: none) and (pointer: coarse) {
  .action-btn:hover {
    background-color: transparent;
  }
  
  .post-card:hover {
    transform: none;
  }
  
  .post-card:active {
    transform: scale(0.98);
  }
}
</style> 