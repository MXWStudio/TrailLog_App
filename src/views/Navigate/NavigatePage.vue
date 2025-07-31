<template>
  <div class="navigate-page">
    <div class="map-view">
      <div id="map-container" ref="mapContainer"></div>
      <div class="map-controls">
        <button class="control-btn" @click="switchMapMode('2D')" :class="{ active: mapMode === '2D' }">2D</button>
        <button class="control-btn" @click="switchMapMode('3D')" :class="{ active: mapMode === '3D' }">3D</button>
      </div>
      <div class="location-btn" @click="getCurrentLocation" :class="{ 
        'locating': isLocating, 
        'located': isLocated,
        'location-error': locationError 
      }">
        <MapPin v-if="!isLocating" :size="20" />
        <div v-else class="location-spinner"></div>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="searchKeyword"
            @input="onSearchInput"
            @keyup.enter="performSearch"
            @focus="showSearchSuggestions = searchSuggestions.length > 0"
            @blur="hideSearchSuggestions"
            placeholder="搜索地点、路线..."
            class="search-input"
          />
          <button @click="performSearch" class="search-btn" :disabled="!searchKeyword.trim()">
            🔍
          </button>
          
          <!-- 搜索建议 -->
          <div v-if="showSearchSuggestions && searchSuggestions.length > 0" class="search-suggestions">
            <div 
              v-for="(suggestion, index) in searchSuggestions" 
              :key="index"
              @click="selectSearchSuggestion(suggestion)"
              class="suggestion-item"
            >
              <div class="suggestion-name">{{ suggestion.name }}</div>
              <div class="suggestion-address">{{ suggestion.address }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作按钮 -->
      <div class="quick-actions">
        <button class="quick-btn" @click="centerToUserLocation" :disabled="!currentLocation" title="回到当前位置">
          🎯
        </button>
        <button class="quick-btn" @click="clearAllMarkers" title="清除标记">
          🗑️
        </button>
        <button class="quick-btn" @click="toggleFullscreen" title="全屏显示">
          {{ isFullscreen ? '🔲' : '⛶' }}
        </button>
      </div>
    </div>

    <!-- 路线详情卡片 -->
    <div class="route-details-card" :class="{ 'expanded': isCardExpanded, 'hidden': !showRouteCard }" 
         @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
      <div class="card-handle" @click="toggleCard">
        <div class="handle-bar"></div>
      </div>
      <div class="card-header">
        <h2 class="route-name">{{ routeInfo.name || '当前位置' }}</h2>
        <span class="clear-btn" @click="clearRoute">清除</span>
      </div>
      <div class="card-content">
        <div class="route-stats" v-if="routeInfo.distance">
          <div class="stat-item">
            <span class="value">{{ routeInfo.distance }}</span>
            <span class="label">距离</span>
          </div>
          <div class="stat-item">
            <span class="value">{{ routeInfo.elevation }}</span>
            <span class="label">海拔增益</span>
          </div>
          <div class="stat-item">
            <span class="value">{{ routeInfo.duration }}</span>
            <span class="label">预估时间</span>
          </div>
        </div>
        
        <!-- 位置信息显示 -->
        <div class="location-details" v-if="currentLocation && !routeInfo.distance">
          <div class="location-item">
            <span class="label">当前位置</span>
            <span class="value">{{ currentLocation.address || '获取地址中...' }}</span>
          </div>
          <div class="location-item">
            <span class="label">坐标</span>
            <span class="value coords">{{ currentLocation.position[1].toFixed(6) }}, {{ currentLocation.position[0].toFixed(6) }}</span>
          </div>
          <div class="location-item">
            <span class="label">精度</span>
            <span class="value accuracy" :class="getAccuracyClass(currentLocation.accuracy)">
              ± {{ Math.round(currentLocation.accuracy || 0) }}m
            </span>
          </div>
          
          <!-- 🎯 定位质量指示器 -->
          <div class="location-item" v-if="locationQuality">
            <span class="label">定位质量</span>
            <span class="value quality" :class="getQualityClass(locationQuality.level)">
              {{ getQualityText(locationQuality.level) }}
              <span class="quality-score">({{ Math.round(locationQuality.score * 100) }}%)</span>
            </span>
          </div>
          
          <!-- 🎯 定位源信息 -->
          <div class="location-item" v-if="currentLocation.source">
            <span class="label">定位源</span>
            <span class="value source" :class="getSourceClass(currentLocation.source)">
              {{ getSourceText(currentLocation.source) }}
            </span>
          </div>
          
          <!-- 🎯 改进建议（如果质量不佳） -->
          <div class="location-tips" v-if="locationQuality && locationQuality.level !== 'excellent' && locationQuality.recommendations.length > 0">
            <div class="tips-header">💡 改进建议：</div>
            <div class="tips-list">
              <div v-for="tip in locationQuality.recommendations" :key="tip" class="tip-item">
                {{ tip }}
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn secondary" @click="shareLocation" v-if="currentLocation">
            <Share2 :size="18" /> 分享位置
          </button>
          <button class="action-btn primary" @click="startNavigation" v-if="routeInfo.distance">
            <Play :size="18" /> 开始导航
          </button>
          <button class="action-btn primary" @click="planRoute" v-else>
            <Route :size="18" /> 规划路线
          </button>
        </div>
      </div>
    </div>

    <!-- 地图初始化状态 -->
    <div v-if="isMapLoading" class="map-loading">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
      <div class="loading-steps">
        <div class="step" :class="{ active: loadingStep >= 1, completed: loadingStep > 1 }">
          <span class="step-number">1</span>
          <span class="step-text">初始化地图</span>
        </div>
        <div class="step" :class="{ active: loadingStep >= 2, completed: loadingStep > 2 }">
          <span class="step-number">2</span>
          <span class="step-text">获取位置</span>
        </div>
        <div class="step" :class="{ active: loadingStep >= 3, completed: loadingStep > 3 }">
          <span class="step-number">3</span>
          <span class="step-text">加载完成</span>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="mapError && !isMapLoading" class="map-error">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ mapError }}</p>
      <div class="error-actions">
        <button @click="retryMapLoad" class="retry-btn">重试</button>
        <button @click="useDefaultLocation" class="retry-btn secondary">使用默认位置</button>
      </div>
    </div>

    <!-- API Key 配置提示 -->
    <div v-if="showApiKeyTip" class="api-key-tip">
      <div class="tip-content">
        <h3>需要配置高德地图API Key</h3>
        <p>请按以下步骤配置：</p>
        <ol>
          <li>访问 <a href="https://console.amap.com/" target="_blank">高德开放平台</a></li>
          <li>注册并创建应用</li>
          <li>复制API Key</li>
          <li>在项目根目录创建 .env.local 文件</li>
          <li>添加：VITE_AMAP_API_KEY=你的API Key</li>
        </ol>
        <button @click="hideApiKeyTip" class="close-tip-btn">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { MapPin, Share2, Play, Route } from 'lucide-vue-next';

