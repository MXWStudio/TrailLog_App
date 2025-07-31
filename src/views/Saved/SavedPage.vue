<template>
  <div class="saved-page">
    <header class="saved-header">
      <h1>收藏</h1>
      <nav class="saved-tabs">
        <button @click="activeTab = 'lists'" :class="{ active: activeTab === 'lists' }">列表</button>
        <button @click="activeTab = 'parks'" :class="{ active: activeTab === 'parks' }">公园</button>
        <button @click="activeTab = 'downloads'" :class="{ active: activeTab === 'downloads' }">下载</button>
      </nav>
    </header>

    <main class="saved-content">
      <div v-if="activeTab === 'lists'" class="saved-lists">
        <div class="list-item create-new-list" @click="createNewList">
          <IconMaterialSymbolsAddRounded class="icon-plus" />
          <span>创建新列表</span>
        </div>
        <div class="list-item">
          <IconMaterialSymbolsBookmarkRounded class="icon-bookmark" />
          <span>收藏夹</span>
          <span class="item-count">{{ favoritesCount }} 条路线</span>
        </div>
        <div class="list-item">
          <IconMaterialSymbolsMapRounded class="icon-map" />
          <span>自定义路线和地图</span>
        </div>
      </div>
      <div v-if="activeTab === 'parks'" class="saved-parks">
        <p>暂无收藏的公园。</p>
      </div>
      <div v-if="activeTab === 'downloads'" class="saved-downloads">
        <p>暂无下载的路线或地图。</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconMaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import IconMaterialSymbolsBookmarkRounded from '~icons/material-symbols/bookmark-rounded';
import IconMaterialSymbolsMapRounded from '~icons/material-symbols/map-rounded';

const activeTab = ref('lists');
const favoritesCount = ref(0); // 模拟数据

const createNewList = () => {
  alert('创建新列表功能待实现');
};
</script>

<style scoped>
.saved-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-top: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.saved-header {
  padding: 0 20px;
  margin-bottom: 20px;
}

.saved-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.saved-tabs {
  display: flex;
  gap: 16px;
  padding: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.saved-tabs::-webkit-scrollbar {
  display: none;
}

.saved-tabs button {
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
}

.saved-tabs button:hover {
  background: #e8e8e8;
}

.saved-tabs button.active {
  background: #000;
  color: white;
}

.saved-content {
  padding: 20px;
}

.list-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.list-item .icon-plus,
.list-item .icon-bookmark,
.list-item .icon-map {
  font-size: 22px;
  margin-right: 16px;
  color: #666;
}

.list-item.create-new-list {
  border: 1px dashed #ddd;
  background-color: #fff;
}

.list-item.create-new-list:hover {
  border-color: #999;
}

.list-item.create-new-list .icon-plus {
  color: #000;
}

.list-item span {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.item-count {
  font-size: 14px;
  color: #999;
  margin-left: auto;
  font-weight: normal;
}
</style> 