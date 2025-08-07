<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo和标题 -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
        <h2 class="mt-8 text-3xl font-bold text-gray-900">
          创建您的TrailLog账户
        </h2>
        <p class="mt-3 text-base text-gray-600">
          开始您的徒步之旅，记录每一次精彩瞬间
        </p>
      </div>

      <!-- 第三方登录按钮 -->
      <div class="space-y-4">
        <!-- Google登录按钮 -->
        <button
          @click="handleGoogleSignIn"
          :disabled="loading"
          class="group relative w-full flex justify-center items-center py-3.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-4">
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </span>
          <span v-if="loading && currentProvider === 'google'" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            注册中...
          </span>
          <span v-else>使用 Google 继续</span>
        </button>

        <!-- Apple登录按钮 -->
        <button
          @click="handleAppleSignIn"
          :disabled="loading"
          class="group relative w-full flex justify-center items-center py-3.5 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-4">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </span>
          <span v-if="loading && currentProvider === 'apple'" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            注册中...
          </span>
          <span v-else>使用 Apple 继续</span>
        </button>
      </div>

      <!-- 分割线 -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-500 font-medium">或使用邮箱注册</span>
        </div>
      </div>

      <!-- 注册表单 -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              邮箱地址
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="请输入您的邮箱地址"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                v-model="password"
                class="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="请输入密码（至少6位）"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-semibold text-gray-700 mb-2">
              确认密码
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                v-model="passwordConfirm"
                class="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="请再次输入密码"
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 服务条款 -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              v-model="agreeToTerms"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-700">
              我已阅读并同意
              <a href="#" class="text-indigo-600 hover:text-indigo-500 transition-colors">服务条款</a>
              和
              <a href="#" class="text-indigo-600 hover:text-indigo-500 transition-colors">隐私政策</a>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !agreeToTerms"
            class="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span v-if="loading && currentProvider === 'email'" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              注册中...
            </span>
            <span v-else>创建账户</span>
          </button>
        </div>
      </form>

      <!-- 消息提示 -->
      <div v-if="successMessage" class="rounded-xl bg-green-50 border border-green-200 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-xl bg-red-50 border border-red-200 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">注册失败</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ errorMessage }}</p>
              <div v-if="errorDetails" class="mt-2">
                <details class="text-xs">
                  <summary class="cursor-pointer text-red-600">查看详细错误信息</summary>
                  <pre class="mt-1 text-xs text-red-600 whitespace-pre-wrap">{{ errorDetails }}</pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 登录链接 -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          已有账户？
          <a
            href="#"
            @click.prevent="goToLogin"
            class="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            立即登录
          </a>
        </p>
      </div>

      <!-- 隐私政策链接 -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          注册即表示您同意我们的
          <a href="#" class="text-indigo-600 hover:text-indigo-500 transition-colors">服务条款</a>
          和
          <a href="#" class="text-indigo-600 hover:text-indigo-500 transition-colors">隐私政策</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 表单数据
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const agreeToTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 状态管理
const loading = ref(false);
const currentProvider = ref<'email' | 'google' | 'apple' | null>(null);
const successMessage = ref('');
const errorMessage = ref('');
const errorDetails = ref('');

// 切换密码显示/隐藏
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 切换确认密码显示/隐藏
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Google登录
const handleGoogleSignIn = async () => {
  console.log('[RegisterPage] 用户点击了Google登录按钮。');
  
  resetMessages();
  loading.value = true;
  currentProvider.value = 'google';
  
  try {
    const result = await authStore.signInWithGoogle();
    
    if (result.success) {
      console.log('[RegisterPage] Google登录成功。');
      successMessage.value = 'Google登录成功！正在跳转...';
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      console.error('[RegisterPage] Google登录失败。错误信息:', result.error);
      errorMessage.value = `Google登录失败: ${result.error}`;
    }
  } catch (error) {
    console.error('[RegisterPage] Google登录过程中发生异常:', error);
    errorMessage.value = 'Google登录过程中发生未知错误';
    errorDetails.value = error instanceof Error ? error.message : String(error);
  } finally {
    loading.value = false;
    currentProvider.value = null;
  }
};

// Apple登录
const handleAppleSignIn = async () => {
  console.log('[RegisterPage] 用户点击了Apple登录按钮。');
  
  resetMessages();
  loading.value = true;
  currentProvider.value = 'apple';
  
  try {
    const result = await authStore.signInWithApple();
    
    if (result.success) {
      console.log('[RegisterPage] Apple登录成功。');
      successMessage.value = 'Apple登录成功！正在跳转...';
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      console.error('[RegisterPage] Apple登录失败。错误信息:', result.error);
      errorMessage.value = `Apple登录失败: ${result.error}`;
    }
  } catch (error) {
    console.error('[RegisterPage] Apple登录过程中发生异常:', error);
    errorMessage.value = 'Apple登录过程中发生未知错误';
    errorDetails.value = error instanceof Error ? error.message : String(error);
  } finally {
    loading.value = false;
    currentProvider.value = null;
  }
};

// 邮箱注册
const handleRegister = async () => {
  console.log('[RegisterPage] 用户点击了注册按钮。');
  
  resetMessages();
  loading.value = true;
  currentProvider.value = 'email';
  
  try {
    // 表单验证
    if (!email.value || !password.value || !passwordConfirm.value) {
      errorMessage.value = '请填写所有必填字段';
      return;
    }
    
    if (password.value !== passwordConfirm.value) {
      console.error('[RegisterPage] 密码与确认密码不匹配。');
      errorMessage.value = '两次输入的密码不一致！';
      return;
    }
    
    if (password.value.length < 6) {
      errorMessage.value = '密码长度至少为6位';
      return;
    }
    
    if (!agreeToTerms.value) {
      errorMessage.value = '请同意服务条款和隐私政策';
      return;
    }
    
    console.log('[RegisterPage] 表单验证通过，准备调用 authStore.signUp...');
    
    const { success, error, message: responseMessage } = await authStore.signUp(email.value, password.value, { 
      username: email.value.split('@')[0] 
    });

    if (success) {
      console.log('[RegisterPage] 注册成功。收到的消息:', responseMessage);
      successMessage.value = responseMessage || '注册成功！请查看邮箱验证链接完成注册。';
      
      console.log('[RegisterPage] 3秒后将跳转到登录页面...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      console.error('[RegisterPage] 注册失败。错误信息:', error);
      errorMessage.value = `注册失败: ${error}`;
      
      // 如果是数据库相关错误，提供更详细的帮助信息
      if (error && error.includes('users')) {
        errorDetails.value = `数据库错误详情: ${error}\n\n可能的解决方案:\n1. 检查数据库表是否已创建\n2. 确认 Supabase 配置是否正确\n3. 联系管理员检查数据库权限`;
      }
    }
  } catch (error) {
    console.error('[RegisterPage] 注册过程中发生异常:', error);
    errorMessage.value = '注册过程中发生未知错误';
    errorDetails.value = error instanceof Error ? error.message : String(error);
  } finally {
    loading.value = false;
    currentProvider.value = null;
    console.log('[RegisterPage] handleRegister 函数执行完毕。');
  }
};

// 重置消息
const resetMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';
  errorDetails.value = '';
};

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* 使用Tailwind CSS，不需要额外的样式 */
</style>
