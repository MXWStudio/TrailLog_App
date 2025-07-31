<template>
  <div class="trail-detail-page" @scroll="onScroll" ref="pageContainer">
    <!-- 图片轮播区域 -->
    <div class="image-section" ref="imageSection" :style="imageStyle">
      <div class="image-carousel" @touchstart="onImageTouchStart" @touchmove="onImageTouchMove" @touchend="onImageTouchEnd">
        <div class="carousel-container" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
          <div v-for="(image, index) in trail?.images || [trail?.imageUrl]" :key="index" class="carousel-slide">
            <img :src="getImageUrl(image)" :alt="`${trail?.name} - ${index + 1}`" class="slide-image" />
          </div>
        </div>
        
        <!-- 图片指示器 -->
        <div class="image-indicators" :style="{ opacity: indicatorOpacity }">
          <span 
            v-for="(_, index) in (trail?.images || [trail?.imageUrl])" 
            :key="index"
            :class="['indicator', { active: currentImageIndex === index }]"
          ></span>
        </div>
      </div>
      
      <!-- 顶部导航栏 -->
      <div class="top-nav" :style="{ opacity: navOpacity }">
        <button @click="goBack" class="nav-btn back-btn">
          <ArrowLeft :size="40" color="white" />
        </button>
        <div class="nav-actions">
          <button @click="toggleSaved" class="nav-btn">
            <Heart :size="40" :color="isSaved ? '#ff4757' : 'white'" :fill="isSaved ? '#ff4757' : 'none'" />
          </button>
          <button @click="shareTrail" class="nav-btn">
            <Share :size="40" color="white" />
          </button>
        </div>
      </div>
    </div>

    <!-- 详细信息区域 -->
    <div class="content-section" :style="contentStyle">
      <div class="trail-header">
        <h1 class="trail-title">{{ trail?.name }}</h1>
        <div class="trail-rating">
          <div class="stars">
            <Star v-for="i in 5" :key="i" :size="16" 
                  :color="i <= Math.floor(trail?.rating || 0) ? '#FFD700' : '#E5E5E5'" 
                  :fill="i <= Math.floor(trail?.rating || 0) ? '#FFD700' : 'none'" />
          </div>
          <span class="rating-text">{{ trail?.rating }}/5.0</span>
        </div>
      </div>

      <!-- 快速信息 -->
      <div class="quick-stats">
        <div class="stat-card">
          <Mountain :size="20" color="#666" />
          <div class="stat-info">
            <span class="stat-label">海拔</span>
            <span class="stat-value">{{ trail?.elevation || '1,200m' }}</span>
          </div>
        </div>
        <div class="stat-card">
          <Route :size="20" color="#666" />
          <div class="stat-info">
            <span class="stat-label">长度</span>
            <span class="stat-value">{{ trail?.distance }}km</span>
          </div>
        </div>
        <div class="stat-card">
          <Clock :size="20" color="#666" />
          <div class="stat-info">
            <span class="stat-label">时长</span>
            <span class="stat-value">{{ trail?.estimatedTime }}</span>
          </div>
        </div>
        <div class="stat-card">
          <TrendingUp :size="20" color="#666" />
          <div class="stat-info">
            <span class="stat-label">难度</span>
            <span class="stat-value">{{ trail?.difficulty }}</span>
          </div>
        </div>
      </div>

      <!-- 地点介绍 -->
      <div class="description-section">
        <h3>关于这个地点</h3>
        <p class="description-text">
          {{ trail?.description || '这是一条美丽的徒步路线，带您探索大自然的神奇魅力。沿途您将欣赏到壮丽的景色，体验到徒步的乐趣。' }}
        </p>
      </div>

      <!-- 路线图 -->
      <div class="route-map-section">
        <h3>路线图</h3>
        <div class="route-map">
          <img :src="getMapUrl()" :alt="`${trail?.name} 路线图`" class="route-map-image" />
          <div class="map-overlay">
            <button class="map-action-btn">
              <MapPin :size="16" color="white" />
              查看详细地图
            </button>
          </div>
        </div>
      </div>

      <!-- 底部安全间距 -->
      <div class="bottom-spacer"></div>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-navigation">
      <button class="nav-item" @click="downloadRoute">
        <Download :size="24" color="#666" />
        <span>下载路线</span>
      </button>
      <button class="nav-item" @click="startNavigation">
        <Navigation :size="24" color="#007AFF" />
        <span>导航地图</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Trail } from '@/data/trails';
import { trails } from '@/data/trails';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  Star, 
  Mountain, 
  Route, 
  Clock, 
  TrendingUp,
  MapPin,
  Navigation,
  Settings,
  Download
} from 'lucide-vue-next';

// 导入本地图片
import qingchengMountain from '@/assets/qingcheng_mountain.jpg';
import mountQingcheng from '@/assets/Mount Qingcheng.jpg';
import fushiMountain from '@/assets/fushi_mountain.jpg';
import fushishanJitian from '@/assets/fushishan_jitian.jpg';
import longjititian from '@/assets/longjititian.jpg';
import cigarGirlMountain from '@/assets/Cigar Girl Mountain.jpg';

const router = useRouter();
const route = useRoute();

const trail = ref<Trail | null>(null);
const currentImageIndex = ref(0);
const isSaved = ref(false);

// 滚动相关变量
const pageContainer = ref<HTMLElement | null>(null);
const imageSection = ref<HTMLElement | null>(null);
const scrollY = ref(0);
const maxImageHeight = 300; // 图片区域最大高度

// 触摸相关变量（用于图片轮播）
const touchStartX = ref(0);
const touchEndX = ref(0);

