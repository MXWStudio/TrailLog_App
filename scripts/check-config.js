#!/usr/bin/env node

/**
 * TrailLog 应用配置检查脚本
 * 用于验证 Supabase 和高德地图配置是否正确
 */

import fs from 'fs'
import path from 'path'

console.log('🔍 TrailLog 配置检查工具\n')

// 检查 .env.local 文件是否存在
const envPath = path.resolve('.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ 未找到 .env.local 文件')
  console.log('📝 请创建 .env.local 文件并配置以下环境变量：')
  console.log('')
  console.log('VITE_SUPABASE_KEY=your_supabase_anon_key_here')
  console.log('VITE_AMAP_API_KEY=your_amap_api_key_here')
  console.log('VITE_APP_NAME=TrailLog')
  console.log('VITE_APP_VERSION=1.0.0')
  console.log('')
  console.log('📖 详细配置说明请查看 ENV_SETUP.md 文件')
  process.exit(1)
}

console.log('✅ 找到 .env.local 文件')

// 读取环境变量
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim()
    }
  }
})

// 检查必需的环境变量
const requiredVars = [
  'VITE_SUPABASE_KEY',
  'VITE_AMAP_API_KEY'
]

const optionalVars = [
  'VITE_APP_NAME',
  'VITE_APP_VERSION'
]

let allValid = true

console.log('\n📋 环境变量检查：')

// 检查必需变量
requiredVars.forEach(varName => {
  const value = envVars[varName]
  if (!value || value.includes('请替换') || value.includes('your_')) {
    console.log(`❌ ${varName}: 未正确配置`)
    allValid = false
  } else {
    const maskedValue = value.length > 10 ? 
      value.substring(0, 6) + '...' + value.substring(value.length - 4) : 
      '*'.repeat(value.length)
    console.log(`✅ ${varName}: ${maskedValue}`)
  }
})

// 检查可选变量
optionalVars.forEach(varName => {
  const value = envVars[varName]
  if (value && !value.includes('请替换')) {
    console.log(`✅ ${varName}: ${value}`)
  } else {
    console.log(`⚠️  ${varName}: 未配置（可选）`)
  }
})

// 检查 Supabase 配置
console.log('\n🗄️  Supabase 配置检查：')
const supabaseKey = envVars['VITE_SUPABASE_KEY']

if (supabaseKey && supabaseKey.startsWith('eyJ')) {
  console.log('✅ Supabase Key 格式看起来正确（JWT 格式）')
} else if (supabaseKey && !supabaseKey.includes('请替换')) {
  console.log('⚠️  Supabase Key 格式可能不正确，请确认是 anon public key')
} else {
  console.log('❌ Supabase Key 未正确配置')
  allValid = false
}

// 检查高德地图配置
console.log('\n🗺️  高德地图配置检查：')
const amapKey = envVars['VITE_AMAP_API_KEY']

if (amapKey && amapKey.length >= 20 && !amapKey.includes('请替换')) {
  console.log('✅ 高德地图 API Key 格式看起来正确')
} else {
  console.log('❌ 高德地图 API Key 未正确配置')
  allValid = false
}

// 最终结果
console.log('\n' + '='.repeat(50))

if (allValid) {
  console.log('🎉 配置检查通过！可以开始使用 TrailLog 应用')
  console.log('')
  console.log('🚀 运行命令：')
  console.log('   npm run dev    # 启动开发服务器')
  console.log('   npm run build  # 构建生产版本')
  console.log('   npm run ios    # iOS 平台运行')
} else {
  console.log('⚠️  配置检查未通过，请修复上述问题后重试')
  console.log('')
  console.log('📚 获取帮助：')
  console.log('   - 查看 ENV_SETUP.md 文件了解详细配置说明')
  console.log('   - 查看 README.md 文件了解项目功能')
  console.log('   - 访问 https://supabase.com/dashboard 获取 Supabase 配置')
  console.log('   - 访问 https://console.amap.com/ 获取高德地图 API Key')
}

console.log('') 