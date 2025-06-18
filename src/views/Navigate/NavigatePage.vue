<template>
  <div class="navigate-page">
    <div class="map-container">
      <!-- 地图组件将在这里添加 -->
      <div class="map-placeholder">
        <p>地图加载中...</p>
      </div>
    </div>
    
    <div class="route-info">
      <h2>当前路线</h2>
      <div class="route-stats">
        <div class="stat-item">
          <span class="label">距离</span>
          <span class="value">0.0 km</span>
        </div>
        <div class="stat-item">
          <span class="label">海拔</span>
          <span class="value">0 m</span>
        </div>
        <div class="stat-item">
          <span class="label">预计时间</span>
          <span class="value">0:00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导航页面的逻辑将在这里添加
</script>

<style scoped>
.navigate-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  position: relative;
  background-color: #1e1e1e;
}

.map-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.route-info {
  background-color: #2a2a2a;
  padding: 1rem;
  border-top: 1px solid #333;
}

.route-info h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #fff;
}

.route-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-item .label {
  font-size: 0.8rem;
  color: #888;
}

.stat-item .value {
  font-size: 1.1rem;
  color: #fff;
  font-weight: 500;
}
</style> 