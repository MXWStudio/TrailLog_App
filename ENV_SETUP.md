# Trail Log 环境变量配置指南

复制此文件为 .env.local 并填入真实的配置信息：

## Supabase 数据库配置 (必需)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

## 高德地图 API Key (可选)
VITE_AMAP_API_KEY=your_amap_api_key_here

## 应用配置
VITE_APP_TITLE=Trail Log
VITE_APP_VERSION=1.0.0

注意：
- 请不要将包含真实密钥的 .env.local 文件提交到代码仓库
- 获取 Supabase 配置：前往 https://supabase.com/dashboard
- 获取高德地图 API Key：前往 https://console.amap.com/

