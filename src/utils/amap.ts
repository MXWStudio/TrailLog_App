// 高德地图配置和工具类

// 🛠️ 工具函数：安全的Base64编码（支持Unicode字符）
const safeBase64Encode = (str: string): string => {
  try {
    // 先转换为UTF-8字节，再编码为Base64
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.warn('Base64编码失败，使用URL编码替代:', error);
    // 备用方案：使用URL编码
    return encodeURIComponent(str);
  }
};

// 动态导入高德地图加载器
const loadAMapLoader = async () => {
  try {
    const AMapLoader = await import('@amap/amap-jsapi-loader');
    return AMapLoader.default || AMapLoader;
  } catch (error) {
    console.error('AMapLoader 模块加载失败:', error);
    return null;
  }
};

// 备用CDN加载方式 - 使用更稳定的配置
const loadAMapByCDN = (apiKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) {
      resolve((window as any).AMap);
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=AMap.Scale,AMap.ToolBar,AMap.Geolocation,AMap.Marker,AMap.Polyline,AMap.InfoWindow`;
    script.setAttribute('crossorigin', 'anonymous');
    
    const timeout = setTimeout(() => {
      reject(new Error('地图加载超时'));
    }, 15000); // 15秒超时

    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('地图资源加载失败'));
    };
    
    script.onload = () => {
      clearTimeout(timeout);
      if ((window as any).AMap) {
        resolve((window as any).AMap);
      } else {
        reject(new Error('高德地图全局对象未找到'));
      }
    };
    
    document.head.appendChild(script);
  });
};

// 检查API Key是否有效的简单方法
const validateApiKey = (apiKey: string): boolean => {
  return !!(apiKey && apiKey.trim() && apiKey !== 'your_amap_api_key_here');
};

// 定位数据接口
export interface LocationData {
  position: [number, number];
  accuracy: number;
  address?: string;
  confidence: number;
  source: string;
  timestamp: number;
  speed?: number;
  heading?: number;
}

// 定位质量评估接口
export interface LocationQuality {
  score: number; // 0-1 分数
  level: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  recommendations: string[];
}

// 高德地图配置
export const AMAP_CONFIG = {
  key: '', // 您的高德地图API Key，通过环境变量配置
  version: '2.0',
  plugins: [
    'AMap.Scale',
    'AMap.ToolBar', 
    'AMap.Geolocation',
    'AMap.Marker',
    'AMap.Polyline',
    'AMap.InfoWindow',
    'AMap.PlaceSearch',
    'AMap.Autocomplete'
  ]
};

// 地图实例类型
export interface AMapInstance {
  setViewMode: (mode: string) => void;
  setPitch: (pitch: number) => void;
  addControl: (control: any) => void;
  clearMap: () => void;
  destroy: () => void;
  setCenter: (center: [number, number] | any) => void;
  setZoom: (zoom: number) => void;
  getCenter: () => any;
  getZoom: () => number;
  add: (overlay: any) => void;
  remove: (overlay: any) => void;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  setFitView: (overlays?: any[]) => void;
  setBounds: (bounds: any) => void;
  getAllOverlays: (type?: string) => any[];
}

// 定位历史管理器
class LocationHistoryManager {
  private history: LocationData[] = [];
  private maxHistory = 10;

  public addLocation(location: LocationData): void {
    this.history.push(location);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  public getAverageLocation(): LocationData | null {
    if (this.history.length === 0) return null;

    // 过滤掉精度太差的位置数据
    const validLocations = this.history.filter(loc => loc.accuracy <= 300);
    if (validLocations.length === 0) return this.history[this.history.length - 1];

    // 计算加权平均位置（精度高的权重大）
    let totalWeight = 0;
    let weightedLng = 0;
    let weightedLat = 0;
    let bestAccuracy = Infinity;

    validLocations.forEach(loc => {
      const weight = Math.max(1 / (loc.accuracy + 1), 0.1);
      totalWeight += weight;
      weightedLng += loc.position[0] * weight;
      weightedLat += loc.position[1] * weight;
      bestAccuracy = Math.min(bestAccuracy, loc.accuracy);
    });

    const avgPosition: [number, number] = [
      weightedLng / totalWeight,
      weightedLat / totalWeight
    ];

    return {
      position: avgPosition,
      accuracy: bestAccuracy,
      confidence: Math.min(validLocations.length / this.maxHistory + 0.5, 1.0),
      source: 'averaged',
      timestamp: Date.now(),
      address: validLocations[validLocations.length - 1]?.address
    };
  }

  public getLocationQuality(): LocationQuality {
    if (this.history.length === 0) {
      return {
        score: 0,
        level: 'poor',
        issues: ['无定位数据'],
        recommendations: ['请检查GPS和网络连接']
      };
    }

    const recentLocation = this.history[this.history.length - 1];
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // 检查精度
    if (recentLocation.accuracy > 100) {
      score -= 0.3;
      issues.push(`定位精度较差 (±${Math.round(recentLocation.accuracy)}m)`);
      recommendations.push('请到开阔地带或重新定位');
    } else if (recentLocation.accuracy > 50) {
      score -= 0.1;
      issues.push(`定位精度一般 (±${Math.round(recentLocation.accuracy)}m)`);
    }

    // 检查置信度
    if (recentLocation.confidence < 0.6) {
      score -= 0.2;
      issues.push('定位置信度较低');
      recommendations.push('建议多次定位以提高准确性');
    }

    // 检查数据稳定性
    if (this.history.length >= 3) {
      const positions = this.history.slice(-3).map(loc => loc.position);
      const maxDistance = this.calculateMaxDistance(positions);
      
      if (maxDistance > 200) {
        score -= 0.2;
        issues.push('位置数据不稳定');
        recommendations.push('请保持设备静止几秒后重新定位');
      }
    }

    // 检查定位源
    if (recentLocation.source === 'browser' || recentLocation.source === 'ip') {
      score -= 0.1;
      issues.push('使用的是备用定位方式');
      recommendations.push('建议允许高精度定位');
    }

    // 确定质量等级
    let level: LocationQuality['level'];
    if (score >= 0.9) level = 'excellent';
    else if (score >= 0.7) level = 'good';
    else if (score >= 0.5) level = 'fair';
    else level = 'poor';

    return { score, level, issues, recommendations };
  }

  private calculateMaxDistance(positions: [number, number][]): number {
    let maxDist = 0;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = this.calculateDistance(positions[i], positions[j]);
        maxDist = Math.max(maxDist, dist);
      }
    }
    return maxDist;
  }

  private calculateDistance(pos1: [number, number], pos2: [number, number]): number {
    const R = 6371000; // 地球半径（米）
    const lat1 = pos1[1] * Math.PI / 180;
    const lat2 = pos2[1] * Math.PI / 180;
    const deltaLat = (pos2[1] - pos1[1]) * Math.PI / 180;
    const deltaLng = (pos2[0] - pos1[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  public clear(): void {
    this.history = [];
  }
}

// 地图加载器类
export class AMapManager {
  private static instance: AMapManager;
  private AMap: any = null;
  private mapInstances: Map<string, AMapInstance> = new Map();
  private isLoading = false;
  private loadPromise: Promise<any> | null = null;
  private locationHistory = new LocationHistoryManager();

  private constructor() {}

  public static getInstance(): AMapManager {
    if (!AMapManager.instance) {
      AMapManager.instance = new AMapManager();
    }
    return AMapManager.instance;
  }

  // 初始化高德地图SDK
  public async initAMap(apiKey: string): Promise<any> {
    // 验证API Key
    if (!validateApiKey(apiKey)) {
      throw new Error('请配置有效的高德地图API Key');
    }

    if (this.AMap) {
      console.log('高德地图SDK已存在，直接返回');
      return this.AMap;
    }

    if (this.loadPromise) {
      console.log('高德地图SDK正在加载中，等待完成...');
      return this.loadPromise;
    }

    this.loadPromise = this._loadAMapSDK(apiKey);
    return this.loadPromise;
  }

  private async _loadAMapSDK(apiKey: string): Promise<any> {
    try {
      this.isLoading = true;
      console.log('开始加载高德地图SDK...');
      
      // 直接使用CDN方式，更稳定
      console.log('使用CDN方式加载高德地图...');
      this.AMap = await loadAMapByCDN(apiKey);
      console.log('高德地图SDK通过CDN加载成功');
      
      return this.AMap;
    } catch (error) {
      console.error('高德地图SDK加载失败:', error);
      this.loadPromise = null; // 重置加载状态，允许重试
      
      // 提供更友好的错误信息
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('超时')) {
          throw new Error('网络连接超时，请检查网络后重试');
        } else if (error.message.includes('blocked') || error.message.includes('阻塞')) {
          throw new Error('资源被阻塞，请检查网络设置');
        } else if (error.message.includes('key') || error.message.includes('Key')) {
          throw new Error('API Key无效或配额不足');
        }
      }
      throw new Error('地图加载失败，请检查网络连接');
    } finally {
      this.isLoading = false;
    }
  }

  // 创建地图实例 - 改进错误处理
  public createMapInstance(
    containerId: string,
    options: {
      center?: [number, number];
      zoom?: number;
      viewMode?: '2D' | '3D';
      pitch?: number;
      rotation?: number;
    } = {}
  ): AMapInstance | null {
    if (!this.AMap) {
      console.error('请先初始化高德地图SDK');
      return null;
    }

    // 检查容器是否存在
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`容器 ${containerId} 不存在`);
      return null;
    }

    // 检查容器尺寸
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn(`容器 ${containerId} 尺寸为零: ${rect.width}x${rect.height}`);
      // 等待容器有尺寸后再创建
      return this._createMapInstanceWithRetry(containerId, options);
    }

    return this._createMapInstanceNow(containerId, options);
  }

  private _createMapInstanceWithRetry(containerId: string, options: any, maxRetries = 5): AMapInstance | null {
    let retries = 0;
    
    const checkAndCreate = (): AMapInstance | null => {
      const container = document.getElementById(containerId);
      if (!container) return null;
      
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return this._createMapInstanceNow(containerId, options);
      }
      
      if (retries < maxRetries) {
        retries++;
        setTimeout(() => checkAndCreate(), 200 * retries);
        return null;
      }
      
      console.warn(`容器 ${containerId} 在 ${maxRetries} 次重试后仍无有效尺寸`);
      return this._createMapInstanceNow(containerId, options); // 强制创建
    };
    
    return checkAndCreate();
  }

  private _createMapInstanceNow(containerId: string, options: any): AMapInstance | null {
    const defaultOptions = {
      center: [116.397428, 39.90923], // 天安门广场 - 作为默认位置
      zoom: 10,
      viewMode: '3D',
      pitch: 45,
      rotation: 0,
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoomEnable: true,
      dragEnable: true,
      // 性能优化配置
      animateEnable: true,
      doubleClickZoom: false, // 减少不必要的双击缩放
      keyboardEnable: false, // 禁用键盘操作以减少事件监听
      scrollWheel: true,
      touchZoom: true,
      touchZoomCenter: 1,
      ...options // 传入的选项会覆盖默认选项
    };

    try {
      console.log(`创建地图实例，容器: ${containerId}，选项:`, defaultOptions);
      
      const mapInstance = new this.AMap.Map(containerId, defaultOptions);
      
      // 监听地图事件
      mapInstance.on('complete', () => {
        console.log('地图加载完成');
        // 地图加载完成后，优化Canvas设置
        this._optimizeCanvasSettings(containerId);
      });

      mapInstance.on('error', (error: any) => {
        console.error('地图运行错误:', error);
      });

      // 存储实例
      this.mapInstances.set(containerId, mapInstance);
      
      return mapInstance;
    } catch (error) {
      console.error('地图实例创建失败:', error);
      return null;
    }
  }

  // 优化Canvas设置以减少性能警告
  private _optimizeCanvasSettings(containerId: string): void {
    try {
      const container = document.getElementById(containerId);
      if (!container) return;

      // 找到所有canvas元素并优化设置
      const canvases = container.querySelectorAll('canvas');
      canvases.forEach((canvas: HTMLCanvasElement) => {
        // 设置willReadFrequently属性以优化频繁读取
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
          // 设置图像平滑以提升性能
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'medium';
        }

        // 添加CSS类以应用样式优化
        canvas.style.imageRendering = 'optimizeSpeed';
        canvas.style.willChange = 'contents';
      });

      console.log(`已优化 ${canvases.length} 个Canvas元素的性能设置`);
    } catch (error) {
      console.warn('Canvas优化失败:', error);
    }
  }

  // 获取地图实例
  public getMapInstance(containerId: string): AMapInstance | undefined {
    return this.mapInstances.get(containerId);
  }

  // 销毁地图实例
  public destroyMapInstance(containerId: string): void {
    const mapInstance = this.mapInstances.get(containerId);
    if (mapInstance) {
      try {
        mapInstance.destroy();
        this.mapInstances.delete(containerId);
        console.log(`地图实例 ${containerId} 已销毁`);
      } catch (error) {
        console.error('销毁地图实例失败:', error);
      }
    }
  }

  // 添加路线标记 - 改进错误处理
  public addRouteMarkers(
    mapInstance: AMapInstance, 
    points: Array<{ lng: number; lat: number; name?: string }>
  ) {
    if (!this.AMap || !mapInstance) {
      console.error('地图实例或SDK不可用');
      return;
    }

    try {
      points.forEach((point, index) => {
        const marker = new this.AMap.Marker({
          position: [point.lng, point.lat],
          title: point.name || `标记 ${index + 1}`,
          icon: new this.AMap.Icon({
            size: [25, 25],
            image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
          })
        });

        mapInstance.add(marker);

        // 如果有名称，添加信息窗体
        if (point.name) {
          const infoWindow = new this.AMap.InfoWindow({
            content: `<div style="padding: 5px;">${point.name}</div>`,
            offset: [0, -30]
          });

          marker.on('click', () => {
            infoWindow.open(mapInstance, marker.getPosition());
          });
        }
      });
    } catch (error) {
      console.error('添加路线标记失败:', error);
    }
  }

  // 绘制路线 - 改进错误处理
  public drawRoute(
    mapInstance: AMapInstance,
    path: Array<[number, number]>,
    options: {
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    } = {}
  ) {
    if (!this.AMap || !mapInstance || !path || path.length === 0) {
      console.error('无效的地图实例或路径数据');
      return;
    }

    try {
      const polylineOptions = {
        path: path,
        strokeColor: options.strokeColor || '#FF6B35',
        strokeWeight: options.strokeWeight || 4,
        strokeOpacity: options.strokeOpacity || 0.9,
        strokeStyle: 'solid',
        lineJoin: 'round',
        lineCap: 'round',
        ...options
      };

      const polyline = new this.AMap.Polyline(polylineOptions);
      mapInstance.add(polyline);

      // 调整地图视野以显示完整路线
      setTimeout(() => {
        try {
          mapInstance.setFitView([polyline]);
        } catch (error) {
          console.warn('调整视野失败:', error);
        }
      }, 500);

      console.log('路线绘制成功');
    } catch (error) {
      console.error('绘制路线失败:', error);
    }
  }

  // 清理所有资源
  public cleanup(): void {
    this.mapInstances.forEach((instance, containerId) => {
      this.destroyMapInstance(containerId);
    });
    this.mapInstances.clear();
    this.AMap = null;
    this.loadPromise = null;
    this.isLoading = false;
    this.locationHistory.clear();
  }

  // 🎯 添加高精度醒目定位标记
  public addCurrentLocationMarker(
    mapInstance: AMapInstance,
    position: [number, number],
    accuracy?: number
  ) {
    if (!this.AMap || !mapInstance) {
      console.error('地图实例或SDK不可用');
      return null;
    }

    try {
      // 移除之前的定位标记
      this.removeCurrentLocationMarker(mapInstance);

      // 🔥 创建更醒目的定位标记
      const markerSize = 32; // 增大标记尺寸
      const pulseSize = 48; // 脉冲外圈尺寸
      
      // 创建安全的SVG图标（移除中文注释避免btoa编码错误）
      const svgContent = `
        <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${markerSize/2}" cy="${markerSize/2}" r="14" fill="#007AFF" fill-opacity="0.2" stroke="#007AFF" stroke-width="1">
            <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="fill-opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="${markerSize/2}" cy="${markerSize/2}" r="12" fill="#007AFF" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="${markerSize/2}" cy="${markerSize/2}" r="4" fill="#FFFFFF">
            <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
          </circle>
          <polygon points="${markerSize/2},6 ${markerSize/2-3},12 ${markerSize/2+3},12" fill="#FFFFFF" opacity="0.8"/>
        </svg>
      `.trim();
      
             // 使用全局的安全编码函数

      const marker = new this.AMap.Marker({
        position: position,
        title: '当前位置',
        icon: new this.AMap.Icon({
          size: [markerSize, markerSize],
          image: 'data:image/svg+xml;base64,' + safeBase64Encode(svgContent),
          imageOffset: [-markerSize/2, -markerSize/2]
        }),
        zIndex: 1000,
        cursor: 'pointer',
        // 添加自定义属性
        extData: {
          type: 'currentLocation',
          accuracy: accuracy || 100
        }
      });

      // 🎯 添加精度圈（更醒目的样式）
      let accuracyCircle = null;
      if (accuracy && accuracy > 0) {
        // 根据精度选择不同的颜色
        let circleColor = '#007AFF'; // 蓝色：高精度
        let fillOpacity = 0.15;
        
        if (accuracy > 100) {
          circleColor = '#FF9500'; // 橙色：中等精度
          fillOpacity = 0.12;
        }
        if (accuracy > 200) {
          circleColor = '#FF3B30'; // 红色：低精度
          fillOpacity = 0.1;
        }
        
        accuracyCircle = new this.AMap.Circle({
          center: position,
          radius: accuracy,
          fillColor: circleColor,
          fillOpacity: fillOpacity,
          strokeColor: circleColor,
          strokeWeight: 2,
          strokeOpacity: 0.6,
          strokeStyle: 'dashed',
          zIndex: 500
        });
        mapInstance.add(accuracyCircle);
      }

      // 🔥 添加点击事件 - 显示位置详情
      marker.on('click', () => {
        const infoWindow = new this.AMap.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #007AFF; font-size: 16px;">📍 当前位置</h4>
              <div style="margin-bottom: 6px;">
                <span style="color: #666; font-size: 12px;">精度：</span>
                <span style="color: #333; font-weight: 500;">±${Math.round(accuracy || 0)}米</span>
              </div>
              <div style="margin-bottom: 6px;">
                <span style="color: #666; font-size: 12px;">坐标：</span>
                <span style="color: #333; font-size: 11px; font-family: monospace;">${position[1].toFixed(6)}, ${position[0].toFixed(6)}</span>
              </div>
              <div style="margin-top: 10px; text-align: right;">
                <button onclick="navigator.clipboard?.writeText('${position[1].toFixed(6)}, ${position[0].toFixed(6)}'); alert('坐标已复制！')" 
                        style="background: #007AFF; color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">
                  复制坐标
                </button>
              </div>
            </div>
          `,
          offset: [0, -40],
          closeWhenClickMap: true
        });
        
        infoWindow.open(mapInstance, position);
      });

      mapInstance.add(marker);

      // 🎯 添加定位成功的动画效果
      this.playLocationSuccessAnimation(mapInstance, position);

      // 存储引用以便后续清理
      (mapInstance as any)._currentLocationMarker = marker;
      (mapInstance as any)._currentLocationCircle = accuracyCircle;

      console.log('🎯 醒目定位标记已添加:', { position, accuracy });

      return { marker, accuracyCircle };
    } catch (error) {
      console.error('添加当前位置标记失败:', error);
      return null;
    }
  }

  // 🎉 播放定位成功动画
  private playLocationSuccessAnimation(mapInstance: AMapInstance, position: [number, number]) {
    try {
      // 创建扩散动画圆圈
      const animationCircle = new this.AMap.Circle({
        center: position,
        radius: 10,
        fillColor: '#007AFF',
        fillOpacity: 0.4,
        strokeColor: '#007AFF',
        strokeWeight: 2,
        strokeOpacity: 0.8,
        zIndex: 999
      });
      
      mapInstance.add(animationCircle);
      
      // 动画效果：扩散并淡化
      let currentRadius = 10;
      let currentOpacity = 0.4;
      
      const animationTimer = setInterval(() => {
        currentRadius += 8;
        currentOpacity -= 0.05;
        
        if (currentOpacity <= 0 || currentRadius > 100) {
          clearInterval(animationTimer);
          mapInstance.remove(animationCircle);
          return;
        }
        
        animationCircle.setRadius(currentRadius);
        animationCircle.setOptions({
          fillOpacity: currentOpacity,
          strokeOpacity: currentOpacity
        });
      }, 50);
      
    } catch (error) {
      console.warn('定位动画播放失败:', error);
    }
  }

  // 移除当前位置标记
  public removeCurrentLocationMarker(mapInstance: AMapInstance) {
    try {
      if ((mapInstance as any)._currentLocationMarker) {
        mapInstance.remove((mapInstance as any)._currentLocationMarker);
        (mapInstance as any)._currentLocationMarker = null;
      }
      if ((mapInstance as any)._currentLocationCircle) {
        mapInstance.remove((mapInstance as any)._currentLocationCircle);
        (mapInstance as any)._currentLocationCircle = null;
      }
    } catch (error) {
      console.error('移除当前位置标记失败:', error);
    }
  }

  // 🎯 优化版：获取高精度位置 - 多重定位验证和数据过滤
  public async getCurrentPosition(
    mapInstance: AMapInstance,
    options: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
      showMarker?: boolean;
      showAccuracyCircle?: boolean;
      zoomToLocation?: boolean;
      zoomLevel?: number;
      useMultipleServices?: boolean;
      useLocationFilter?: boolean;
      requireHighAccuracy?: boolean;
    } = {}
  ): Promise<LocationData> {
    console.log('🎯 开始高精度定位，配置：', options);

    try {
      // 🔥 策略1：多重定位并行验证
      const locationPromises: Promise<LocationData>[] = [];

      // 高德高精度定位（主要）
      locationPromises.push(this.getEnhancedAMapLocation(mapInstance, options));

      // 如果启用多服务验证，添加浏览器定位
      if (options.useMultipleServices !== false) {
        locationPromises.push(this.getEnhancedBrowserLocation(options));
      }

      // 等待至少一个定位成功
      const locations = await Promise.allSettled(locationPromises);
      const successfulLocations = locations
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<LocationData>).value);

      if (successfulLocations.length === 0) {
        throw new Error('所有定位方式都失败了，请检查GPS和网络设置');
      }

      console.log('🎯 获得 ' + successfulLocations.length + ' 个定位结果:', successfulLocations);

      // 🔥 策略2：选择最佳定位结果
      let bestLocation = this.selectBestLocation(successfulLocations, options);

      // 🔥 策略3：应用位置过滤和平滑
      if (options.useLocationFilter !== false) {
        this.locationHistory.addLocation(bestLocation);
        const filteredLocation = this.locationHistory.getAverageLocation();
        if (filteredLocation && filteredLocation.confidence > bestLocation.confidence) {
          bestLocation = filteredLocation;
          console.log('🎯 使用过滤后的位置:', bestLocation);
        }
      }

      // 🔥 策略4：质量检查
      const quality = this.locationHistory.getLocationQuality();
      console.log('🎯 定位质量评估:', quality);

      if (options.requireHighAccuracy && quality.level === 'poor') {
        throw new Error(`定位质量不足: ${quality.issues.join(', ')}`);
      }

      // 显示定位结果
      if (options.showMarker !== false) {
        this.addCurrentLocationMarker(
          mapInstance, 
          bestLocation.position, 
          options.showAccuracyCircle !== false ? bestLocation.accuracy : undefined
        );
      }

      // 移动地图到当前位置
      if (options.zoomToLocation !== false) {
        mapInstance.setCenter(bestLocation.position);
        const zoom = options.zoomLevel || this.calculateOptimalZoom(bestLocation.accuracy);
        mapInstance.setZoom(zoom);
      }

      return bestLocation;

    } catch (error) {
      console.error('🎯 定位失败:', error);
      throw error;
    }
  }

  // 🔥 增强版高德定位
  private async getEnhancedAMapLocation(
    mapInstance: AMapInstance,
    options: any
  ): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!this.AMap) {
        reject(new Error('高德地图SDK未加载'));
        return;
      }

      try {
        const geolocation = new this.AMap.Geolocation({
          // 🎯 超高精度配置
          enableHighAccuracy: true,
          timeout: options.timeout || 15000, // 延长超时时间
          maximumAge: 0, // 不使用缓存，获取最新位置
          convert: true,
          showButton: false,
          showMarker: false,
          showCircle: false,
          panToLocation: false,
          zoomToAccuracy: false,
          
          // 🔥 高级精度配置
          needAddress: true,
          extensions: 'all',
          GeoLocationFirst: true, // 优先GPS
          noGeoLocation: 0, // 允许基站和WIFI定位作为辅助
          noIpLocation: 1, // 禁用IP定位
          useLocalhost: false,
          
          // 🎯 精度要求配置
          desiredAccuracy: 10, // 期望精度10米
          accuracy: 'high', // 高精度模式
          
          // 🔥 多重定位尝试
          retry: 3, // 重试次数
          retryInterval: 1000 // 重试间隔
        });

        let locationReceived = false;
        let attemptCount = 0;
        const maxAttempts = 3;

        const attemptLocation = () => {
          attemptCount++;
          console.log(`🎯 高德定位尝试 ${attemptCount}/${maxAttempts}`);

          geolocation.getCurrentPosition();
        };

        geolocation.on('complete', (data: any) => {
          if (locationReceived) return;
          locationReceived = true;

          console.log('🎯 高德定位成功:', data);

          const accuracy = data.accuracy || 100;
          const position: [number, number] = [data.position.lng, data.position.lat];
          const confidence = this.calculateEnhancedConfidence(accuracy, data, 'amap');

          resolve({
            position,
            accuracy,
            address: data.formattedAddress || data.address,
            confidence,
            source: 'amap',
            timestamp: Date.now(),
            speed: data.speed,
            heading: data.heading
          });
        });

        geolocation.on('error', (error: any) => {
          if (locationReceived) return;

          console.warn(`🎯 高德定位尝试 ${attemptCount} 失败:`, error);

          // 如果还有重试机会，继续尝试
          if (attemptCount < maxAttempts) {
            setTimeout(attemptLocation, 1000);
            return;
          }

          locationReceived = true;
          let errorMessage = '高德定位失败';
          
          if (error.code === 1) {
            errorMessage = '定位权限被拒绝';
          } else if (error.code === 2) {
            errorMessage = '网络错误或GPS信号弱';
          } else if (error.code === 3) {
            errorMessage = '定位超时';
          }

          reject(new Error(errorMessage));
        });

        // 开始第一次定位尝试
        attemptLocation();

      } catch (error) {
        reject(error);
      }
    });
  }

  // 🔥 增强版浏览器定位
  private async getEnhancedBrowserLocation(options: any): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持定位'));
        return;
      }

      console.log('🎯 开始浏览器原生定位');

      let attemptCount = 0;
      const maxAttempts = 2;

      const attemptLocation = () => {
        attemptCount++;
        console.log(`🎯 浏览器定位尝试 ${attemptCount}/${maxAttempts}`);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('🎯 浏览器定位成功:', position);

            const accuracy = position.coords.accuracy || 200;
            const confidence = this.calculateEnhancedConfidence(accuracy, position.coords, 'browser');

            resolve({
              position: [position.coords.longitude, position.coords.latitude],
              accuracy,
              confidence,
              source: 'browser',
              timestamp: Date.now(),
              speed: position.coords.speed || undefined,
              heading: position.coords.heading || undefined
            });
          },
          (error) => {
            console.warn(`🎯 浏览器定位尝试 ${attemptCount} 失败:`, error);

            if (attemptCount < maxAttempts) {
              setTimeout(attemptLocation, 1000);
              return;
            }

            let errorMessage = '浏览器定位失败';
            if (error.code === 1) {
              errorMessage = '定位权限被拒绝';
            } else if (error.code === 2) {
              errorMessage = '位置不可用';
            } else if (error.code === 3) {
              errorMessage = '定位超时';
            }

            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: Math.min(options.timeout || 12000, 12000),
            maximumAge: 0 // 不使用缓存
          }
        );
      };

      attemptLocation();
    });
  }

  // 🔥 选择最佳定位结果
  private selectBestLocation(locations: LocationData[], options: any): LocationData {
    if (locations.length === 1) {
      return locations[0];
    }

    // 计算综合得分
    const scoredLocations = locations.map(location => {
      let score = location.confidence;

      // 精度得分（精度越高得分越高）
      const accuracyScore = Math.max(0, 1 - location.accuracy / 500);
      score += accuracyScore * 0.4;

      // 来源得分（高德 > 浏览器）
      if (location.source === 'amap') score += 0.2;
      else if (location.source === 'browser') score += 0.1;

      // 时间得分（越新的越好）
      const ageScore = Math.max(0, 1 - (Date.now() - location.timestamp) / 60000);
      score += ageScore * 0.1;

      return { location, score };
    });

    // 排序并选择最佳
    scoredLocations.sort((a, b) => b.score - a.score);
    const best = scoredLocations[0];

    console.log('🎯 最佳定位选择:', best);

    return best.location;
  }

  // 🔥 增强版置信度计算
  private calculateEnhancedConfidence(
    accuracy: number, 
    data: any, 
    source: string
  ): number {
    let confidence = 0.8; // 基础置信度

    // 基于精度的置信度（更细粒度）
    if (accuracy < 5) confidence = 0.98;
    else if (accuracy < 10) confidence = 0.95;
    else if (accuracy < 20) confidence = 0.9;
    else if (accuracy < 50) confidence = 0.8;
    else if (accuracy < 100) confidence = 0.6;
    else if (accuracy < 200) confidence = 0.4;
    else confidence = 0.2;

    // 基于定位源的调整
    if (source === 'amap') {
      confidence *= 1.1; // 高德更可靠
    } else if (source === 'browser') {
      confidence *= 0.9;
    }

    // 基于卫星数量（如果有）
    if (data && data.satelliteNum) {
      if (data.satelliteNum >= 8) confidence *= 1.1;
      else if (data.satelliteNum >= 5) confidence *= 1.0;
      else confidence *= 0.9;
    }

    // 基于速度信息（静止状态更可靠）
    if (data && typeof data.speed === 'number') {
      if (data.speed < 1) confidence *= 1.05; // 静止状态
      else if (data.speed > 10) confidence *= 0.95; // 高速移动
    }

    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  // 计算定位置信度
  private calculateLocationConfidence(accuracy: number, locationType?: string): number {
    let confidence = 0.8; // 基础置信度
    
    // 基于精度的置信度
    if (accuracy < 10) confidence = 0.95;
    else if (accuracy < 30) confidence = 0.9;
    else if (accuracy < 100) confidence = 0.8;
    else if (accuracy < 300) confidence = 0.6;
    else confidence = 0.4;

    // 基于定位类型的调整
    if (locationType === 'html5') confidence *= 0.9;
    else if (locationType === 'ip') confidence *= 0.3;
    else if (locationType === 'sdk') confidence *= 1.1; // 高德SDK定位更可靠

    return Math.min(Math.max(confidence, 0.1), 1.0); // 限制在0.1-1.0之间
  }

  // 备用定位方案（简化版）
  private getFallbackLocation(
    mapInstance: AMapInstance,
    options: any
  ): Promise<{
    position: [number, number];
    accuracy: number;
    address?: string;
    confidence: number;
    source: string;
  }> {
    return new Promise((resolve, reject) => {
      console.log('使用浏览器原生定位...');

      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持定位功能'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('浏览器定位成功:', position);
          
          const accuracy = position.coords.accuracy || 200;
          let confidence = this.calculateLocationConfidence(accuracy, 'browser');

          resolve({
            position: [position.coords.longitude, position.coords.latitude],
            accuracy,
            address: '浏览器定位',
            confidence,
            source: 'browser'
          });
        },
        (error) => {
          console.error('浏览器定位失败:', error);
          
          let errorMessage = '所有定位方式都失败了';
          if (error.code === 1) {
            errorMessage = '定位权限被拒绝，请允许浏览器访问位置信息';
          } else if (error.code === 2) {
            errorMessage = '无法获取位置信息，请检查网络连接';
          } else if (error.code === 3) {
            errorMessage = '定位请求超时，请重试';
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: options.timeout || 8000,
          maximumAge: options.maximumAge || 60000
        }
      );
    });
  }

  // 根据精度计算最佳缩放级别
  private calculateOptimalZoom(accuracy: number): number {
    if (accuracy < 10) return 19;      // 10米内：最高级别
    if (accuracy < 50) return 18;      // 50米内：街道级别
    if (accuracy < 100) return 17;     // 100米内：社区级别
    if (accuracy < 500) return 15;     // 500米内：区域级别
    if (accuracy < 1000) return 14;    // 1公里内：城市级别
    if (accuracy < 5000) return 12;    // 5公里内：城市群级别
    return 10;                         // 更大范围：省市级别
  }

  // 🎯 获取定位质量报告
  public getLocationQuality(): LocationQuality {
    return this.locationHistory.getLocationQuality();
  }

  // 🎯 清除定位历史
  public clearLocationHistory(): void {
    this.locationHistory.clear();
  }

  // 检查SDK是否已加载
  public isSDKLoaded(): boolean {
    return !!this.AMap;
  }

  // 获取加载状态
  public getLoadingStatus(): boolean {
    return this.isLoading;
  }
}

// 导出单例实例
export const amapManager = AMapManager.getInstance(); 