// 动态导入地图工具
let amapManager: any = null;

const loadMapUtils = async () => {
  try {
    const mapModule = await import('@/utils/amap');
    amapManager = mapModule.amapManager;
    return true;
  } catch (error) {
    console.error('地图工具加载失败:', error);
    return false;
  }
};

// 高德地图API Key
const AMAP_API_KEY = import.meta.env.VITE_AMAP_API_KEY;

// 地图实例
let map: any = null;

// 基础状态
const mapMode = ref('3D');
const isMapLoading = ref(false);
const mapError = ref('');
const loadingMessage = ref('正在初始化...');
const loadingStep = ref(0);
const showApiKeyTip = ref(false);
const isFullscreen = ref(false);

// 定位相关状态
const isLocating = ref(false);
const isLocated = ref(false);
const locationError = ref(false);
const currentLocation = ref<{
  position: [number, number];
  accuracy?: number;
  address?: string;
  confidence?: number;
  source?: string;
} | null>(null);

// 搜索相关
const searchKeyword = ref('');

// 路线和卡片状态
const isCardExpanded = ref(false);
const showRouteCard = ref(false);
const startY = ref(0);
const currentY = ref(0);
const isDragging = ref(false);

// DOM引用
const mapContainer = ref<HTMLElement>();

// 路线信息 - 改为响应式
const routeInfo = ref({
  name: '',
  distance: '',
  elevation: '',
  duration: ''
});

// 🎯 定位质量信息
const locationQuality = ref<{
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
} | null>(null);

// 地图初始化 - 全新的逻辑
const initializeMap = async () => {
  try {
    isMapLoading.value = true;
    mapError.value = '';
    loadingStep.value = 1;
    loadingMessage.value = '正在加载地图引擎...';

    // 检查API Key
    if (!AMAP_API_KEY || AMAP_API_KEY === 'your_amap_api_key_here') {
      showApiKeyTip.value = true;
      throw new Error('请配置高德地图API Key');
    }

    // 加载地图工具
    const mapUtilsLoaded = await loadMapUtils();
    if (!mapUtilsLoaded || !amapManager) {
      throw new Error('地图工具加载失败');
    }

    // 等待容器准备
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));

    // 初始化高德地图SDK
    await amapManager.initAMap(AMAP_API_KEY);
    
    loadingStep.value = 2;
    loadingMessage.value = '正在获取您的位置...';

    // 🎯 关键改进：优先获取用户位置，再创建地图
    let userLocation = null;
    try {
      userLocation = await getUserLocationFirst();
      console.log('用户位置获取成功:', userLocation);
    } catch (locationError) {
      console.warn('无法获取用户位置:', locationError);
      // 继续使用默认位置创建地图
    }

    // 使用用户位置或默认位置创建地图
    const mapCenter = userLocation ? userLocation.position : [116.397428, 39.90923]; // 北京天安门
    const mapZoom = userLocation ? 16 : 10;

    loadingMessage.value = '正在创建地图...';
    
    map = amapManager.createMapInstance('map-container', {
      center: mapCenter,
      zoom: mapZoom,
      viewMode: mapMode.value === '3D' ? '3D' : '2D',
      pitch: mapMode.value === '3D' ? 45 : 0,
    });

    if (!map) {
      throw new Error('地图实例创建失败');
    }

    // 如果有用户位置，添加标记
    if (userLocation) {
      currentLocation.value = userLocation;
      isLocated.value = true;
      amapManager.addCurrentLocationMarker(map, userLocation.position, userLocation.accuracy);
      showRouteCard.value = true;
      
      // 获取详细地址
      if (!userLocation.address) {
        getDetailedAddress(userLocation.position);
      }
    }

    loadingStep.value = 3;
    loadingMessage.value = '加载完成';
    
    setTimeout(() => {
      isMapLoading.value = false;
    }, 500);

    console.log('地图初始化成功');

  } catch (error) {
    console.error('地图初始化失败:', error);
    handleMapError(error);
  }
};

