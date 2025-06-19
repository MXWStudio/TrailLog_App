<template>
  <div class="navigate-page">
    <div class="map-view">
      <div id="map-container"></div>
      <div class="map-controls">
        <button class="control-btn" @click="switchMapMode('2D')" :class="{ active: mapMode === '2D' }">2D</button>
        <button class="control-btn" @click="switchMapMode('3D')" :class="{ active: mapMode === '3D' }">3D</button>
      </div>
    </div>

    <div class="route-details-card">
      <div class="card-header">
        <h2 class="route-name">{{ routeInfo.name }}</h2>
        <span class="clear-btn" @click="clearRoute">清除</span>
      </div>
      <div class="route-stats">
        <div class="stat-item">
          <span class="value">{{ routeInfo.distance }}</span>
          <span class="label">距离</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ routeInfo.elevation }}</span>
          <span class="label">海拔增益</span>
        </div>
        <div class="stat-item">
          <span class="value">{{ routeInfo.duration }}</span>
          <span class="label">预估时间</span>
        </div>
      </div>
      <div class="elevation-profile">
        <img src="@/assets/qingcheng_mountain.jpg" alt="Elevation Profile">
      </div>
      <div class="action-buttons">
        <button class="download-btn" @click="downloadRoute">
          <IconMaterialSymbolsDownloadRounded class="icon-download" /> 下载
        </button>
        <button class="start-btn" @click="startNavigation">
          <IconMaterialSymbolsPlayArrowRounded class="icon-start" /> 开始
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import IconMaterialSymbolsDownloadRounded from '~icons/material-symbols/download-rounded';
import IconMaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';

// 地图实例
let map: any = null;

// 地图模式状态
const mapMode = ref('3D');

// 路线信息
const routeInfo = ref({
  name: '峨眉山徒步',
  distance: '18.02 km',
  elevation: '3,134 m',
  duration: '约 9h 57m'
});

// 初始化高德地图
const initAMap = () => {
  // 这里预留高德地图初始化代码
  // window.AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
  //   map = new window.AMap.Map('map-container', {
  //     zoom: 11,
  //     center: [103.35, 29.58], // 峨眉山坐标
  //     viewMode: mapMode.value === '3D' ? '3D' : '2D',
  //     pitch: mapMode.value === '3D' ? 45 : 0,
  //   });
  //   
  //   map.addControl(new window.AMap.ToolBar());
  //   map.addControl(new window.AMap.Scale());
  // });
};

// 切换地图模式
const switchMapMode = (mode: '2D' | '3D') => {
  mapMode.value = mode;
  if (map) {
    // map.setViewMode(mode === '3D' ? '3D' : '2D');
    // map.setPitch(mode === '3D' ? 45 : 0);
  }
};

// 清除路线
const clearRoute = () => {
  // 清除地图上的路线
  // if (map) {
  //   map.clearMap();
  // }
};

// 下载路线
const downloadRoute = () => {
  // 实现路线下载逻辑
  console.log('下载路线');
};

// 开始导航
const startNavigation = () => {
  // 实现开始导航逻辑
  console.log('开始导航');
};

// 组件挂载时初始化地图
onMounted(() => {
  initAMap();
});

// 组件卸载时销毁地图实例
onUnmounted(() => {
  if (map) {
    // map.destroy();
    map = null;
  }
});
</script>

<style scoped>
.navigate-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
  position: relative;
}

.map-view {
  flex-grow: 1;
  position: relative;
  width: 100%;
  height: 100%;
}

#map-container {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}

.map-controls {
  position: fixed;
  top: 15px;
  right: 15px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 20px;
  padding: 5px;
  display: flex;
  gap: 5px;
  z-index: 100;
}

.map-controls .control-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.map-controls .control-btn.active {
  background-color: #000;
  color: white;
}

.route-details-card {
  background-color: #fff;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  position: fixed; /* 改为固定定位 */
  bottom: 56px; /* 导航栏的高度 */
  left: 0;
  right: 0;
  z-index: 10;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.route-name {
  font-size: 22px;
  margin: 0;
}

.clear-btn {
  color: #666;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #ff4d4f;
}

.route-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
}

.stat-item .value {
  font-size: 18px;
  font-weight: bold;
  display: block;
}

.stat-item .label {
  font-size: 12px;
  color: #888;
}

.elevation-profile {
  height: 100px; /* Placeholder for chart */
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.elevation-profile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 0;
}

.action-buttons button {
  flex-grow: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.download-btn {
  background-color: #f5f5f5;
  color: #666;
}

.download-btn:hover {
  background-color: #e0e0e0;
}

.start-btn {
  background-color: #000;
  color: #fff;
}

.start-btn:hover {
  background-color: #333;
}
</style> 