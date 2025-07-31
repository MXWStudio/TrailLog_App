# TrailLog iOS 项目

这是 TrailLog 应用的 iOS 原生项目，基于 Capacitor 框架构建。

## 项目结构

```
ios/
├── App/                    # iOS 应用主目录
│   ├── App/               # 应用源代码
│   │   ├── AppDelegate.swift    # 应用代理
│   │   ├── Info.plist          # 应用配置
│   │   ├── Assets.xcassets/    # 图标和图片资源
│   │   ├── Base.lproj/         # 本地化资源
│   │   └── public/             # Web 资源（从 dist 同步）
│   ├── App.xcodeproj/     # Xcode 项目文件
│   └── Podfile            # CocoaPods 依赖配置
└── capacitor-cordova-ios-plugins/  # Capacitor 插件
```

## 环境要求

- **Xcode**: 15.0 或更高版本
- **iOS SDK**: 17.0 或更高版本
- **CocoaPods**: 最新版本
- **Node.js**: 18.0 或更高版本
- **Capacitor CLI**: 6.0 或更高版本

## 快速开始

### 1. 安装依赖

```bash
# 在项目根目录执行
npm install
npm run build
npx cap sync ios
```

### 2. 打开 iOS 项目

```bash
npx cap open ios
```

### 3. 在 Xcode 中运行

1. 在 Xcode 中选择目标设备（模拟器或真机）
2. 点击运行按钮 (⌘+R)
3. 应用将自动构建并运行

## 配置说明

### 应用权限

应用已配置以下权限：

- **位置服务**: 用于徒步导航和路线记录
- **相机**: 用于拍摄徒步照片
- **相册**: 用于选择和保存照片
- **麦克风**: 用于录制视频

### 网络配置

已配置 App Transport Security 以支持高德地图 API：

- 允许 HTTP 连接（开发环境）
- 配置高德地图域名例外

### 状态栏配置

- 样式：浅色主题
- 背景色：白色
- 不覆盖 WebView

## 开发工作流

### 同步 Web 代码到 iOS

```bash
# 构建 Web 项目
npm run build

# 同步到 iOS
npx cap sync ios
```

### 添加新的 Capacitor 插件

```bash
# 安装插件
npm install @capacitor/plugin-name

# 同步到 iOS
npx cap sync ios
```

### 调试

1. **Web 调试**: 在 Safari 中打开 `http://localhost:8100`
2. **原生调试**: 在 Xcode 中使用断点和日志
3. **控制台日志**: 在 Xcode 控制台查看应用日志

## 常见问题

### 1. 构建失败

**问题**: Xcode 构建时出现错误
**解决**: 
- 清理项目: `Product > Clean Build Folder`
- 删除 Derived Data: `Xcode > Preferences > Locations > Derived Data > Delete`
- 重新安装依赖: `cd ios/App && pod install`

### 2. 插件不工作

**问题**: Capacitor 插件无法正常使用
**解决**:
- 检查插件是否正确安装: `npx cap ls ios`
- 重新同步: `npx cap sync ios`
- 检查 Info.plist 权限配置

### 3. 网络请求失败

**问题**: 高德地图或其他 API 请求失败
**解决**:
- 检查网络连接
- 验证 API Key 配置
- 确认 Info.plist 中的网络安全配置

### 4. 位置服务不工作

**问题**: 应用无法获取位置信息
**解决**:
- 检查设备位置服务是否开启
- 确认应用权限设置
- 在设置中允许应用访问位置

## 发布准备

### 1. 应用图标

确保 `Assets.xcassets/AppIcon.appiconset/` 包含所有必要的图标尺寸。

### 2. 版本号

在 Xcode 中更新版本号：
- `MARKETING_VERSION`: 用户可见版本号
- `CURRENT_PROJECT_VERSION`: 构建版本号

### 3. 签名配置

配置开发者账号和证书：
1. 在 Xcode 中选择项目
2. 选择目标应用
3. 在 "Signing & Capabilities" 中配置

### 4. 测试

在真机上测试所有功能：
- 位置服务
- 相机功能
- 网络请求
- 应用性能

## 技术栈

- **框架**: Capacitor 6.x
- **Web 技术**: Vue 3 + TypeScript
- **UI 框架**: Tailwind CSS
- **地图服务**: 高德地图 API
- **后端服务**: Supabase
- **状态管理**: Pinia

## 联系支持

如有问题，请查看：
1. [Capacitor 文档](https://capacitorjs.com/docs)
2. [iOS 开发文档](https://developer.apple.com/documentation/)
3. 项目根目录的 README.md 