<template>
  <div class="publish-page">
    <!-- 顶部导航栏 -->
    <header class="publish-header">
      <div class="nav-container">
        <button class="back-btn" @click="goBack">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h1 class="page-title">发布动态</h1>
        <button class="publish-btn" @click="handlePublish" :disabled="!canPublish">
          发布
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="publish-content">
      <!-- 内容编辑区域 -->
      <section class="main-section">
        <div class="content-row">
          <!-- 图片添加 -->
          <div class="form-item">
            <label class="item-label">📸 添加图片</label>
            <div class="image-upload-area" @click="triggerImageUpload">
              <div v-if="!selectedImages.length" class="upload-placeholder">
                <i class="fas fa-camera"></i>
                <span>最多9张</span>
              </div>
              <div v-else class="image-grid">
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
                <div v-if="selectedImages.length < 9" class="add-more-btn" @click="triggerImageUpload">
                  <i class="fas fa-plus"></i>
                </div>
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

          <!-- 标题和内容 -->
          <div class="form-item">
            <label class="item-label">📝 标题</label>
            <input 
              v-model="postData.title" 
              type="text" 
              placeholder="添加标题..."
              class="compact-input"
              maxlength="50"
            >
            <span class="char-count">{{ postData.title.length }}/50</span>
          </div>

          <div class="form-item">
            <label class="item-label">📄 正文</label>
            <textarea 
              v-model="postData.content" 
              placeholder="分享你的体验..."
              class="compact-textarea"
              maxlength="1000"
              rows="3"
            ></textarea>
            <span class="char-count">{{ postData.content.length }}/1000</span>
          </div>

          <!-- 标签 -->
          <div class="form-item">
            <label class="item-label">🏷️ 标签</label>
            <div class="tags-compact">
              <div class="selected-tags">
                <span 
                  v-for="(tag, index) in postData.tags" 
                  :key="index" 
                  class="tag-item"
                >
                  #{{ tag }}
                  <button @click="removeTag(index)" class="remove-tag">×</button>
                </span>
              </div>
              <input 
                v-model="currentTag" 
                @keyup.enter="addTag"
                @keyup.space="addTag"
                type="text" 
                placeholder="添加标签..."
                class="tag-input-compact"
                maxlength="20"
              >
            </div>
            <div class="popular-tags-compact">
              <button 
                v-for="tag in popularTags.slice(0, 6)" 
                :key="tag" 
                @click="addPopularTag(tag)"
                class="popular-tag-compact"
                :disabled="postData.tags.includes(tag)"
              >
                #{{ tag }}
              </button>
            </div>
          </div>

          <!-- 定位和设置 -->
          <div class="form-row">
            <div class="form-item half">
              <label class="item-label">📍 定位</label>
              <div class="location-compact">
                <input 
                  v-model="postData.location" 
                  type="text" 
                  placeholder="添加位置..."
                  class="compact-input"
                >
                <button class="location-btn" @click="getCurrentLocation">
                  <i class="fas fa-crosshairs"></i>
                </button>
              </div>
            </div>

            <div class="form-item half">
              <label class="item-label">⚙️ 设置</label>
              <div class="settings-compact">
                <select v-model="postData.visibility" class="compact-select">
                  <option value="public">公开</option>
                  <option value="friends">好友</option>
                  <option value="private">私密</option>
                </select>
                <select v-model="postData.activityType" class="compact-select">
                  <option value="">类型</option>
                  <option value="hiking">徒步</option>
                  <option value="climbing">攀岩</option>
                  <option value="camping">露营</option>
                  <option value="cycling">骑行</option>
                  <option value="photography">摄影</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 开关选项 -->
          <div class="form-item">
            <div class="toggle-options">
              <label class="toggle-option">
                <input 
                  v-model="postData.allowComments" 
                  type="checkbox"
                  class="toggle-checkbox"
                >
                <span class="toggle-text">允许评论</span>
              </label>
              <label class="toggle-option">
                <input 
                  v-model="postData.showLocation" 
                  type="checkbox"
                  class="toggle-checkbox"
                >
                <span class="toggle-text">显示位置</span>
              </label>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 响应式数据
const selectedImages = ref([]);
const imageInput = ref(null);
const currentTag = ref('');
const locationLoading = ref(false);

// 帖子数据
const postData = ref({
  title: '',
  content: '',
  tags: [],
  location: '',
  visibility: 'public',
  allowComments: true,
  showLocation: true,
  activityType: ''
});