// 🎯 优先获取用户位置的增强函数
const getUserLocationFirst = async (): Promise<{
  position: [number, number];
  accuracy: number;
  address?: string;
  confidence: number;
  source: string;
}> => {
  try {
    // 🔥 使用增强版高德定位API
    if (amapManager && amapManager.isSDKLoaded()) {
      console.log('🎯 使用高德地图快速定位...');
      
      // 创建临时地图实例用于定位
      const tempContainer = document.createElement('div');
      tempContainer.style.display = 'none';
      document.body.appendChild(tempContainer);
      tempContainer.id = 'temp-location-map';
      
      const tempMap = amapManager.createMapInstance('temp-location-map', {
        center: [116.397428, 39.90923],
        zoom: 10
      });
      
      if (tempMap) {
        try {
          const locationData = await amapManager.getCurrentPosition(tempMap, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
            showMarker: false,
            zoomToLocation: false,
            useMultipleServices: true,
            useLocationFilter: false // 首次定位不使用过滤
          });
          
          // 清理临时地图
          amapManager.destroyMapInstance('temp-location-map');
          document.body.removeChild(tempContainer);
          
          return {
            position: locationData.position,
            accuracy: locationData.accuracy,
            address: locationData.address,
            confidence: locationData.confidence,
            source: locationData.source
          };
        } catch (error) {
          // 清理临时地图
          amapManager.destroyMapInstance('temp-location-map');
          document.body.removeChild(tempContainer);
          throw error;
        }
      }
    }
    
    // 备用方案：浏览器定位
    return new Promise((resolve, reject) => {
      console.log('🎯 使用浏览器定位...');
      
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持定位'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('定位超时'));
      }, 8000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          const { longitude, latitude, accuracy } = position.coords;
          
          resolve({
            position: [longitude, latitude],
            accuracy: accuracy || 150,
            confidence: accuracy && accuracy < 100 ? 0.7 : 0.5,
            source: 'browser'
          });
        },
        (error) => {
          clearTimeout(timeout);
          console.warn('浏览器定位失败:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 0 // 不使用缓存
        }
      );
    });
    
  } catch (error) {
    console.error('🎯 快速定位失败:', error);
    throw error;
  }
};

// 获取详细地址
const getDetailedAddress = async (position: [number, number]) => {
  try {
    if (!amapManager || !amapManager.AMap) return;
    
    const geocoder = new amapManager.AMap.Geocoder();
    geocoder.getAddress(new amapManager.AMap.LngLat(position[0], position[1]), (status: string, result: any) => {
      if (status === 'complete' && result.regeocode) {
        if (currentLocation.value) {
          currentLocation.value.address = result.regeocode.formattedAddress;
        }
      }
    });
  } catch (error) {
    console.warn('获取地址失败:', error);
  }
};

// 处理地图错误
const handleMapError = (error: any) => {
  isMapLoading.value = false;
  loadingStep.value = 0;
  
  if (error instanceof Error) {
    if (error.message.includes('API Key')) {
      mapError.value = '请配置有效的高德地图API Key';
      showApiKeyTip.value = true;
    } else if (error.message.includes('网络') || error.message.includes('超时')) {
      mapError.value = '网络连接失败，请检查网络后重试';
    } else {
      mapError.value = `地图加载失败: ${error.message}`;
    }
  } else {
    mapError.value = '地图加载失败，请检查网络连接';
  }
};

// 重试地图加载
const retryMapLoad = () => {
  if (map && amapManager) {
    amapManager.destroyMapInstance('map-container');
    map = null;
  }
  mapError.value = '';
  showApiKeyTip.value = false;
  initializeMap();
};

// 使用默认位置
const useDefaultLocation = () => {
  mapError.value = '';
  currentLocation.value = {
    position: [116.397428, 39.90923], // 天安门
    accuracy: 1000,
    address: '北京市东城区天安门',
    confidence: 0.5,
    source: 'default'
  };
  retryMapLoad();
};

