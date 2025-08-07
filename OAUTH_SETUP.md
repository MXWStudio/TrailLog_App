# OAuth 第三方登录配置指南

本指南将帮助您配置 TrailLog 应用的 Google 和 Apple 第三方登录功能。

## 📋 前置要求

1. 有效的 Supabase 项目
2. Google Cloud Console 账户
3. Apple Developer 账户（可选，仅 Apple 登录需要）

## 🔧 Google 登录配置

### 1. 在 Google Cloud Console 中设置

1. **访问 Google Cloud Console**
   - 打开 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目

2. **启用 Google+ API**
   - 在左侧菜单中选择 "API 和服务" > "库"
   - 搜索 "Google+ API" 并启用

3. **创建 OAuth 2.0 凭据**
   - 转到 "API 和服务" > "凭据"
   - 点击 "创建凭据" > "OAuth 2.0 客户端 ID"
   - 选择应用类型为 "Web 应用"

4. **配置授权重定向 URI**
   - 添加以下重定向 URI：
   ```
   https://your-project.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```

5. **记录客户端信息**
   - 保存客户端 ID 和客户端密钥

### 2. 在 Supabase 中配置

1. **访问 Supabase Dashboard**
   - 登录您的 Supabase 项目
   - 转到 "Authentication" > "Providers"

2. **启用 Google 提供商**
   - 找到 "Google" 提供商
   - 点击 "Enable"
   - 输入从 Google Cloud Console 获取的客户端 ID 和密钥

3. **配置重定向 URL**
   - 确保重定向 URL 设置为：
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

## 🍎 Apple 登录配置

### 1. 在 Apple Developer 中设置

1. **访问 Apple Developer**
   - 登录 [Apple Developer](https://developer.apple.com/)
   - 转到 "Certificates, Identifiers & Profiles"

2. **创建 App ID**
   - 选择 "Identifiers" > "App IDs"
   - 创建新的 App ID
   - 启用 "Sign In with Apple" 功能

3. **创建 Service ID**
   - 选择 "Identifiers" > "Services IDs"
   - 创建新的 Service ID
   - 配置域名和重定向 URL

4. **创建密钥**
   - 选择 "Keys" > "All"
   - 创建新的密钥
   - 启用 "Sign In with Apple"
   - 下载 .p8 密钥文件

### 2. 在 Supabase 中配置

1. **启用 Apple 提供商**
   - 在 Supabase Dashboard 中
   - 转到 "Authentication" > "Providers"
   - 找到 "Apple" 提供商并启用

2. **配置 Apple 设置**
   - 输入 Service ID
   - 上传 .p8 密钥文件
   - 配置密钥 ID 和团队 ID

## 🌐 环境变量配置

在您的 `.env.local` 文件中添加以下配置：

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OAuth 重定向 URL
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
```

## 🧪 测试配置

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev

# 访问登录页面
# http://localhost:5173/login
```

### 2. 测试步骤

1. **测试 Google 登录**
   - 点击 "使用 Google 继续" 按钮
   - 应该跳转到 Google 登录页面
   - 登录后应该重定向回应用

2. **测试 Apple 登录**
   - 点击 "使用 Apple 继续" 按钮
   - 应该跳转到 Apple 登录页面
   - 登录后应该重定向回应用

3. **检查用户创建**
   - 登录成功后检查 Supabase 用户表
   - 确认新用户记录已创建

## 🚨 常见问题

### Google 登录问题

1. **"redirect_uri_mismatch" 错误**
   - 检查 Google Cloud Console 中的重定向 URI 配置
   - 确保与 Supabase 中的配置一致

2. **"invalid_client" 错误**
   - 验证客户端 ID 和密钥是否正确
   - 检查 Google+ API 是否已启用

### Apple 登录问题

1. **"invalid_client" 错误**
   - 检查 Service ID 配置
   - 验证密钥文件是否正确上传

2. **重定向失败**
   - 检查域名配置
   - 确保重定向 URL 格式正确

## 🔒 安全注意事项

1. **保护密钥**
   - 不要将密钥提交到版本控制
   - 使用环境变量存储敏感信息

2. **HTTPS 要求**
   - 生产环境必须使用 HTTPS
   - 本地开发可以使用 HTTP

3. **域名验证**
   - 确保重定向域名已正确配置
   - 定期检查域名有效性

## 📱 移动端配置

### Capacitor 配置

在 `capacitor.config.ts` 中添加：

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.traillog.app',
  appName: 'TrailLog',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // OAuth 插件配置
  }
};

export default config;
```

## 🎯 最佳实践

1. **用户体验**
   - 提供多种登录选项
   - 保持登录状态的一致性
   - 提供清晰的错误信息

2. **安全性**
   - 定期更新 OAuth 配置
   - 监控登录活动
   - 实施适当的会话管理

3. **维护**
   - 定期检查 OAuth 提供商状态
   - 更新过期的密钥和证书
   - 监控错误日志

## 📚 相关资源

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In 文档](https://developer.apple.com/sign-in-with-apple/)
- [Vue 3 认证最佳实践](https://vuejs.org/guide/best-practices/security.html)

---

**注意**: 本配置仅适用于开发环境。生产环境部署时，请确保所有安全设置都已正确配置。 