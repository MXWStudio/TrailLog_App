<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-0">
    <div class="app-shell w-full max-w-full bg-white shadow-lg flex flex-col relative rounded-2xl overflow-hidden h-screen" style="max-width:430px;">
      <main class="flex-1 w-full flex flex-col overflow-y-auto pb-16">
        <router-view />
      </main>
      <BottomNav />
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomNav from './components/BottomNav.vue';
// 组件逻辑将在这里添加
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #f3f4f6;
}

#app {
  height: 100%;
}

/* The .app-shell styles are now handled by Tailwind classes directly on the element:
   max-w-[430px] h-[844px] rounded-2xl overflow-hidden
  box-sizing: border-box;
  border-radius: 16px;
  overflow: hidden;
  min-height: 100vh;
*/

.app-tabbar {
  z-index: 20;
}

@supports (padding: max(0px)) {
  .max-w-md {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
}
</style>