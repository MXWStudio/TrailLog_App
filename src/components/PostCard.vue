<template>
  <div class="post-card">
    <div class="post-header">
      <img :src="post.author.avatar" alt="Avatar" class="avatar">
      <div class="author-info">
        <span class="author-name">{{ post.author.name }}</span>
        <span class="post-date">{{ post.date }}</span>
        <button class="follow-btn">关注</button>
      </div>
      <i class="icon-more">...</i>
    </div>
    <div class="post-image-container">
      <img :src="post.imageUrl" alt="Post Image" class="post-image">
      <div v-if="post.recap" class="recap-tag">▶️ Recap</div>
      <div class="map-thumbnail">
        <img src="path/to/small_map_thumbnail.png" alt="Map Thumbnail">
      </div>
    </div>
    <div class="post-details">
      <h3>{{ post.title }}</h3>
      <p class="post-location">{{ post.location }}</p>
      </div>
  </div>
</template>

<script setup>
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
}

.post-header .author-info {
  flex-grow: 1;
}

.post-header .author-name {
  font-weight: bold;
  display: block;
}

.post-header .post-date {
  font-size: 12px;
  color: #888;
}

.post-header .follow-btn {
  background: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
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

.recap-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0,0,0,0.6);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
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