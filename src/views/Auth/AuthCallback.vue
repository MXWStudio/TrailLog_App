<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg v-if="loading" class="h-10 w-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else-if="success" class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="mt-8 text-3xl font-bold text-gray-900">
          {{ title }}
        </h2>
        <p class="mt-3 text-base text-gray-600">
          {{ message }}
        </p>
      </div>

      <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">认证失败</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !error" class="text-center">
        <button
          @click="goToHome"
          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          继续
        </button>
      </div>

      <!-- 加载动画 -->
      <div v-if="loading" class="text-center">
        <div class="flex justify-center">
          <div class="animate-pulse text-gray-500 text-sm">
            正在处理您的认证请求...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/utils/supabase';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const error = ref('');

const title = computed(() => {
  if (loading.value) return '正在处理认证...';
  if (error.value) return '认证失败';
  return '认证成功';
});

const message = computed(() => {
  if (loading.value) return '请稍候，我们正在验证您的身份';
  if (error.value) return '无法完成认证流程，请重试';
  return '您已成功登录，正在跳转...';
});

const handleAuthCallback = async () => {
  try {
    console.log('[AuthCallback] 开始处理认证回调...');
    
    // 获取URL中的错误参数
    const errorParam = route.query.error;
    const errorDescription = route.query.error_description;
    
    if (errorParam) {
      console.error('[AuthCallback] 认证回调包含错误:', errorParam, errorDescription);
      error.value = errorDescription || errorParam;
      loading.value = false;
      return;
    }

    // 处理Supabase认证回调
    const { data, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('[AuthCallback] 获取会话失败:', authError);
      error.value = authError.message;
      loading.value = false;
      return;
    }

    if (data.session) {
      console.log('[AuthCallback] 认证成功，用户已登录');
      success.value = true;
      
      // 更新auth store状态
      await authStore.initialize();
      
      // 延迟跳转
      setTimeout(() => {
        router.push('/explore');
      }, 2000);
    } else {
      console.error('[AuthCallback] 认证失败，未获取到会话');
      error.value = '认证失败，请重试';
    }
  } catch (err) {
    console.error('[AuthCallback] 处理认证回调时发生异常:', err);
    error.value = '处理认证时发生未知错误';
  } finally {
    loading.value = false;
  }
};

const goToHome = () => {
  router.push('/explore');
};

onMounted(() => {
  handleAuthCallback();
});
</script>

<style scoped>
/* 使用Tailwind CSS，不需要额外的样式 */
</style> 