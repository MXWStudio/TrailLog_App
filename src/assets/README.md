# 资源文件夹说明

本文件夹用于存放项目中使用的静态资源文件，如图片、图标、字体等。

请将所有与界面展示相关的静态文件统一放置于此，便于管理和引用。

# assets 文件夹说明

此文件夹用于存放所有静态图片资源，包括：
- 项目 logo
- 占位图片（如加载失败时显示的默认图片）
- 各类 UI 图标（SVG/PNG）
- 路线相关图片

## 建议结构

```
assets/
  logo.png
  placeholder.png
  icons/
    star.svg
    bookmark.svg
  trails/
    qingchengshan.jpg
    fujisan.jpg
```

> 请将所有静态图片资源按分类放入对应子文件夹，便于统一管理和引用。

# 图片资源说明

这个目录包含了TrailLog应用中使用的所有图片资源。

## 图片列表

### 步道风景图片
- **qingcheng_mountain.jpg** - 青城山后山幽径风景图
- **fushi_mountain.jpg** - 富士山吉田路线风景图 🗻
- **longjititian.jpg** - 龙脊梯田徒步路线风景图 🌾
- **fushishan_jitian.jpg** - 额外的富士山/梯田风景图

### 应用图标
- **vue.svg** - Vue.js logo

## 图片使用方式

所有图片都通过TrailCard组件进行展示：

```vue
// 在TrailCard.vue中
import qingchengMountain from '@/assets/qingcheng_mountain.jpg';
import fushiMountain from '@/assets/fushi_mountain.jpg';
import longjititian from '@/assets/longjititian.jpg';
```

## 验证图片显示

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 在浏览器中访问
打开 http://localhost:5173/

### 3. 导航到探索页面
点击底部导航的"探索"选项卡

### 4. 查看步道卡片
您应该能看到三个步道卡片：
- ✅ 青城山后山幽径（已有图片）
- ✅ 富士山吉田路线（新增图片）🗻
- ✅ 龙脊梯田徒步（新增图片）🌾

### 5. 验证图片功能
- 图片应该正常加载显示
- 每个卡片都有相应的地图预览
- 如果图片加载失败，会显示备用图片

## 图片规格要求

- **格式**：JPG/PNG
- **尺寸**：建议 375x200 像素（宽高比 16:9）
- **大小**：建议小于 200KB 以优化加载速度
- **质量**：高质量，适合移动设备显示

## 故障排除

如果图片不显示：

1. **检查文件路径**：确保图片文件在 `src/assets/` 目录中
2. **检查导入语句**：确保在TrailCard.vue中正确导入了图片
3. **检查数据映射**：确认 trails.ts 中的路径与实际文件名匹配
4. **清除缓存**：运行 `npm run dev` 重新启动开发服务器

## 添加新图片

要添加新的步道图片：

1. 将图片文件放入 `src/assets/` 目录
2. 在 `TrailCard.vue` 中导入图片
3. 在 `localImages` 映射中添加路径对应关系
4. 在 `trails.ts` 中更新相应的 `imageUrl` 路径 