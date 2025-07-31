<template>
  <div class="profile-page">
    <header class="profile-header">
      <div class="settings-icons">
        <i class="icon-more">...</i>
      </div>
      <div class="profile-info">
        <div class="avatar-container" @click="showAvatarModal = true">
          <img :src="user.avatar" alt="User Avatar" class="avatar">
          <div class="avatar-edit-overlay">
            <span>编辑</span>
          </div>
        </div>
        <h2>{{ user.name }}</h2>
        <p class="user-location">{{ user.location }}</p>
        <div class="follow-stats">
          <div class="stat-item">
            <span class="value">{{ user.followers }}</span>
            <span class="label">关注者</span>
          </div>
          <div class="stat-item">
            <span class="value">{{ user.following }}</span>
            <span class="label">关注中</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 头像编辑模态框 -->
    <div v-if="showAvatarModal" class="avatar-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>更换头像</h3>
          <button class="close-btn" @click="showAvatarModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="avatar-options">
            <div class="option">
              <h4>上传照片</h4>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload" 
                ref="fileInput"
                style="display: none"
              >
              <button class="upload-btn" @click="$refs.fileInput.click()">
                选择图片
              </button>
            </div>
            <div class="option">
              <h4>生成虚拟头像</h4>
              <div class="avatar-customization">
                <button class="refresh-btn" @click="regenerateAvatar">
                  重新生成
                </button>
                <div class="avatar-preview">
                  <img :src="previewAvatarUrl" alt="Preview Avatar">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAvatarModal = false">取消</button>
          <button class="save-btn" @click="saveAvatar">保存</button>
        </div>
      </div>
    </div>

    <main class="profile-content">
      <div class="stats-card">
        <h3>2025 统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="value">{{ userStats.activities }}</span>
            <span class="label">活动</span>
          </div>
          <div class="stat-item">
            <span class="value">{{ userStats.kilometers }}</span>
            <span class="label">公里</span>
          </div>
        </div>
        <i class="icon-arrow-right"></i>
      </div>

      <nav class="profile-tabs">
        <button @click="activeTab = 'feed'" :class="{ active: activeTab === 'feed' }">动态</button>
        <button @click="activeTab = 'photos'" :class="{ active: activeTab === 'photos' }">照片</button>
        <button @click="activeTab = 'reviews'" :class="{ active: activeTab === 'reviews' }">评论</button>
        <button @click="activeTab = 'activities'" :class="{ active: activeTab === 'activities' }">活动</button>
        <button @click="activeTab = 'comp'" :class="{ active: activeTab === 'comp' }">成就</button>
      </nav>

      <div class="tab-content">
        <div v-if="activeTab === 'feed'">
          <p>这里显示用户的动态，如发布的徒步记录。</p>
        </div>
        <div v-if="activeTab === 'photos'">
          <p>这里显示用户上传的照片。</p>
        </div>
        <div v-if="activeTab === 'reviews'">
          <p>这里显示用户发表的评论。</p>
        </div>
        <div v-if="activeTab === 'activities'">
          <p>这里显示用户的历史活动。</p>
        </div>
        <div v-if="activeTab === 'comp'">
          <p>这里显示用户的成就和勋章。</p>
        </div>
      </div>

      <div class="premium-promo">
        <i class="icon-sparkle">✨</i>
        <span>免费试用 Peak 或 Plus</span>
        <i class="icon-arrow-right"></i>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const showAvatarModal = ref(false);
const fileInput = ref(null);
const avatarSeed = ref(Math.random().toString(36).substring(7));

const user = ref({
  name: 'Miles Walker',
  location: '正在获取位置...',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miles_Walker', // 默认使用 DiceBear 头像
  followers: 0,
  following: 0
});

const previewAvatarUrl = ref(user.value.avatar);

