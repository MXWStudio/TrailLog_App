# Trail Log

一款专为徒步爱好者设计的移动App，提供路线探索、导航、活动记录与分享、个人数据统计等功能。

## 项目信息

- **项目名称**：Trail Log
- **目标平台**：移动端（主要为 iOS，同时考虑通用适配）
- **技术栈**：
  - Vue 3 (Composition API)
  - Vue Router
  - Pinia (计划中)
  - Tailwind CSS
  - Mapbox GL JS (或高德/百度地图SDK)

## 核心模块

1. **探索/社区页 (Explore)**
   - 本地和关注内容切换
   - 目的地搜索
   - 徒步活动展示
   - **新增**：富士山和龙脊梯田路线展示

2. **导航页 (Navigate)**
   - 2D/3D 地图视图
   - 路线信息展示
   - 离线地图下载

3. **收藏页 (Saved)**
   - 列表管理
   - 公园收藏
   - 离线下载管理

4. **个人页 (Profile)**
   - 用户信息展示
   - 统计数据
   - 内容管理

## 最新功能更新

### 图片资源集成
- ✅ **富士山徒步路线**：集成了高质量的富士山风光图片，展示日本最高峰的壮丽景色
- ✅ **龙脊梯田徒步路线**：添加了广西龙脊梯田的美丽图片，展现层层叠叠的农业艺术
- ✅ **本地图片优化**：实现了本地图片与网络图片的智能切换，提升加载速度
- ✅ **图片错误处理**：完善了图片加载失败时的备用机制

### 路线数据完善
- 富士山吉田路线：14.5公里，难度困难，预计8小时30分钟
- 龙脊梯田徒步：10.1公里，难度中等，预计4小时15分钟
- 青城山后山幽径：7.24公里，难度中等，预计3小时9分钟

### 技术改进
- 优化了TrailCard组件的图片处理逻辑
- 实现了本地assets与外部URL的统一管理
- 添加了图片加载状态和错误处理机制

## 开发规范

本项目严格遵循 `.cursorrules` 系列文件中的开发规范，包括：
- 代码规范 (.cursorrules.code)
- 组件开发规范 (.cursorrules.component)
- 状态管理规范 (.cursorrules.store)
- 路由规范 (.cursorrules.router)
- 样式规范 (.cursorrules.style)
- 项目结构规范 (.cursorrules.structure)

## 安装和运行

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# iOS平台运行
npm run ios
```

## 图片资源说明

项目中的图片资源位于 `src/assets/` 目录：
- `qingcheng_mountain.jpg` - 青城山风景图
- `fushi_mountain.jpg` - 富士山风景图  
- `longjititian.jpg` - 龙脊梯田风景图

所有图片都已经过优化处理，确保在移动设备上的最佳显示效果。

## 版权信息

本规则由 Miles Walker 创建，版权所有，引用请注明出处
