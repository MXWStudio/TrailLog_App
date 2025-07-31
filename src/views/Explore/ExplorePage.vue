<template>
  <div class="explore-page">
    <div class="search-container">
      <input
        v-model="searchText"
        type="text"
        placeholder="搜索步道/关键词..."
        class="search-input"
      />
    </div>
    <div class="filters">
      <button class="active">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M12 2L12 22M12 8C16 8 19 11 19 15C19 19 16 22 12 22C8 22 5 19 5 15C5 11 8 8 12 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="8" r="2" fill="currentColor"/>
        </svg>
        附近
      </button>
      <button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M3 18H21L18 12L15 18L12 9L9 15L6 12L3 18Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M8 6C8 4.9 8.9 4 10 4C11.1 4 12 4.9 12 6C12 7.1 11.1 8 10 8C8.9 8 8 7.1 8 6Z" fill="currentColor"/>
        </svg>
        绝美风光
      </button>
      <button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
        编辑精选
      </button>
    </div>

    <div class="trail-list">
      <TrailCard
        v-for="trail in filteredTrails"
        :key="trail.id"
        :trail="trail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TrailCard from '@/components/TrailCard.vue';
import { trails, type Trail } from '@/data/trails';

const searchText = ref('');
const trailData = ref<Trail[]>(trails);

const filteredTrails = computed(() => {
  if (!searchText.value) return trailData.value;
  return trailData.value.filter(trail =>
    trail.name.includes(searchText.value) ||
    (trail.description && trail.description.includes(searchText.value))
  );
});
</script>

<style scoped>
.search-container {
  position: relative;
  margin-bottom: 1.2rem;
  /* 进一步减少顶部间距，让搜索框更贴近灵动岛 */
  margin-top: 0.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.explore-page {
  /* 重置顶部padding，让搜索框更贴近灵动岛 */
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
  /* 底部padding保持App.vue中的设置 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  /* 确保滚动条不显示 */
  overflow-x: hidden;
}

/* 确保所有链接没有下划线 */
.explore-page a {
  text-decoration: none;
}

.explore-page a:hover {
  text-decoration: none;
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding: 4px 1.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.filters::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.filters button {
  background-color: #f5f5f5;
  color: #666;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filters button:hover {
  background-color: #e8e8e8;
}

.filters button.active {
  background-color: #000;
  color: white;
}

.filters button .icon {
  flex-shrink: 0;
}

.trail-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  /* 确保滚动条不显示 */
  overflow-x: hidden;
}
</style>

<style>
/* 全局样式：隐藏所有滚动条 */
html, body {
  overflow-x: hidden !important;
}

/* 确保iOS Safari中也不显示滚动条 */
* {
  -webkit-overflow-scrolling: touch;
}

/* 隐藏所有元素的横向滚动条 */
*::-webkit-scrollbar {
  display: none;
}

/* Firefox */
* {
  scrollbar-width: none;
}
</style> 