<template>
  <div class="community-page">
    <header class="explore-header">
      <div class="nav-container">
        <nav>
          <button @click="activeTab = 'local'" :class="{ active: activeTab === 'local' }">本地</button>
          <button @click="activeTab = 'following'" :class="{ active: activeTab === 'following' }">关注</button>
        </nav>
        <div class="header-actions">
          <button class="publish-btn" @click="goToPublish">
            <i class="fas fa-plus"></i>
            发布
          </button>
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
import { useRouter } from 'vue-router';
import PostCard from '@/components/PostCard.vue'; // 假设PostCard是单个帖子卡片组件
import IconMaterialSymbolsSearchRounded from '~icons/material-symbols/search-rounded';
import qingchengMountain from '@/assets/qingcheng_mountain.jpg';
import cigarGirlMountain from '@/assets/Cigar Girl Mountain.jpg';

const router = useRouter();

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

// 跳转到发布页面
const goToPublish = () => {
  router.push('/publish');
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
      imageUrl: qingchengMountain, 
      recap: true 
    },
    { 
      id: 2, 
      author: { 
        name: 'Local Hiker', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Local_Hiker' 
      }, 
      date: 'May 28', 
      title: '四姑娘山观日出', 
      location: 'Four Sisters Mountain', 
      imageUrl: cigarGirlMountain, 
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
      imageUrl: qingchengMountain, 
      recap: true 
    },
  ];
});
</script>

<style scoped>
.community-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* 完全重置顶部间距，让内容更贴近灵动岛 */
  padding-top: 0 !important;
  margin-top: 0 !important;
  /* 确保没有其他样式影响 */
  top: 0;
}

/* 确保所有链接和按钮文字没有下划线 */
.community-page a,
.community-page button,
.community-page input,
.community-page textarea,
.community-page * {
  text-decoration: none;
}

.community-page a:hover,
.community-page button:hover {
  text-decoration: none;
}

.explore-header {
  background-color: #fff;
  padding: 8px 15px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  /* 完全最小化顶部间距，让导航栏更贴近灵动岛 */
  padding-top: env(safe-area-inset-top, 0px);
  /* 去除边界线 */
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-btn:hover {
  background: #005BB5;
  transform: translateY(-1px);
}

.publish-btn i {
  font-size: 12px;
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
  flex: 1;
  padding: 8px 15px;
  background-color: #fff;
  overflow-y: auto;
  /* 进一步减少顶部间距，让内容更贴近导航栏 */
  padding-top: 4px;
}

.local-feed,
.following-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 确保内容区域可以正常滚动 */
.explore-content::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.explore-content {
  -webkit-overflow-scrolling: touch;
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