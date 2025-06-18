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
```

## 版权信息

本规则由 Miles Walker 创建，版权所有，引用请注明出处