// 热门标签
const popularTags = ref([
  '徒步', '登山', '露营', '摄影', '日出', '云海', 
  '攻略', '装备', '安全', '美食', '风景', '体验'
]);

// 计算属性：是否可以发布
const canPublish = computed(() => {
  return postData.value.title.trim() && 
         postData.value.content.trim() && 
         selectedImages.value.length > 0;
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

  // 重置input值
  event.target.value = '';
};

const removeImage = (index) => {
  selectedImages.value.splice(index, 1);
};

const addTag = () => {
  const tag = currentTag.value.trim().replace(/^#+/, ''); // 移除开头的#号
  if (tag && !postData.value.tags.includes(tag) && postData.value.tags.length < 10) {
    postData.value.tags.push(tag);
    currentTag.value = '';
  }
};

const addPopularTag = (tag) => {
  if (!postData.value.tags.includes(tag) && postData.value.tags.length < 10) {
    postData.value.tags.push(tag);
  }
};

const removeTag = (index) => {
  postData.value.tags.splice(index, 1);
};

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    locationLoading.value = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 这里应该调用逆地理编码API将坐标转换为地址
        // 暂时使用模拟数据
        postData.value.location = '四川省成都市青城山';
        locationLoading.value = false;
      },
      (error) => {
        console.error('获取位置失败:', error);
        locationLoading.value = false;
        alert('获取位置失败，请手动输入位置信息');
      }
    );
  } else {
    alert('浏览器不支持定位功能');
  }
};

const handlePublish = async () => {
  if (!canPublish.value) return;

  try {
    // 这里应该调用API发布帖子
    const publishData = {
      ...postData.value,
      images: selectedImages.value.map(img => img.file),
      timestamp: new Date().toISOString()
    };

    console.log('发布数据:', publishData);
    
    // 模拟发布成功
    alert('发布成功！');
    router.push('/community');
  } catch (error) {
    console.error('发布失败:', error);
    alert('发布失败，请重试');
  }
};

onMounted(() => {
  // 页面加载时的初始化逻辑
});
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.publish-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #f0f0f0;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.publish-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-btn:hover:not(:disabled) {
  background: #005BB5;
}

.publish-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.publish-content {
  flex: 1;
  padding: 15px;
}

/* 主要内容区域 */
.main-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.content-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 表单项目 */
.form-item {
  display: flex;
  flex-direction: column;
}

.item-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.char-count {
  font-size: 11px;
  color: #999;
  text-align: right;
  margin-top: 4px;
}

/* 双列布局 */
.form-row {
  display: flex;
  gap: 15px;
}

.form-item.half {
  flex: 1;
}

/* 紧凑输入框 */
.compact-input {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.compact-input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

.compact-textarea {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.compact-textarea:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

/* 图片上传区域 */
.image-upload-area {
  cursor: pointer;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  color: #999;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  background: #f8f9fa;
  color: #007AFF;
}

.upload-placeholder i {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-placeholder span {
  font-size: 12px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
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
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.add-more-btn {
  aspect-ratio: 1;
  border: 1px dashed #ccc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-more-btn:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.add-more-btn i {
  font-size: 18px;
}

/* 标签区域 */
.tags-compact {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  min-height: 40px;
  transition: all 0.3s ease;
}

.tags-compact:focus-within {
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #007AFF;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.tag-input-compact {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  background: transparent;
}

.popular-tags-compact {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.popular-tag-compact {
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popular-tag-compact:hover:not(:disabled) {
  background: #007AFF;
  color: white;
}

.popular-tag-compact:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 定位区域 */
.location-compact {
  display: flex;
  gap: 8px;
}

.location-btn {
  background: #f0f0f0;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.location-btn:hover {
  background: #007AFF;
  color: white;
  border-color: #007AFF;
}

/* 设置区域 */
.settings-compact {
  display: flex;
  gap: 8px;
}

.compact-select {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  flex: 1;
  cursor: pointer;
  background: white;
}

.compact-select:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

/* 开关选项 */
.toggle-options {
  display: flex;
  gap: 20px;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.toggle-checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  appearance: none;
  transition: all 0.3s ease;
}

.toggle-checkbox:checked {
  background: #007AFF;
  border-color: #007AFF;
}

.toggle-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: -1px;
  left: 1px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.toggle-text {
  user-select: none;
}
</style> 