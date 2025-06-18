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
  padding: 0.7rem 1rem;
  margin-bottom: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 999px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
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
  padding-bottom: 0.5rem;
}

.filters button {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.filters button.active {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

.trail-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style> 