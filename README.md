# TrailLog - 徒步日志应用

一个现代化的徒步日志应用，帮助用户记录和分享他们的徒步经历。

## 🚀 最新更新

### 认证页面UI更新 (v1.0.0)

我们刚刚完成了认证页面的全面UI更新，按照Supabase官方登录流程重新设计了所有认证相关页面：

#### ✨ 主要改进
- **现代化设计**：采用渐变背景和圆角设计
- **第三方登录**：集成Google和Apple登录
- **增强用户体验**：密码显示/隐藏、加载动画、改进的错误提示
- **响应式设计**：完美适配各种设备
- **统一视觉风格**：所有认证页面保持一致的设计语言

#### 📱 更新的页面
- `src/views/Auth/LoginPage.vue` - 登录页面
- `src/views/Auth/RegisterPage.vue` - 注册页面  
- `src/views/Auth/AuthCallback.vue` - 认证回调页面

#### 🎨 设计特色
- 渐变背景：`bg-gradient-to-br from-blue-50 via-white to-indigo-50`
- 圆角设计：`rounded-xl` 和 `rounded-2xl`
- 阴影效果：`shadow-lg` 和 `hover:shadow-xl`
- 动画效果：加载状态和悬停动画

详细更新内容请查看 [AUTH_UI_UPDATE.md](./AUTH_UI_UPDATE.md)

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **样式框架**: Tailwind CSS
- **状态管理**: Pinia
- **后端服务**: Supabase
- **路由管理**: Vue Router
- **构建工具**: Vite

## 📦 安装和运行

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
创建 `.env.local` 文件并配置以下环境变量：
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🏗️ 项目结构

```
TrailLog/
├── src/
│   ├── views/
│   │   ├── Auth/           # 认证相关页面
│   │   ├── Explore/        # 探索页面
│   │   ├── Community/      # 社区页面
│   │   ├── Navigate/       # 导航页面
│   │   ├── Profile/        # 个人资料页面
│   │   └── Saved/          # 收藏页面
│   ├── components/         # 可复用组件
│   ├── stores/            # Pinia状态管理
│   ├── services/          # API服务
│   ├── utils/             # 工具函数
│   └── router/            # 路由配置
├── public/                # 静态资源
├── scripts/               # 工具脚本
└── docs/                  # 文档
```

## 🔐 认证系统

### 支持的登录方式
- **邮箱密码登录**
- **Google OAuth登录**
- **Apple Sign In登录**

### 认证流程
1. 用户选择登录方式
2. 第三方登录重定向到Supabase
3. 认证成功后回调到应用
4. 自动跳转到主页面

## 🎯 核心功能

### 徒步路线管理
- 浏览徒步路线
- 查看路线详情
- 收藏喜欢的路线
- 记录徒步经历

### 社区功能
- 发布徒步日志
- 分享照片和体验
- 点赞和评论
- 关注其他用户

### 个人中心
- 个人资料管理
- 徒步统计
- 收藏管理
- 设置偏好

## 🧪 测试

### 运行UI测试
```bash
node scripts/test-auth-ui.js
```

### 运行数据库测试
```bash
node scripts/test-database.js
```

### 运行Supabase连接测试
```bash
node scripts/test-supabase-connection.js
```

## 📚 文档

- [认证UI更新文档](./AUTH_UI_UPDATE.md)
- [数据库设置指南](./DATABASE_SETUP_GUIDE.md)
- [环境配置指南](./ENV_SETUP.md)
- [OAuth设置指南](./OAUTH_SETUP.md)

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至项目维护者

---

*最后更新：2024年12月*
*版本：v1.0.0*