// 隐藏API Key提示
const hideApiKeyTip = () => {
  showApiKeyTip.value = false;
};

// 🛠️ 切换地图模式 - 重新创建地图实例
const switchMapMode = async (mode: '2D' | '3D') => {
  if (mapMode.value === mode || !map || !amapManager) return;
  
  try {
    console.log('🎯 切换地图模式:', mapMode.value, '->', mode);
    
    // 保存当前地图状态
    const currentCenter = map.getCenter ? map.getCenter() : [116.397428, 39.90923];
    const currentZoom = map.getZoom ? map.getZoom() : 15;
    const savedLocation = currentLocation.value;
    
    // 销毁当前地图实例
    amapManager.destroyMapInstance('map-container');
    map = null;
    
    // 更新模式
    mapMode.value = mode;
    
    // 创建新的地图实例
    map = amapManager.createMapInstance('map-container', {
      center: currentCenter,
      zoom: currentZoom,
      viewMode: mode === '3D' ? '3D' : '2D',
      pitch: mode === '3D' ? 45 : 0,
      rotation: mode === '3D' ? 0 : 0
    });

    if (!map) {
      throw new Error('地图实例创建失败');
    }

    // 恢复当前位置标记
    if (savedLocation && amapManager) {
      amapManager.addCurrentLocationMarker(map, savedLocation.position, savedLocation.accuracy);
    }
    
    console.log('🎯 地图模式切换成功:', mode);
    
  } catch (error) {
    console.error('🎯 地图模式切换失败:', error);
    // 回滚模式
    mapMode.value = mapMode.value === '2D' ? '3D' : '2D';
  }
};

// 🎯 获取当前位置 - 超高精度版
const getCurrentLocation = async () => {
  if (isLocating.value || !map || !amapManager) return;

  try {
    isLocating.value = true;
    locationError.value = false;

    // 🔥 使用增强版定位配置
    const locationData = await amapManager.getCurrentPosition(map, {
      enableHighAccuracy: true,
      timeout: 15000, // 延长超时时间
      maximumAge: 0, // 不使用缓存
      showMarker: true,
      showAccuracyCircle: true,
      zoomToLocation: true,
      zoomLevel: 18,
      useMultipleServices: true, // 启用多重定位验证
      useLocationFilter: true, // 启用位置过滤
      requireHighAccuracy: false // 允许中等精度结果
    });

    currentLocation.value = {
      position: locationData.position,
      accuracy: locationData.accuracy,
      address: locationData.address,
      confidence: locationData.confidence,
      source: locationData.source
    };
    
    isLocated.value = true;
    showRouteCard.value = true;
    
    // 🎯 获取定位质量报告
    const quality = amapManager.getLocationQuality();
    locationQuality.value = quality; // 设置响应式质量数据
    console.log('🎯 定位成功:', locationData);
    console.log('🎯 定位质量:', quality);
    
    // 如果定位质量较差，给用户提示
    if (quality.level === 'poor' || quality.level === 'fair') {
      console.warn('定位质量提醒:', quality.issues.join(', '));
      console.log('改进建议:', quality.recommendations.join(', '));
    }

  } catch (error) {
    console.error('🎯 定位失败:', error);
    locationError.value = true;
    
    // 提供更具体的错误信息
    if (error instanceof Error) {
      if (error.message.includes('权限')) {
        console.error('请检查定位权限设置');
      } else if (error.message.includes('网络')) {
        console.error('请检查网络连接和GPS设置');
      } else if (error.message.includes('超时')) {
        console.error('定位超时，建议到开阔地带重试');
      }
    }
  } finally {
    isLocating.value = false;
  }
};