// 本地图片映射
const localImages: Record<string, string> = {
  '/src/assets/qingcheng_mountain.jpg': qingchengMountain,
  '/src/assets/Mount Qingcheng.jpg': mountQingcheng,
  '/src/assets/fushi_mountain.jpg': fushiMountain,
  '/src/assets/fushishan_jitian.jpg': fushishanJitian,
  '/src/assets/longjititian.jpg': longjititian,
  '/src/assets/Cigar Girl Mountain.jpg': cigarGirlMountain,
};

onMounted(() => {
  const trailId = route.params.id as string;
  trail.value = trails.find(t => t.id === trailId) || null;
  
  if (!trail.value) {
    router.push('/explore');
  }
});

const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return qingchengMountain;
  
  if (localImages[imageUrl]) {
    return localImages[imageUrl];
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  return qingchengMountain;
};

const getMapUrl = () => {
  return trail.value?.mapPreviewUrl ? getImageUrl(trail.value.mapPreviewUrl) : qingchengMountain;
};

// 计算属性：根据滚动位置计算样式
const imageStyle = computed(() => {
  const progress = Math.min(scrollY.value / maxImageHeight, 1);
  const scale = Math.max(1, 1 + progress * 0.2); // 放大而不是缩小，避免白边
  const opacity = Math.max(0, 1 - progress * 1.5);
  const blur = Math.min(progress * 8, 8); // 添加模糊效果
  
  return {
    transform: `scale(${scale})`,
    opacity: opacity,
    filter: `blur(${blur}px)`,
    transformOrigin: 'center center',
    transition: scrollY.value === 0 ? 'all 0.3s ease' : 'none'
  };
});

const contentStyle = computed(() => {
  const progress = Math.min(scrollY.value / maxImageHeight, 1);
  const translateY = -scrollY.value * 0.5;
  
  return {
    transform: `translateY(${translateY}px)`,
    transition: scrollY.value === 0 ? 'all 0.3s ease' : 'none'
  };
});

const navOpacity = computed(() => {
  return Math.max(0, 1 - (scrollY.value / maxImageHeight) * 2);
});

const indicatorOpacity = computed(() => {
  return Math.max(0, 1 - (scrollY.value / maxImageHeight) * 2);
});

// 滚动事件处理
const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  scrollY.value = target.scrollTop;
};

// 图片轮播触摸事件处理
const onImageTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const onImageTouchMove = (e: TouchEvent) => {
  e.preventDefault();
};

const onImageTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;
  
  if (Math.abs(diff) > swipeThreshold) {
    const maxIndex = (trail.value?.images?.length || 1) - 1;
    
    if (diff > 0 && currentImageIndex.value < maxIndex) {
      // 向左滑动，显示下一张
      currentImageIndex.value++;
    } else if (diff < 0 && currentImageIndex.value > 0) {
      // 向右滑动，显示上一张
      currentImageIndex.value--;
    }
  }
};

const goBack = () => {
  router.back();
};

const toggleSaved = () => {
  isSaved.value = !isSaved.value;
  // TODO: 实现保存逻辑
};

const shareTrail = () => {
  // TODO: 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: trail.value?.name,
      text: `查看这条精彩的徒步路线：${trail.value?.name}`,
      url: window.location.href,
    });
  }
};

const getDirections = () => {
  // TODO: 实现获取方向功能
  console.log('获取路线指引');
};

const customizeRoute = () => {
  // TODO: 实现自定义路线功能
  console.log('自定义路线');
};

const downloadRoute = () => {
  // TODO: 实现下载路线功能
  console.log('下载路线');
};

const startNavigation = () => {
  // TODO: 实现开始导航功能
  console.log('开始导航');
};
</script>

<style scoped>
.trail-detail-page {
  height: 100vh;
  overflow-y: auto;
  background: #fff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* 确保所有链接没有下划线 */
.trail-detail-page a {
  text-decoration: none;
}

.trail-detail-page a:hover {
  text-decoration: none;
}

/* 图片轮播区域 */
.image-section {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40vh;
  overflow: hidden;
  z-index: 1;
  background: #f0f0f0; /* 添加背景色避免白边 */
}

.image-carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.image-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.3s ease;
}

.indicator.active {
  background: white;
}

/* 顶部导航栏 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 20px 20px;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
  z-index: 10;
  transition: opacity 0.3s ease;
}

.nav-btn {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
}

.nav-actions {
  display: flex;
  gap: 12px;
}

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 20px 20px 0 0;
  margin-top: calc(40vh - 20px);
  padding: 24px;
  min-height: calc(100vh - 40vh + 20px);
  z-index: 2;
  position: relative;
}

.trail-header {
  margin-bottom: 24px;
  text-align: left;
}

.trail-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  text-align: left;
}

.trail-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

/* 快速统计信息 */
.quick-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 描述区域 */
.description-section {
  margin-bottom: 32px;
}

.description-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.description-text {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* 路线图区域 */
.route-map-section {
  margin-bottom: 32px;
}

.route-map-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.route-map {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #f0f0f0;
}

.route-map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-action-btn {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

/* 底部导航栏 */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  z-index: 10;
  padding: 12px 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.nav-item {
  flex: 1;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-item span {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.nav-item:last-child span {
  color: #007AFF;
  font-weight: 600;
}

/* 底部间距 */
.bottom-spacer {
  height: calc(100px + env(safe-area-inset-bottom));
}

/* 响应式设计 */
@media (max-width: 480px) {
  .content-section {
    padding: 20px 16px;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
  
  .nav-btn {
    width: 56px;
    height: 56px;
    border-radius: 28px;
  }
  
  .nav-item span {
    font-size: 11px;
  }
}
</style> 