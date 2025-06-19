<template>
  <div class="post-card">
    <div class="post-header">
      <img :src="post.author.avatar" alt="Avatar" class="avatar">
      <div class="author-info">
        <div class="name-and-button">
          <span class="author-name">{{ post.author.name }}</span>
          <button class="follow-btn">关注</button>
        </div>
      </div>
      <IconMaterialSymbolsMoreVert class="icon-more" />
    </div>
    <div class="post-image-container">
      <img :src="post.imageUrl" alt="Post Image" class="post-image">
      <div class="map-thumbnail">
        <img :src="smallMapThumbnail" alt="Map Thumbnail">
      </div>
    </div>
    <div class="post-details">
      <h3>{{ post.title }}</h3>
      <p class="post-location">{{ post.location }}</p>
    </div>
  </div>
</template>

<script setup>
import smallMapThumbnail from '@/assets/qingcheng_mountain.jpg';
import IconMaterialSymbolsMoreVert from '~icons/material-symbols/more-vert';
const props = defineProps({
  post: Object
});
</script>

<style scoped>
.post-card {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
}

.post-header .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #f5f5f5;
  object-fit: cover;
  border: 1px solid #eee;
}

.post-header .author-info {
  flex-grow: 1;
}

.post-header .author-name {
  font-weight: bold;
  display: block;
}

.name-and-button {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-header .follow-btn {
  background: #1890ff;
  border: none;
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 13px;
  cursor: pointer;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.post-header .follow-btn:hover {
  background: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(24,144,255,0.2);
}

.post-header .follow-btn:active {
  transform: translateY(0);
  background: #096dd9;
}

.post-image-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 aspect ratio for image */
  overflow: hidden;
}

.post-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-thumbnail {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.map-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-details {
  padding: 15px;
}

.post-details h3 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 18px;
}

.post-details .post-location {
  font-size: 14px;
  color: #555;
}
</style> 