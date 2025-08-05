<template>
  <div class="community-page">
    <!-- 顶部导航栏 -->
    <header class="community-header">
      <div class="header-content">
        <div class="nav-tabs">
          <button 
            class="nav-tab" 
            :class="{ active: activeTab === 'nearby' }"
            @click="switchTab('nearby')"
          >
            附近
          </button>
          <button 
            class="nav-tab" 
            :class="{ active: activeTab === 'publish' }"
            @click="switchTab('publish')"
          >
            发布
          </button>
          <button 
            class="nav-tab" 
            :class="{ active: activeTab === 'search' }"
            @click="switchTab('search')"
          >
            搜索
          </button>
        </div>
      </div>
    </header>

    <!-- 搜索栏（当选择搜索时显示） -->
    <div v-if="activeTab === 'search'" class="search-container">
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索用户、话题或内容..."
          class="search-input"
        >
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="explore-content">
      <!-- 附近动态 -->
      <div v-if="activeTab === 'nearby'" class="local-feed">
        <post-card v-for="post in filteredLocalPosts" :key="post.id" :post="post" />
        <div v-if="filteredLocalPosts.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#ddd"/>
          </svg>
          <p>附近暂无新动态</p>
          <p class="empty-subtitle">成为第一个分享徒步体验的人吧！</p>
        </div>
      </div>

      <!-- 发布页面 -->
      <div v-if="activeTab === 'publish'" class="publish-section">
        <div class="publish-card" @click="goToPublish">
          <div class="publish-content">
            <i class="fas fa-plus-circle publish-icon"></i>
            <div class="publish-text">
              <h3>分享你的徒步体验</h3>
              <p>记录精彩瞬间，与朋友分享你的徒步故事</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="activeTab === 'search'" class="search-results">
        <div v-if="searchQuery && searchResults.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#ddd" stroke-width="2"/>
          </svg>
          <p>未找到相关内容</p>
          <p class="empty-subtitle">尝试其他关键词或话题</p>
        </div>
        <div v-else-if="!searchQuery" class="search-suggestions">
          <h3>热门搜索</h3>
          <div class="suggestion-tags">
            <span class="suggestion-tag" @click="searchQuery = '青城山'">青城山</span>
            <span class="suggestion-tag" @click="searchQuery = '四姑娘山'">四姑娘山</span>
            <span class="suggestion-tag" @click="searchQuery = '徒步装备'">徒步装备</span>
            <span class="suggestion-tag" @click="searchQuery = '露营'">露营</span>
            <span class="suggestion-tag" @click="searchQuery = '摄影'">摄影</span>
            <span class="suggestion-tag" @click="searchQuery = '美食'">美食</span>
          </div>
        </div>
        <post-card v-else v-for="post in searchResults" :key="post.id" :post="post" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import PostCard from '@/components/PostCard.vue';
import qingchengMountain from '@/assets/qingcheng_mountain.jpg';
import cigarGirlMountain from '@/assets/Cigar Girl Mountain.jpg';

const router = useRouter();

// 响应式数据
const activeTab = ref('nearby');
const searchQuery = ref('');
const localPosts = ref([]);
const searchResults = ref([]);

// 过滤后的帖子列表
const filteredLocalPosts = computed(() => {
  return localPosts.value;
});

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    performSearch(newQuery);
  } else {
    searchResults.value = [];
  }
});

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'publish') {
    // 如果点击发布，直接跳转到发布页面
    goToPublish();
  }
};

// 跳转到发布页面
const goToPublish = () => {
  router.push('/publish');
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
};

// 执行搜索
const performSearch = (query) => {
  // 模拟搜索功能
  const results = localPosts.value.filter(post => 
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.location.toLowerCase().includes(query.toLowerCase()) ||
    post.author.name.toLowerCase().includes(query.toLowerCase())
  );
  searchResults.value = results;
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
      recap: true,
      distance: '7.57 km',
      elevation: '614 m',
      duration: '4h 31m',
      rating: 4,
      commentCount: 12
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
      recap: false,
      distance: '12.3 km',
      elevation: '892 m',
      duration: '6h 15m',
      rating: 5,
      commentCount: 8
    },
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
      recap: true,
      distance: '18.5 km',
      elevation: '1200 m',
      duration: '8h 45m',
      rating: 5,
      commentCount: 25
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
  background-color: #fff;
  overflow: hidden;
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

/* 顶部导航栏 */
.community-header {
  background-color: #fff;
  border-bottom: 1px solid #f0f2f5;
  padding-top: calc(env(safe-area-inset-top, 0px) + 12px);
  padding-bottom: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  padding: 0 16px;
}

.nav-tabs {
  display: flex;
  background-color: #f0f2f5;
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}

.nav-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-tab.active {
  background-color: #fff;
  color: #007AFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-tab:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 搜索容器 */
.search-container {
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f2f5;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 12px;
  padding: 12px 16px;
}

.search-icon {
  color: #8e8e93;
  margin-right: 12px;
  font-size: 16px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  color: #333;
}

.search-input::placeholder {
  color: #8e8e93;
}

.clear-btn {
  background: none;
  border: none;
  color: #8e8e93;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.clear-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.explore-content {
  flex: 1;
  padding: 16px;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.local-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 发布区域 */
.publish-section {
  padding: 20px 0;
}

.publish-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.publish-card:hover {
  transform: translateY(-2px);
}

.publish-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.publish-icon {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.9);
}

.publish-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.publish-text p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 搜索结果 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-suggestions {
  padding: 20px 0;
}

.search-suggestions h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.suggestion-tag {
  background-color: #f0f2f5;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestion-tag:hover {
  background-color: #e0e0e0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.empty-state .empty-subtitle {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

/* 确保内容区域可以正常滚动 */
.explore-content::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.explore-content {
  -webkit-overflow-scrolling: touch;
}

/* iOS 安全区域适配 */
@supports (padding: max(0px)) {
  .community-header {
    padding-top: max(calc(env(safe-area-inset-top, 0px) + 8px), 8px);
  }
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

/* iOS 状态栏适配 */
@supports (padding-top: env(safe-area-inset-top)) {
  .community-page {
    padding-top: env(safe-area-inset-top);
  }
}
</style>