// 搜索功能
const onSearchInput = () => {
  // 防抖搜索建议
  if (searchTimeout.value) {
    window.clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = window.setTimeout(() => {
    if (searchKeyword.value.trim()) {
      performSearchSuggestions();
    }
  }, 300);
};

const searchTimeout = ref<number | null>(null);
const searchSuggestions = ref<Array<{
  name: string;
  address: string;
  location: [number, number];
  type: string;
}>>([]);
const showSearchSuggestions = ref(false);

const performSearchSuggestions = async () => {
  if (!searchKeyword.value.trim() || !amapManager || !amapManager.AMap) return;
  
  try {
    const placeSearch = new amapManager.AMap.PlaceSearch({
      pageSize: 5,
      pageIndex: 1,
      city: '全国',
      extensions: 'all'
    });
    
    placeSearch.search(searchKeyword.value, (status: string, result: any) => {
      if (status === 'complete' && result.poiList && result.poiList.pois) {
        searchSuggestions.value = result.poiList.pois.map((poi: any) => ({
          name: poi.name,
          address: poi.address,
          location: [poi.location.lng, poi.location.lat],
          type: poi.type
        }));
        showSearchSuggestions.value = true;
      }
    });
  } catch (error) {
    console.error('搜索建议失败:', error);
  }
};

const performSearch = async () => {
  if (!searchKeyword.value.trim() || !map || !amapManager) return;
  
  try {
    showSearchSuggestions.value = false;
    
    const placeSearch = new amapManager.AMap.PlaceSearch({
      pageSize: 10,
      pageIndex: 1,
      city: '全国',
      extensions: 'all'
    });
    
    placeSearch.search(searchKeyword.value, (status: string, result: any) => {
      if (status === 'complete' && result.poiList && result.poiList.pois) {
        const pois = result.poiList.pois;
        
        // 清除之前的搜索结果
        clearSearchResults();
        
        // 添加搜索结果标记
        pois.forEach((poi: any, index: number) => {
          const marker = new amapManager.AMap.Marker({
            position: [poi.location.lng, poi.location.lat],
            title: poi.name,
            icon: new amapManager.AMap.Icon({
              size: [30, 30],
              image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
            }),
            zIndex: 1000 + index
          });
          
          // 添加信息窗体
          const infoWindow = new amapManager.AMap.InfoWindow({
            content: `
              <div style="padding: 8px; min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">${poi.name}</h4>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">${poi.address}</p>
                <div style="margin-top: 8px;">
                  <button onclick="window.planRouteToHere([${poi.location.lng}, ${poi.location.lat}], '${poi.name}')" 
                          style="background: #007AFF; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">
                    规划路线
                  </button>
                </div>
              </div>
            `,
            offset: [0, -30]
          });
          
          marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());
          });
          
          map.add(marker);
          searchResults.value.push({ marker, infoWindow });
        });
        
        // 调整地图视野
        if (pois.length > 0) {
          const bounds = new amapManager.AMap.Bounds();
          pois.forEach((poi: any) => {
            bounds.extend([poi.location.lng, poi.location.lat]);
          });
          map.setBounds(bounds);
        }
        
        console.log(`搜索"${searchKeyword.value}"找到 ${pois.length} 个结果`);
      } else {
        alert('未找到相关地点，请尝试其他关键词');
      }
    });
  } catch (error) {
    console.error('搜索失败:', error);
    alert('搜索失败，请重试');
  }
};

const searchResults = ref<Array<{ marker: any; infoWindow: any }>>([]);

const clearSearchResults = () => {
  searchResults.value.forEach(({ marker, infoWindow }) => {
    map.remove(marker);
  });
  searchResults.value = [];
};

const hideSearchSuggestions = () => {
  window.setTimeout(() => {
    showSearchSuggestions.value = false;
  }, 200);
};

const selectSearchSuggestion = (suggestion: any) => {
  searchKeyword.value = suggestion.name;
  showSearchSuggestions.value = false;
  
  // 移动地图到选中位置
  if (map) {
    map.setCenter(suggestion.location);
    map.setZoom(16);
    
    // 添加标记
    const marker = new amapManager.AMap.Marker({
      position: suggestion.location,
      title: suggestion.name
    });
    map.add(marker);
    searchResults.value.push({ marker, infoWindow: null });
  }
};

// 快捷操作
const centerToUserLocation = () => {
  if (!currentLocation.value || !map) return;
  
  map.setCenter(currentLocation.value.position);
  map.setZoom(17);
  
  // 添加动画效果
  try {
    const markers = map.getAllOverlays('marker');
    const marker = markers ? markers.find((m: any) => 
      m.getTitle && m.getTitle() === '当前位置'
    ) : null;
    
    if (marker && typeof marker.hide === 'function' && typeof marker.show === 'function') {
      // 简单的闪烁动画 - 使用高德地图支持的方法
      let isVisible = true;
      const blink = setInterval(() => {
        try {
          if (isVisible) {
            marker.hide();
          } else {
            marker.show();
          }
          isVisible = !isVisible;
        } catch (error) {
          console.warn('标记动画执行失败:', error);
          clearInterval(blink);
        }
      }, 200);
      
      setTimeout(() => {
        clearInterval(blink);
        try {
          marker.show(); // 确保最后是显示状态
        } catch (error) {
          console.warn('恢复标记显示失败:', error);
        }
      }, 1200);
    }
  } catch (error) {
    console.warn('标记动画初始化失败:', error);
  }
};

const clearAllMarkers = () => {
  if (!map) return;
  
  try {
    // 清除搜索结果
    clearSearchResults();
    
    // 清除路线
    if (typeof map.clearMap === 'function') {
      map.clearMap();
    }
    
    // 重新添加当前位置标记
    if (currentLocation.value && amapManager) {
      amapManager.addCurrentLocationMarker(map, currentLocation.value.position, currentLocation.value.accuracy);
    }
    
    // 重置路线信息
    routeInfo.value = {
      name: '',
      distance: '',
      elevation: '',
      duration: ''
    };
  } catch (error) {
    console.warn('清除标记失败:', error);
  }
};

