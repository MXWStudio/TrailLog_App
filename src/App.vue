<template>
  <div id="app">
    <router-view></router-view>
    <nav v-if="!isTrailDetailPage" class="bottom-nav">
      <router-link to="/explore" class="nav-item" @click="handleNavClick('explore')">
        <i class="fas fa-compass"></i>
        <span>探索</span>
      </router-link>
      <router-link to="/community" class="nav-item" @click="handleNavClick('community')">
        <i class="fas fa-users"></i>
        <span>发布</span>
      </router-link>
      <router-link to="/navigate" class="nav-item" @click="handleNavClick('navigate')">
        <i class="fas fa-map-marked-alt"></i>
        <span>导航</span>
      </router-link>
      <router-link to="/saved" class="nav-item" @click="handleNavClick('saved')">
        <i class="fas fa-bookmark"></i>
        <span>收藏</span>
      </router-link>
      <router-link to="/profile" class="nav-item" @click="handleNavClick('profile')">
        <i class="fas fa-user-circle"></i>
        <span>个人</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 检查当前路由是否是徒步路线详情页
const isTrailDetailPage = computed(() => {
  return route.path.startsWith('/trail/')
})

// 处理导航点击事件
const handleNavClick = (routeName: string) => {
  console.log('导航点击:', routeName)
  console.log('当前路由:', route.path)
}

// 调试：监听路由变化
watch(route, (newRoute) => {
  console.log('路由变化:', newRoute.path, newRoute.name)
}, { immediate: true })

// 调试：确保路由器正常工作
console.log('路由器初始化状态:', router.hasRoute('explore'), router.hasRoute('community'))
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f8f8;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  border-radius: 16px;
  overflow: hidden;
  padding-bottom: 80px; /* 为底部导航栏留出空间 */
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  border-radius: 16px 16px 0 0;
}

.bottom-nav .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #888;
  font-size: 12px;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 12px;
  min-width: 60px;
}

.bottom-nav .nav-item:hover {
  background-color: #f5f5f5;
}

.bottom-nav .nav-item.router-link-active {
  color: #007AFF;
  font-weight: 600;
}

.bottom-nav .nav-item i {
  font-size: 24px;
  margin-bottom: 4px;
}

/* 确保页面内容不被底部导航栏遮挡 */
.explore-page,
.community-page,
.navigate-page,
.saved-page,
.profile-page {
  padding-bottom: 100px;
}
</style>