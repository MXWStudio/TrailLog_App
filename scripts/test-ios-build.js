#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 检查 iOS 项目配置...\n');

// 检查关键文件是否存在
const filesToCheck = [
  'ios/App/App/AppDelegate.swift',
  'ios/App/App/Info.plist',
  'ios/App/App/public/index.html',
  'ios/App/Podfile',
  'ios/App/App.xcodeproj/project.pbxproj'
];

let allFilesExist = true;

filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📱 iOS 项目状态:');
console.log(`- 项目文件完整性: ${allFilesExist ? '✅ 正常' : '❌ 有问题'}`);

// 检查 public 目录内容
const publicDir = 'ios/App/App/public';
if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  console.log(`- Web 资源文件数量: ${files.length} 个文件`);
  
  // 检查关键资源
  const hasIndexHtml = files.includes('index.html');
  const hasAssets = files.some(f => f.includes('assets'));
  
  console.log(`- index.html: ${hasIndexHtml ? '✅' : '❌'}`);
  console.log(`- 资源文件: ${hasAssets ? '✅' : '❌'}`);
}

// 检查 Capacitor 配置
const capacitorConfig = 'ios/App/App/capacitor.config.json';
if (fs.existsSync(capacitorConfig)) {
  try {
    const config = JSON.parse(fs.readFileSync(capacitorConfig, 'utf8'));
    console.log(`- Capacitor 配置: ✅ 正常`);
    console.log(`- 应用 ID: ${config.appId || '未设置'}`);
    console.log(`- 应用名称: ${config.appName || '未设置'}`);
  } catch (e) {
    console.log(`- Capacitor 配置: ❌ 解析失败`);
  }
}

console.log('\n🚀 下一步操作:');
console.log('1. 运行 "npx cap open ios" 在 Xcode 中打开项目');
console.log('2. 在 Xcode 中选择目标设备（模拟器或真机）');
console.log('3. 点击运行按钮 (⌘+R) 构建并运行应用');
console.log('4. 检查社区页面是否正常显示');

if (!allFilesExist) {
  console.log('\n⚠️  发现问题，请运行以下命令重新同步:');
  console.log('npm run build && npx cap sync ios');
} 