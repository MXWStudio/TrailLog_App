´<template>
  <div class="explore-page">
    <input
      v-model="searchText"
      type="text"
      placeholder="搜索步道/关键词..."
      class="search-input"
    />
    <div class="filters">
      <button class="active">附近</button>
      <button>绝美风光</button>
      <button>编辑精选</button>
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
.search-input {
  width: 100%;
  padding: 12px 20px;
  margin-bottom: 1.2rem;
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
  padding: 1rem;
  padding-bottom: 5rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding: 4px;
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
}

.filters button:hover {
  background-color: #e8e8e8;
}

.filters button.active {
  background-color: #000;
  color: white;
}

.trail-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style> 