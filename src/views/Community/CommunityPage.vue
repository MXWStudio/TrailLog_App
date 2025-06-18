<template>
  <div class="explore-page">
    <header class="explore-header">
      <nav>
        <button @click="activeTab = 'local'" :class="{ active: activeTab === 'local' }">本地</button>
        <button @click="activeTab = 'following'" :class="{ active: activeTab === 'following' }">关注</button>
      </nav>
      <div class="search-bar">
        <input type="text" placeholder="按目的地探索" v-model="searchQuery">
        <i class="icon-search"></i>
      </div>
    </header>

    <main class="explore-content">
      <div v-if="activeTab === 'local'" class="local-feed">
        <post-card v-for="post in localPosts" :key="post.id" :post="post" />
        <p v-if="localPosts.length === 0">附近暂无新动态。</p>
      </div>
      <div v-if="activeTab === 'following'" class="following-feed">
        <post-card v-for="post in followingPosts" :key="post.id" :post="post" />
        <p v-if="followingPosts.length === 0">关注的用户暂无新动态。</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PostCard from '@/components/PostCard.vue'; // 假设PostCard是单个帖子卡片组件

const activeTab = ref('local');
const searchQuery = ref('');
const localPosts = ref([]);
const followingPosts = ref([]);

// 模拟数据加载
onMounted(() => {
  // 实际项目中会从API获取数据
  localPosts.value = [
    { id: 1, author: { name: 'Bob Duan', avatar: 'path/to/bob_avatar.jpg' }, date: 'Jun 1', title: '青城山徒步下午茶', location: 'Qingcheng Mountain Hike', imageUrl: 'path/to/qingcheng_mountain.jpg', recap: true },
    { id: 2, author: { name: 'Local Hiker', avatar: 'path/to/local_hiker_avatar.jpg' }, date: 'May 28', title: '龙泉山观日出', location: 'Longquan Mountain', imageUrl: 'path/to/longquan_mountain.jpg', recap: false },
  ];
  followingPosts.value = [
    { id: 3, author: { name: 'Friend A', avatar: 'path/to/friend_a_avatar.jpg' }, date: 'Jun 10', title: '贡嘎雪山穿越', location: 'Mount Gongga', imageUrl: 'path/to/gongga_mountain.jpg', recap: true },
  ];
});
</script>

<style scoped>
.explore-page {
  /* 样式与设计图保持一致 */
  background-color: #f8f8f8;
}

.explore-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.explore-header nav button {
  padding: 8px 15px;
  border: none;
  background: none;
  font-size: 16px;
  color: #888;
  cursor: pointer;
}

.explore-header nav button.active {
  color: #000;
  font-weight: bold;
  border-bottom: 2px solid #000; /* 激活状态下划线 */
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 25px;
  padding: 8px 15px;
  margin-top: 10px;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
}

.search-bar .icon-search {
  /* 搜索图标样式 */
}

.explore-content {
  padding: 10px;
}
</style>