const toggleFullscreen = () => {
  const element = document.documentElement;
  
  if (!isFullscreen.value) {
    // 进入全屏
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

// 路线规划功能
const planRoute = () => {
  if (!currentLocation.value) {
    alert('请先获取当前位置');
    return;
  }
  
  const destination = prompt('请输入目的地:');
  if (!destination) return;
  
  planRouteToDestination(destination);
};

const planRouteToDestination = async (destination: string) => {
  if (!currentLocation.value || !map || !amapManager) return;
  
  try {
    // 先搜索目的地
    const placeSearch = new amapManager.AMap.PlaceSearch({
      pageSize: 1,
      pageIndex: 1,
      city: '全国'
    });
    
    placeSearch.search(destination, (status: string, result: any) => {
      if (status === 'complete' && result.poiList && result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0];
        const destinationPos: [number, number] = [poi.location.lng, poi.location.lat];
        
        // 调用全局路线规划函数
        planRouteToPosition(destinationPos, poi.name);
      } else {
        alert('未找到目的地，请检查地名是否正确');
      }
    });
  } catch (error) {
    console.error('路线规划失败:', error);
    alert('路线规划失败，请重试');
  }
};

// 全局路线规划函数（供信息窗体调用）
const planRouteToPosition = async (destination: [number, number], destinationName: string) => {
  if (!currentLocation.value || !map || !amapManager) return;
  
  try {
    // 创建路线规划对象
    const driving = new amapManager.AMap.Driving({
      map: map,
      showTraffic: false,
      hideMarkers: false,
      autoFitView: true
    });
    
    // 规划路线
    driving.search(
      currentLocation.value.position,
      destination,
      (status: string, result: any) => {
        if (status === 'complete') {
          const route = result.routes[0];
          
          // 更新路线信息
          routeInfo.value = {
            name: `到 ${destinationName}`,
            distance: (route.distance / 1000).toFixed(2) + ' km',
            elevation: '未知', // 高德API不直接提供海拔信息
            duration: formatDuration(route.time)
          };
          
          showRouteCard.value = true;
          isCardExpanded.value = true;
          
          console.log('路线规划成功:', route);
        } else {
          alert('路线规划失败，请重试');
        }
      }
    );
  } catch (error) {
    console.error('路线规划失败:', error);
    alert('路线规划失败，请重试');
  }
};

// 格式化时间
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `约 ${hours}小时${minutes}分钟`;
  } else {
    return `约 ${minutes}分钟`;
  }
};

// 将函数暴露到全局，供信息窗体使用
(window as any).planRouteToHere = (position: [number, number], name: string) => {
  planRouteToPosition(position, name);
};

// 路线相关功能
const clearRoute = () => {
  if (!map) return;
  
  try {
    // 清除路线
    if (typeof map.clearMap === 'function') {
      map.clearMap();
    }
    
    // 重新添加当前位置标记
    if (currentLocation.value && amapManager) {
      amapManager.addCurrentLocationMarker(map, currentLocation.value.position, currentLocation.value.accuracy);
    }
    
    // 重置路线信息
    routeInfo.value = {
      name: '',
      distance: '',
      elevation: '',
      duration: ''
    };
    showRouteCard.value = !!currentLocation.value;
    isCardExpanded.value = false;
  } catch (error) {
    console.warn('清除路线失败:', error);
  }
};

const shareLocation = async () => {
  if (!currentLocation.value) return;
  
  const shareData = {
    title: '我的位置',
    text: `我在：${currentLocation.value.address || '未知位置'}`,
    url: `https://ditu.amap.com/?q=${currentLocation.value.position[1]},${currentLocation.value.position[0]}`
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareData.url);
      alert('位置链接已复制到剪贴板');
    }
  } catch (error) {
    console.error('分享失败:', error);
    // 备用方案：复制坐标
    try {
      const coords = `${currentLocation.value.position[1].toFixed(6)}, ${currentLocation.value.position[0].toFixed(6)}`;
      await navigator.clipboard.writeText(coords);
      alert('坐标已复制到剪贴板');
    } catch (clipboardError) {
      alert('分享功能不可用');
    }
  }
};

const startNavigation = () => {
  if (!routeInfo.value.distance) {
    alert('请先规划路线');
    return;
  }
  
  // 实现语音播报功能（如果支持）
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('导航开始，请按照路线行驶');
    utterance.lang = 'zh-CN';
    speechSynthesis.speak(utterance);
  }
  
  console.log('开始导航');
  alert('导航功能已开启！请保持GPS开启状态，注意行车安全。');
  
  // 可以在这里添加实时位置跟踪逻辑
  startLocationTracking();
};

const startLocationTracking = () => {
  // 定期更新位置（每30秒）
  if (locationTrackingInterval.value) {
    window.clearInterval(locationTrackingInterval.value);
  }
  
  locationTrackingInterval.value = window.setInterval(() => {
    if (currentLocation.value) {
      getCurrentLocation();
    }
  }, 30000); // 30秒更新一次
};

const locationTrackingInterval = ref<number | null>(null);

// 卡片滑动相关
const toggleCard = () => {
  isCardExpanded.value = !isCardExpanded.value;
};

