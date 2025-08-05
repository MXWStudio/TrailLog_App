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
        <span>社区</span>
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
/* 添加CSS变量，兼容不支持safe area的设备 */
:root {
  --safe-area-inset-top: 0px;
  --safe-area-inset-right: 0px;
  --safe-area-inset-bottom: 0px;
  --safe-area-inset-left: 0px;
}

/* iOS安全区域支持 */
@supports (padding: max(0px)) {
  :root {
    --safe-area-inset-top: env(safe-area-inset-top);
    --safe-area-inset-right: env(safe-area-inset-right);
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-left: env(safe-area-inset-left);
  }
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f8f8;
  /* 只设置左右和底部的安全区域，顶部由页面容器控制 */
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
  padding-bottom: var(--safe-area-inset-bottom);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--safe-area-inset-top) - var(--safe-area-inset-bottom));
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  border-radius: 0; /* 移除圆角，在iOS设备上使用全屏 */
  overflow: hidden;
  /* 为底部导航栏和安全区域留出空间 */
  padding-bottom: calc(80px + var(--safe-area-inset-bottom));
  position: relative;
}

/* iOS设备上移除容器限制 */
@media screen and (max-width: 430px) {
  body {
    background-color: #fff;
  }
  
  #app {
    max-width: none;
    width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
}

.bottom-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 12px 16px;
  padding-bottom: max(12px, var(--safe-area-inset-bottom));
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  box-sizing: border-box;
}

/* 移除移动设备上的圆角 */
@media screen and (max-width: 430px) {
  .bottom-nav {
    max-width: none;
    border-radius: 0;
    left: 0;
    right: 0;
    transform: none;
  }
}

.bottom-nav .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #888;
  font-size: 11px;
  transition: all 0.3s ease;
  padding: 6px 8px;
  border-radius: 12px;
  flex: 1;
  max-width: 60px;
  min-width: 40px;
}

.bottom-nav .nav-item:hover {
  background-color: #f5f5f5;
}

.bottom-nav .nav-item.router-link-active {
  color: #007AFF;
  font-weight: 600;
}

.bottom-nav .nav-item i {
  font-size: 22px;
  margin-bottom: 2px;
}

/* 确保页面内容不被底部导航栏和安全区域遮挡 */
.explore-page,
.community-page,
.navigate-page,
.saved-page,
.profile-page {
  padding-bottom: calc(100px + var(--safe-area-inset-bottom));
  /* 减少顶部间距，让搜索框更贴近灵动岛 */
  padding-top: calc(var(--safe-area-inset-top) + 0px);
  /* 左右安全区域 */
  padding-left: max(16px, var(--safe-area-inset-left));
  padding-right: max(16px, var(--safe-area-inset-right));
}

/* 探索页面特殊处理，进一步减少顶部间距 */
.explore-page {
  padding-top: calc(var(--safe-area-inset-top) + 0px);
  padding-left: 0; /* 移除左右padding，让内容区域自己处理 */
  padding-right: 0;
}

/* 社区页面特殊处理 */
.community-page {
  padding-top: 0; /* 完全移除顶部padding，让header自己处理安全区域 */
  padding-left: 0; /* 移除左右padding，让内容区域自己处理 */
  padding-right: 0;
  /* 确保没有额外的顶部间距 */
  margin-top: 0;
}

/* 状态栏区域处理 */
.page-header,
.explore-header,
.search-container {
  /* 确保头部区域在安全区域内 */
  margin-top: 0;
  padding-top: 0;
}

/* 确保所有链接没有下划线 */
a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

/* router-link 样式 */
.router-link-active {
  text-decoration: none;
}

.router-link-exact-active {
  text-decoration: none;
}

/* 全局隐藏滚动条 */
html, body {
  overflow-x: hidden !important;
}

/* 隐藏所有元素的横向滚动条 */
*::-webkit-scrollbar {
  display: none;
}

/* Firefox */
* {
  scrollbar-width: none;
}

/* 确保iOS Safari中也不显示滚动条 */
* {
  -webkit-overflow-scrolling: touch;
}
</style>