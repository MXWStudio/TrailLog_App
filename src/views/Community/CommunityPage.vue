<template>
  <div class="explore-page">
    <header class="explore-header">
      <div class="nav-container">
        <nav>
          <button @click="activeTab = 'local'" :class="{ active: activeTab === 'local' }">本地</button>
          <button @click="activeTab = 'following'" :class="{ active: activeTab === 'following' }">关注</button>
        </nav>
        <div class="search-container">
          <div class="search-bar" :class="{ 'search-expanded': isSearchExpanded }">
            <input 
              type="text" 
              placeholder="按目的地探索" 
              v-model="searchQuery"
              v-show="isSearchExpanded"
              ref="searchInput"
              @blur="handleSearchBlur"
            >
            <IconMaterialSymbolsSearchRounded 
              class="icon-search" 
              @click="toggleSearch"
            />
          </div>
        </div>
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
import IconMaterialSymbolsSearchRounded from '~icons/material-symbols/search-rounded';

const activeTab = ref('local');
const searchQuery = ref('');
const isSearchExpanded = ref(false);
const searchInput = ref(null);
const localPosts = ref([]);
const followingPosts = ref([]);

const toggleSearch = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
  if (isSearchExpanded.value) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 0);
  }
};

const handleSearchBlur = () => {
  if (!searchQuery.value) {
    isSearchExpanded.value = false;
  }
};

// 模拟数据加载
onMounted(() => {
  // 实际项目中会从API获取数据
  localPosts.value = [
    { 
      id: 1, 
      author: { 
        name: 'Bob Duan', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob_Duan' 
      }, 
      date: 'Jun 1', 
      title: '青城山徒步', 
      location: 'Qingcheng Mountain Hike', 
      imageUrl: '@/assets/qingcheng_mountain.jpg', 
      recap: true 
    },
    { 
      id: 2, 
      author: { 
        name: 'Local Hiker', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Local_Hiker' 
      }, 
      date: 'May 28', 
      title: '龙泉山观日出', 
      location: 'Longquan Mountain', 
      imageUrl: '@/assets/fushishan_jitian.jpg', 
      recap: false 
    },
  ];
  followingPosts.value = [
    { 
      id: 3, 
      author: { 
        name: 'Friend A', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Friend_A' 
      }, 
      date: 'Jun 10', 
      title: '贡嘎雪山穿越', 
      location: 'Mount Gongga', 
      imageUrl: '@/assets/qingcheng_mountain.jpg', 
      recap: true 
    },
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
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

nav {
  display: flex;
  gap: 16px;
}

nav button {
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

nav button:hover {
  background: #e8e8e8;
}

nav button.active {
  background: #000;
  color: white;
}

.search-container {
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: transparent;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.search-bar.search-expanded {
  background-color: #f5f5f5;
  padding: 8px 16px;
}

.search-bar input {
  width: 0;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #333;
}

.search-bar.search-expanded input {
  width: 180px;
  margin-right: 8px;
}

.search-bar.search-expanded input::placeholder {
  color: #999;
}

.icon-search {
  width: 20px;
  height: 20px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.icon-search:hover {
  background-color: #f0f0f0;
}

.explore-content {
  padding: 15px;
  background-color: #f8f8f8;
}
</style>