const handleTouchStart = (event: TouchEvent) => {
  startY.value = event.touches[0].clientY;
  isDragging.value = true;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value) return;
  
  currentY.value = event.touches[0].clientY;
  const deltaY = startY.value - currentY.value;
  
  if (deltaY > 50 && !isCardExpanded.value) {
    isCardExpanded.value = true;
  } else if (deltaY < -50 && isCardExpanded.value) {
    isCardExpanded.value = false;
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
  startY.value = 0;
  currentY.value = 0;
};

// 工具函数
const getAccuracyClass = (accuracy?: number) => {
  if (!accuracy) return 'accuracy-unknown';
  if (accuracy < 50) return 'accuracy-high';
  if (accuracy < 200) return 'accuracy-medium';
  return 'accuracy-low';
};

// 🎯 定位质量相关工具函数
const getQualityClass = (level: string) => {
  switch (level) {
    case 'excellent': return 'quality-excellent';
    case 'good': return 'quality-good';
    case 'fair': return 'quality-fair';
    case 'poor': return 'quality-poor';
    default: return 'quality-unknown';
  }
};

const getQualityText = (level: string) => {
  switch (level) {
    case 'excellent': return '优秀';
    case 'good': return '良好';
    case 'fair': return '一般';
    case 'poor': return '较差';
    default: return '未知';
  }
};

const getSourceClass = (source: string) => {
  switch (source) {
    case 'amap': return 'source-amap';
    case 'browser': return 'source-browser';
    case 'averaged': return 'source-averaged';
    default: return 'source-unknown';
  }
};

const getSourceText = (source: string) => {
  switch (source) {
    case 'amap': return '高德地图';
    case 'browser': return '浏览器定位';
    case 'averaged': return '平均定位';
    default: return '未知';
  }
};

// 生命周期
onMounted(async () => {
  console.log('导航页面已挂载');
  await nextTick();
  
  // 添加全屏状态监听
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  
  setTimeout(() => {
    initializeMap();
  }, 100);
});

onUnmounted(() => {
  console.log('导航页面卸载');
  
  // 清理资源
  if (map && amapManager) {
    amapManager.destroyMapInstance('map-container');
    map = null;
  }
  
  // 清理定时器
  if (searchTimeout.value) {
    window.clearTimeout(searchTimeout.value);
  }
  if (locationTrackingInterval.value) {
    window.clearInterval(locationTrackingInterval.value);
  }
  
  // 移除全屏监听器
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});
</script>

<style scoped>
.navigate-page {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.map-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  /* 确保地图延伸到安全区域 */
  padding-top: var(--safe-area-inset-top, 0);
  padding-left: var(--safe-area-inset-left, 0);
  padding-right: var(--safe-area-inset-right, 0);
  padding-bottom: var(--safe-area-inset-bottom, 0);
}

#map-container {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  touch-action: manipulation;
  will-change: transform;
}

