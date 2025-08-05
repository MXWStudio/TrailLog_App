<template>
  <div class="publish-page">
    <!-- 顶部导航栏 -->
    <header class="publish-header">
      <button class="close-btn" @click="goBack">
        <i class="fas fa-times"></i>
      </button>
      <button class="publish-btn" @click="handlePublish" :disabled="!canPublish">
        发布
      </button>
    </header>

    <!-- 主要内容区域 -->
    <main class="publish-content">
      <!-- 内容编辑 -->
      <textarea 
        v-model="postData.content" 
        placeholder="分享你的新鲜事..."
        class="content-textarea"
        maxlength="1000"
        rows="4"
      ></textarea>

      <!-- 图片上传 -->
      <div class="image-upload-section">
        <div class="image-grid">
          <div 
            v-for="(image, index) in selectedImages" 
            :key="index" 
            class="image-item"
          >
            <img :src="image.preview" :alt="`图片 ${index + 1}`">
            <button class="remove-image" @click.stop="removeImage(index)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedImages.length < 9" class="add-image-box" @click="triggerImageUpload">
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <input 
          ref="imageInput" 
          type="file" 
          accept="image/*" 
          multiple 
          @change="handleImageUpload" 
          style="display: none;"
        >
      </div>

      <!-- 选项列表 -->
      <div class="options-list">
        <!-- 标签 -->
        <div class="option-item">
          <span class="option-label"># 添加标签</span>
          <div class="option-value">
            <span 
              v-if="postData.tags.length"
              class="tag-preview"
            >
              <span v-for="tag in postData.tags" :key="tag" class="tag-chip">
                #{{ tag }}
              </span>
            </span>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
        
        <!-- 定位 -->
        <div class="option-item">
          <span class="option-label">
            <i class="fas fa-map-marker-alt"></i>
            所在位置
          </span>
          <div class="option-value">
            <span>{{ postData.location }}</span>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>

        <!-- 隐私 -->
        <div class="option-item">
          <span class="option-label">
            <i class="fas fa-lock"></i>
            谁可以看
          </span>
          <div class="option-value">
            <div class="secrecy-toggle">
              <button 
                :class="{ active: postData.visibility === 'public' }"
                @click="postData.visibility = 'public'"
              >
                公开
              </button>
              <button 
                :class="{ active: postData.visibility !== 'public' }"
                @click="postData.visibility = 'private'"
              >
                私密
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const imageInput = ref(null);

// 为了匹配设计图的初始状态，我们这里预填一些数据
const selectedImages = ref([
  { preview: new URL('@/assets/Cigar Girl Mountain.jpg', import.meta.url).href }
]);
const postData = ref({
  content: '',
  tags: ['旅行'],
  location: '上海 闸北',
  visibility: 'public', // 'public' or 'private'
});

// 计算属性：是否可以发布
const canPublish = computed(() => {
  return postData.value.content.trim() || selectedImages.value.length > 0;
});

// 方法
const goBack = () => {
  router.back();
};

const triggerImageUpload = () => {
  imageInput.value?.click();
};

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  const remainingSlots = 9 - selectedImages.value.length;
  const filesToProcess = files.slice(0, remainingSlots);

  filesToProcess.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  });
  event.target.value = '';
};

const removeImage = (index) => {
  selectedImages.value.splice(index, 1);
};

const handlePublish = async () => {
  if (!canPublish.value) return;

  try {
    const publishData = {
      ...postData.value,
      images: selectedImages.value.map(img => img.file).filter(Boolean), // 过滤掉预览用的图片
      timestamp: new Date().toISOString()
    };
    console.log('发布数据:', publishData);
    alert('发布成功！');
    router.push('/community');
  } catch (error) {
    console.error('发布失败:', error);
    alert('发布失败，请重试');
  }
};
</script>

<style scoped>
/* 全局字体和图标 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.publish-page {
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 头部 */
.publish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
}

.publish-btn {
  background-color: #1476ff;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.publish-btn:disabled {
  background-color: #fca5a5; /* 红色变浅 */
  cursor: not-allowed;
}

/* 主要内容 */
.publish-content {
  flex: 1;
}

.content-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 18px;
  color: #333;
  padding: 16px;
  min-height: 120px;
  background-color: #f0f2f5;
  border-radius: 12px;
  box-sizing: border-box;
}

.content-textarea::placeholder {
  color: #c7c7cc;
}

/* 图片上传 */
.image-upload-section {
  padding: 16px 0;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item,
.add-image-box {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-item {
  position: relative;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.add-image-box {
  border: 1px solid #e0e0e0;
  background-color: #fafafa;
  color: #c7c7cc;
  font-size: 24px;
  cursor: pointer;
}

/* 选项列表 */
.options-list {
  margin-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}

.option-label {
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label .fas {
  color: #8e8e93;
}

.option-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #8e8e93;
}

.option-value .fas {
  font-size: 14px;
}

.tag-preview {
  display: flex;
  gap: 6px;
}

.tag-chip {
  color: #8e8e93;
}


/* 隐私切换开关 */
.secrecy-toggle {
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 8px;
  padding: 2px;
}

.secrecy-toggle button {
  border: none;
  background-color: transparent;
  padding: 4px 12px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secrecy-toggle button.active {
  background-color: #008cff;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

</style>
