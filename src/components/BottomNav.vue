<template>
    <nav class="bottom-nav">
      <router-link
        to="/explore"
        class="nav-item"
        :class="{ active: isActive('/explore') }"
      >
        <Compass :size="24" />
        <span>探索</span>
      </router-link>
      <router-link
        to="/community"
        class="nav-item"
        :class="{ active: isActive('/community') }"
      >
        <Users :size="24" />
        <span>社区</span>
      </router-link>
      <router-link
        to="/navigate"
        class="nav-item"
        :class="{ active: isActive('/navigate') }"
      >
        <Map :size="24" />
        <span>导航</span>
      </router-link>
      <router-link
        to="/saved"
        class="nav-item"
        :class="{ active: isActive('/saved') }"
      >
        <Bookmark :size="24" />
        <span>已保存</span>
      </router-link>
      <router-link
        to="/profile"
        class="nav-item"
        :class="{ active: isActive('/profile') }"
      >
        <CircleUserRound :size="24" />
        <span>我的</span>
      </router-link>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { Compass, Users, Map, Bookmark, CircleUserRound } from 'lucide-vue-next';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const isActive = (path: string) => route.path === path;
  </script>
  
  <style scoped>
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    background-color: #1e1e1e;
    padding: 0.5rem 0 env(safe-area-inset-bottom);
    border-top: 1px solid #333;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    z-index: 100;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #888;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    text-decoration: none;
  }
  
  .nav-item.active {
    color: #4CAF50;
  }
  </style>