// 重新生成虚拟头像
const regenerateAvatar = () => {
  avatarSeed.value = Math.random().toString(36).substring(7);
  previewAvatarUrl.value = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed.value}`;
};

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewAvatarUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 保存头像
const saveAvatar = () => {
  user.value.avatar = previewAvatarUrl.value;
  showAvatarModal.value = false;
  // 这里可以添加保存到后端的逻辑
};

const userStats = ref({
  activities: 1,
  kilometers: 0
});

const activeTab = ref('feed');

// 获取当前位置
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // 使用高德地图 API 进行逆地理编码
          // 实际项目中需要替换为真实的高德地图 API 调用
          // const response = await fetch(`https://restapi.amap.com/v3/geocode/regeo?location=${position.coords.longitude},${position.coords.latitude}&key=YOUR_AMAP_KEY`);
          // const data = await response.json();
          // user.value.location = data.regeocode.formatted_address;
          
          // 临时使用坐标显示
          user.value.location = `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`;
        } catch (error) {
          user.value.location = '无法获取位置';
          console.error('获取位置信息失败:', error);
        }
      },
      (error) => {
        user.value.location = '位置获取失败';
        console.error('定位错误:', error);
      }
    );
  } else {
    user.value.location = '浏览器不支持定位';
  }
};

onMounted(() => {
  getCurrentLocation();
});
</script>

<style scoped>
.profile-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-top: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.profile-header {
  padding: 0 20px;
  position: relative;
}

.settings-icons {
  position: absolute;
  top: 0;
  right: 20px;
  display: flex;
  gap: 15px;
  font-size: 22px;
  color: #555;
  cursor: pointer;
}

.profile-info {
  text-align: center;
  margin-top: 30px;
}

.profile-info .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  background-color: #d0d0d0; /* Placeholder for missing image */
}

.profile-info h2 {
  font-size: 24px;
  margin: 5px 0;
}

.profile-info .user-location {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.profile-info .user-location::before {
  content: "📍";
  font-size: 16px;
}

.follow-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.follow-stats .stat-item {
  text-align: center;
}

.follow-stats .stat-item .value {
  font-size: 20px;
  font-weight: bold;
}

.follow-stats .stat-item .label {
  font-size: 12px;
  color: #888;
}

.profile-content {
  padding: 20px;
}

.stats-card {
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
}

.stats-card h3 {
  font-size: 18px;
  margin: 0;
  flex-shrink: 0;
}

.stats-card .stats-grid {
  display: flex;
  gap: 30px;
  margin-left: 20px;
  flex-grow: 1;
  justify-content: flex-end; /* Align stats to the right */
}

.stats-card .stat-item {
  text-align: center;
}

.stats-card .stat-item .value {
  font-size: 18px;
  font-weight: bold;
}

.stats-card .stat-item .label {
  font-size: 12px;
  color: #888;
}

.stats-card .icon-arrow-right {
  font-size: 20px;
  color: #888;
  cursor: pointer;
  margin-left: 15px;
}

.profile-tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: none;
  margin-bottom: 20px;
  padding: 10px 0;
}

.profile-tabs button {
  flex-shrink: 0;
  padding: 8px 16px;
  border: none;
  background: #f5f5f5;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-radius: 20px;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.profile-tabs button.active {
  color: white;
  background-color: #000;
  font-weight: 500;
  border-bottom: none;
}

.tab-content {
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
}

.premium-promo {
  background-color: #000;
  color: #fff;
  border-radius: 20px;
  padding: 15px 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
}

.premium-promo:hover {
  background-color: #333;
}

.premium-promo .icon-sparkle {
  font-size: 22px;
  margin-right: 10px;
}

.premium-promo span {
  flex-grow: 1;
  font-weight: bold;
}

.premium-promo .icon-arrow-right {
  font-size: 20px;
}

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  cursor: pointer;
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .avatar-edit-overlay {
  opacity: 1;
}

.avatar-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.avatar-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.option {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.option h4 {
  margin: 0 0 10px 0;
}

.upload-btn, .refresh-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.upload-btn:hover, .refresh-btn:hover {
  background: #000;
  color: white;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 10px auto;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  border: none;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #000;
  color: white;
  border: none;
}

.save-btn:hover {
  background: #333;
}
</style> 