/* 地图控件样式 */
.map-controls {
  position: absolute;
  top: max(15px, var(--safe-area-inset-top, 0));
  right: max(15px, var(--safe-area-inset-right, 0));
  background-color: rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 5px;
  display: flex;
  gap: 5px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.control-btn {
  background: #f5f5f5;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.control-btn.active {
  background-color: #007AFF;
  color: white;
}

/* 定位按钮 */
.location-btn {
  position: absolute;
  top: max(80px, calc(var(--safe-area-inset-top, 0) + 80px));
  left: max(15px, var(--safe-area-inset-left, 0));
  background-color: rgba(255,255,255,0.95);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.location-btn:hover {
  background-color: rgba(255,255,255,1);
  transform: scale(1.05);
}

.location-btn.locating {
  background-color: #007AFF;
  color: white;
  animation: pulse 1.5s ease-in-out infinite;
}

.location-btn.located {
  background-color: #34C759;
  color: white;
  box-shadow: 0 0 15px rgba(52, 199, 89, 0.4);
}

.location-btn.location-error {
  background-color: #FF3B30;
  color: white;
  animation: shake 0.5s ease-in-out;
}

.location-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 搜索框 */
.search-container {
  position: absolute;
  top: max(15px, var(--safe-area-inset-top, 0));
  left: max(15px, var(--safe-area-inset-left, 0));
  right: max(100px, calc(100px + var(--safe-area-inset-right, 0)));
  z-index: 1000;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 25px;
  background: rgba(255,255,255,0.95);
  font-size: 14px;
  outline: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-btn:hover:not(:disabled) {
  background: #007AFF;
  color: white;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 搜索建议 */
.search-suggestions {
  position: absolute;
  top: 50px;
  left: 0;
  right: 54px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1001;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.suggestion-address {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}

/* 快捷操作按钮 */
.quick-actions {
  position: absolute;
  top: 150px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.quick-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.quick-btn:hover:not(:disabled) {
  background: #007AFF;
  color: white;
  transform: scale(1.05);
}

.quick-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 路线详情卡片 */
.route-details-card {
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 20px rgba(0,0,0,0.15);
  position: fixed;
  bottom: var(--safe-area-inset-bottom, 0);
  left: var(--safe-area-inset-left, 0);
  right: var(--safe-area-inset-right, 0);
  z-index: 100;
  transform: translateY(calc(100% - 80px));
  transition: transform 0.3s ease-out;
  max-height: 70vh;
  overflow: hidden;
  /* 为底部安全区域添加内边距 */
  padding-bottom: max(20px, var(--safe-area-inset-bottom, 0));
}

.route-details-card.expanded {
  transform: translateY(0);
}

.route-details-card.hidden {
  transform: translateY(100%);
}

.card-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  cursor: pointer;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background-color: #d1d5db;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.card-handle:hover .handle-bar {
  background-color: #9ca3af;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.route-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.clear-btn {
  color: #666;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #FF3B30;
}

.card-content {
  padding: 0 20px 30px;
  overflow-y: auto;
  max-height: calc(70vh - 140px);
}

/* 路线统计 */
.route-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-item .value {
  font-size: 18px;
  font-weight: bold;
  display: block;
  color: #333;
}

.stat-item .label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 位置详情 */
.location-details {
  margin-bottom: 20px;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.location-item:last-child {
  border-bottom: none;
}

.location-item .label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.location-item .value {
  font-size: 14px;
  color: #333;
  text-align: right;
  max-width: 60%;
}

.location-item .value.coords {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 12px;
}

.location-item .value.accuracy {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.accuracy-high {
  background-color: #d4edda;
  color: #155724;
}

.accuracy-medium {
  background-color: #fff3cd;
  color: #856404;
}

.accuracy-low {
  background-color: #f8d7da;
  color: #721c24;
}

.accuracy-unknown {
  background-color: #e2e3e5;
  color: #6c757d;
}

/* 🎯 定位质量指示器样式 */
.location-item .value.quality {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.quality-excellent {
  background-color: #d4edda;
  color: #155724;
}

.quality-good {
  background-color: #d1ecf1;
  color: #0c5460;
}

.quality-fair {
  background-color: #fff3cd;
  color: #856404;
}

.quality-poor {
  background-color: #f8d7da;
  color: #721c24;
}

.quality-unknown {
  background-color: #e2e3e5;
  color: #6c757d;
}

.quality-score {
  font-size: 10px;
  opacity: 0.8;
  margin-left: 4px;
}

/* 🎯 定位源样式 */
.location-item .value.source {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.source-amap {
  background-color: #e3f2fd;
  color: #1565c0;
}

.source-browser {
  background-color: #fce4ec;
  color: #c2185b;
}

.source-averaged {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.source-unknown {
  background-color: #f5f5f5;
  color: #757575;
}

/* 🎯 改进建议样式 */
.location-tips {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #ffc107;
}

.tips-header {
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-item {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
  padding-left: 12px;
  position: relative;
}

.tip-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ffc107;
  font-weight: bold;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background-color: #007AFF;
  color: white;
}

.action-btn.primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #e9ecef;
}

.action-btn.secondary:hover {
  background-color: #e9ecef;
  color: #333;
}

/* 加载状态 */
.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 30px;
  border-radius: 20px;
  z-index: 2000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  min-width: 280px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-steps {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 0.6;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.step.active .step-number {
  background: #007AFF;
  color: white;
}

.step.completed .step-number {
  background: #34C759;
  color: white;
}

.step-text {
  font-size: 11px;
  color: #666;
  text-align: center;
}

/* 错误提示 */
.map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 30px;
  border-radius: 20px;
  z-index: 2000;
  max-width: 85%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.error-message {
  font-size: 16px;
  margin-bottom: 25px;
  color: #333;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.retry-btn {
  padding: 12px 24px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #0056b3;
}

.retry-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e9ecef;
}

.retry-btn.secondary:hover {
  background: #e9ecef;
  color: #333;
}

/* API Key 提示 */
.api-key-tip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.tip-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.tip-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.tip-content ol {
  text-align: left;
  margin-bottom: 20px;
}

.tip-content li {
  margin-bottom: 8px;
  color: #555;
}

.tip-content a {
  color: #007AFF;
  text-decoration: none;
}

.tip-content a:hover {
  text-decoration: none;
  color: #005BB5;
}

.close-tip-btn {
  background: #007AFF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.close-tip-btn:hover {
  background: #0056b3;
}

/* 动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes shake {
  0%, 100% { 
    transform: translateX(0); 
  }
  25% { 
    transform: translateX(-3px); 
  }
  75% { 
    transform: translateX(3px); 
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .search-container {
    right: 80px;
  }
  
  .map-controls {
    top: 70px;
    right: 10px;
  }
  
  .location-btn {
    top: 140px;
    left: 10px;
    width: 44px;
    height: 44px;
  }
  
  .quick-actions {
    top: 200px;
    left: 10px;
  }
  
  .quick-btn {
    width: 40px;
    height: 40px;
  }
  
  .route-details-card {
    transform: translateY(calc(100% - 60px));
  }
  
  .card-content {
    padding: 0 15px 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 