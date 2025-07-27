# 环境变量配置说明

## Supabase 数据库配置 🆕

### 1. 获取 Supabase 配置信息

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目或创建新项目
3. 进入 `Settings` → `API`
4. 复制以下信息：
   - `Project URL`：已配置为 https://gaxjvkvudzrwyochicps.supabase.co
   - `anon public key`：需要配置到环境变量中

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件，添加以下配置：

```bash
# Supabase 配置
VITE_SUPABASE_KEY=your_supabase_anon_key_here

# 高德地图配置
VITE_AMAP_API_KEY=your_amap_api_key_here

# 应用配置
VITE_APP_NAME=TrailLog
VITE_APP_VERSION=1.0.0
```

### 3. 安全注意事项

- **VITE_SUPABASE_KEY** 使用的是 `anon` 公钥，可以安全地在前端使用
- 不要将 `service_role` 密钥用于前端应用
- 确保在 Supabase 项目中正确配置了 RLS（行级安全）策略

## 高德地图API配置

### 前置配置

1. **高德地图API Key配置**
   - 前往 [高德开放平台](https://console.amap.com/) 注册并创建应用
   - 获取Web服务API Key
   - 在项目根目录创建 `.env.local` 文件
   - 添加 `VITE_AMAP_API_KEY=your_amap_api_key_here`

2. **地图功能权限**
   - Web端地图：申请Web端(JS API)类型的Key
   - 移动端：需要额外配置iOS/Android端权限
   - 定位服务：确保Key包含定位权限

### 重要提示

- 确保您的API Key具有以下权限：
  - Web服务API
  - Web端(JS API)
- 在高德开放平台控制台中配置安全域名
- 开发环境可配置 `localhost`
- 不要将真实的API Key提交到代码仓库

## 配置验证

运行以下命令验证配置是否正确：

```bash
npm run dev
```

如果配置正确，应用启动时不应该有环境变量相关的错误信息。

