<template>
  <div class="trail-card">
    <div class="card-image-container">
      <img :src="effectiveTrailImageUrl" :alt="trail.name" class="card-image" @error="onImageError"/>
      <button class="bookmark-btn">
        <Bookmark :size="20" color="white" />
      </button>
      <img :src="effectiveMapPreviewUrl" class="map-preview" alt="Map Preview" @error="onImageError" />
    </div>

    <div class="card-content">
      <div class="card-header">
        <h3>{{ trail.name }}</h3>
        <button class="download-btn">
          <DownloadCloud :size="22" />
        </button>
      </div>
      <p class="location">{{ trail.location }}</p>
      <div class="stats">
        <span><Star :size="14" color="#FFD700" /> {{ trail.rating }}</span>
        <span class="difficulty">{{ trail.difficulty }}</span>
        <span>{{ trail.distance }} km</span>
        <span>Est. {{ trail.estimatedTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { Trail } from '../data/trails';
import { Bookmark, DownloadCloud, Star } from 'lucide-vue-next';

const props = defineProps<{
  trail: Trail;
}>();

const placeholderBaseUrl = 'https://via.placeholder.com/';

// 计算属性，用于主图片
const effectiveTrailImageUrl = computed(() => {
  return props.trail.imageUrl || `https://source.unsplash.com/random/375x200?sig=${Math.random()}`;
});

// 计算属性，用于地图预览图片
const effectiveMapPreviewUrl = computed(() => {
  return props.trail.mapPreviewUrl || `https://source.unsplash.com/random/60x60?map,trail&sig=${Math.random()}`;
});

// 图片加载错误时的处理函数 (可选，用于处理占位符也加载失败的极端情况)
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.warn(`Image failed to load: ${target.src}. Displaying fallback.`);
  // 你可以在这里设置一个极简的SVG或者一个更通用的本地错误图片
  // target.src = 'data:image/svg+xml;...'; // 示例：一个简单的SVG占位符
};
</script>

<style scoped>
.trail-card {
  background-color: #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 100%;
}

.card-image-container {
  position: relative;
  height: 200px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bookmark-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.map-preview {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid white;
}

.card-content {
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.download-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
}

.location {
  color: #a0a0a0;
  font-size: 0.9rem;
  margin: 0.25rem 0 1rem 0;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: #c0c0c0;
}
.stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stats .difficulty {
  color: #FFA500; /* Example color for 'Hard' */
  font-weight: bold;
}
</style>