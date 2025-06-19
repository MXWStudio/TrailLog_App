<template>
  <div id="app">
    <router-view></router-view>
    <nav class="bottom-nav">
      <router-link to="/explore" class="nav-item">
        <i class="fas fa-compass"></i>
        <span>探索</span>
      </router-link>
      <router-link to="/community" class="nav-item">
        <i class="fas fa-users"></i>
        <span>社区</span>
      </router-link>
      <router-link to="/navigate" class="nav-item">
        <i class="fas fa-map-marked-alt"></i>
        <span>导航</span>
      </router-link>
      <router-link to="/saved" class="nav-item">
        <i class="fas fa-bookmark"></i>
        <span>收藏</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <i class="fas fa-user-circle"></i>
        <span>个人</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
// Vue Router 设置在 main.ts 或 router/index.ts 中
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
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 8px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
}

.bottom-nav .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #888;
  font-size: 12px;
}

.bottom-nav .nav-item.router-link-active {
  color: #000;
  font-weight: bold;
}

.bottom-nav .nav-item i {
  font-size: 22px;
  margin-bottom: 3px;
}
</style>