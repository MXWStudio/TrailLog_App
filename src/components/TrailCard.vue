<template>
  <div class="trail-card" @click="navigateToDetail">
    <!-- 图片部分 -->
    <div class="card-image-container">
      <img 
        :src="effectiveTrailImageUrl" 
        :alt="trail.name" 
        class="card-image" 
        @error="onImageError"
        @load="onImageLoad"
      />
      <!-- 收藏按钮 -->
      <button class="bookmark-btn">
        <Bookmark :size="24" color="white" />
      </button>
      <!-- 小地图 -->
      <div class="map-preview">
        <img :src="effectiveMapPreviewUrl" alt="Trail map" class="map-image" />
      </div>
      <!-- 图片指示器 -->
      <div class="image-indicators">
        <span class="indicator active"></span>
        <span class="indicator"></span>
        <span class="indicator"></span>
      </div>
    </div>

    <!-- 文字内容部分 -->
    <div class="card-content">
      <div class="title-section">
        <h2 class="trail-name">{{ trail.name }}</h2>
        <button class="download-btn">
          <DownloadCloud :size="24" />
        </button>
      </div>
      
      <p class="location">{{ trail.location }}</p>
      
      <div class="trail-stats">
        <div class="stat-item">
          <Star :size="16" color="#FFD700" />
          <span>{{ trail.rating }}</span>
        </div>
        <div class="stat-item difficulty">
          {{ trail.difficulty }}
        </div>
        <div class="stat-item">
          {{ trail.distance }} km
        </div>
        <div class="stat-item">
          Est. {{ trail.estimatedTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Trail } from '../data/trails';
import { Bookmark, DownloadCloud, Star } from 'lucide-vue-next';
import { Geolocation } from '@capacitor/geolocation';

// 导入本地图片
import qingchengMountain from '@/assets/qingcheng_mountain.jpg';
import fushiMountain from '@/assets/fushi_mountain.jpg';
import longjititian from '@/assets/longjititian.jpg';

const props = defineProps<{
  trail: Trail;
}>();

const router = useRouter();
const mapContainer = ref<HTMLElement | null>(null);
const trailImage = ref<HTMLImageElement | null>(null);
const imageAspectRatio = ref(16/9); // 默认宽高比
const imageLoaded = ref(false);

// 本地图片映射
const localImages: Record<string, string> = {
  '/src/assets/qingcheng_mountain.jpg': qingchengMountain,
  '/src/assets/fushi_mountain.jpg': fushiMountain,
  '/src/assets/longjititian.jpg': longjititian,
};

// 计算卡片样式
const cardStyle = computed(() => ({
  minHeight: imageLoaded.value ? 'auto' : '400px',
}));

// 计算图片容器样式
const imageContainerStyle = computed(() => ({
  paddingBottom: imageLoaded.value ? `${(1 / imageAspectRatio.value) * 100}%` : '0',
  height: imageLoaded.value ? 'auto' : '300px',
}));

// 获取当前位置
const getCurrentLocation = async () => {
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current location:', coordinates);
    return coordinates;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

onMounted(async () => {
  // 获取位置权限
  try {
    await Geolocation.requestPermissions();
    const location = await getCurrentLocation();
    if (location) {
      console.log('Location permission granted and location obtained');
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
  }
});

const placeholderBaseUrl = 'https://source.unsplash.com/featured/';

// 计算属性，用于主图片
const effectiveTrailImageUrl = computed(() => {
  if (props.trail.imageUrl) {
    // 检查是否是本地图片路径
    if (localImages[props.trail.imageUrl]) {
      return localImages[props.trail.imageUrl];
    }
    // 如果是外部URL，直接使用
    if (props.trail.imageUrl.startsWith('http')) {
      return props.trail.imageUrl;
    }
  }
  
  // 根据路线名称和位置生成相关的图片
  const searchQuery = encodeURIComponent(`${props.trail.name},${props.trail.location},hiking,trail`);
  return `${placeholderBaseUrl}500x375?${searchQuery}`;
});

// 计算属性，用于地图预览图片
const effectiveMapPreviewUrl = computed(() => {
  if (props.trail.mapPreviewUrl) {
    // 检查是否是本地图片路径
    if (localImages[props.trail.mapPreviewUrl]) {
      return localImages[props.trail.mapPreviewUrl];
    }
    // 如果是外部URL，直接使用
    if (props.trail.mapPreviewUrl.startsWith('http')) {
      return props.trail.mapPreviewUrl;
    }
  }
  
  // 使用地图相关的占位图
  const searchQuery = encodeURIComponent(`${props.trail.location},map,terrain`);
  return `${placeholderBaseUrl}60x60?${searchQuery}`;
});

// 图片加载错误时的处理函数
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const isMapPreview = target.classList.contains('map-image');
  
  console.warn(`Image failed to load: ${target.src}`);
  
  // 设置备用图片
  if (isMapPreview) {
    target.src = qingchengMountain;
  } else {
    // 使用更通用的风景图作为备用
    target.src = `${placeholderBaseUrl}500x375?nature,landscape`;
  }
};

// 图片加载完成时的处理函数
const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img.naturalWidth && img.naturalHeight) {
    imageAspectRatio.value = img.naturalWidth / img.naturalHeight;
    imageLoaded.value = true;
  }
};

// 导航到详细页面
const navigateToDetail = () => {
  router.push(`/trail/${props.trail.id}`);
};
</script>

<style scoped>
.trail-card {
  /* 移除背景色、边框和阴影，让卡片透明 */
  background: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
  width: 100%;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.trail-card:hover {
  transform: translateY(-2px);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 比例，让图片更高更大 */
  overflow: hidden;
  border-radius: 20px; /* 只给图片添加圆角 */
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px; /* 图片圆角 */
}

.bookmark-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-preview {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid white; /* 增加白边厚度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background: white; /* 确保白边显示 */
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: white;
}

.card-content {
  /* 移除背景和内边距，让文字直接显示 */
  padding: 16px 0 0 0;
  background: transparent;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.trail-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: left; /* 确保左对齐 */
}

.download-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.location {
  color: #666;
  font-size: 16px;
  margin: 0 0 16px 0;
  text-align: left; /* 确保左对齐 */
}

.trail-stats {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-start; /* 确保左对齐 */
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.difficulty {
  color: #ff6b6b;
  font-weight: 500;
}
</style>