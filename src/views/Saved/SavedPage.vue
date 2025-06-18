<template>
  <div class="saved-page">
    <div class="tabs">
      <button class="tab active">列表</button>
      <button class="tab">公园</button>
      <button class="tab">下载</button>
    </div>

    <div class="content">
      <div class="empty-state">
        <p>暂无收藏内容</p>
        <button class="create-btn">创建新列表</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 收藏页面的逻辑将在这里添加
</script>

<style scoped>
.saved-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.tab {
  background: none;
  border: none;
  color: #888;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 999px;
  transition: all 0.2s;
}

.tab.active {
  background-color: #4CAF50;
  color: white;
}

.content {
  flex: 1;
  padding: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  gap: 1rem;
}

.create-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #45a049;
}
</style> 