<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar">
        <img src="https://via.placeholder.com/100" alt="用户头像" />
      </div>
      <h1 class="username">用户名</h1>
      <p class="location">中国</p>
    </div>

    <div class="stats">
      <div class="stat-item">
        <span class="value">0</span>
        <span class="label">关注</span>
      </div>
      <div class="stat-item">
        <span class="value">0</span>
        <span class="label">粉丝</span>
      </div>
      <div class="stat-item">
        <span class="value">0</span>
        <span class="label">活动</span>
      </div>
    </div>

    <div class="tabs">
      <button class="tab active">动态</button>
      <button class="tab">照片</button>
      <button class="tab">评价</button>
      <button class="tab">活动</button>
    </div>

    <div class="content">
      <div class="empty-state">
        <p>暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 个人页面的逻辑将在这里添加
</script>

<style scoped>
.profile-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-header {
  padding: 2rem 1rem;
  text-align: center;
  background-color: #2a2a2a;
}

.avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.location {
  margin: 0.5rem 0 0;
  color: #888;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-item .value {
  font-size: 1.2rem;
  color: white;
  font-weight: 500;
}

.stat-item .label {
  font-size: 0.8rem;
  color: #888;
}

.tabs {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #333;
  overflow-x: auto;
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
  white-space: nowrap;
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
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}
</style> 