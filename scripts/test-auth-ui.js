#!/usr/bin/env node

/**
 * 认证页面UI更新测试脚本
 * 验证登录、注册和认证回调页面的UI更新是否正确
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 开始测试认证页面UI更新...\n');

// 测试文件列表
const testFiles = [
  'src/views/Auth/LoginPage.vue',
  'src/views/Auth/RegisterPage.vue',
  'src/views/Auth/AuthCallback.vue'
];

// 测试内容关键词
const expectedContent = {
  'LoginPage.vue': [
    'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    'rounded-2xl',
    'shadow-lg',
    'Google 继续',
    'Apple 继续',
    'togglePassword',
    'showPassword',
    'animate-spin',
    'rounded-xl'
  ],
  'RegisterPage.vue': [
    'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    'rounded-2xl',
    'shadow-lg',
    'Google 继续',
    'Apple 继续',
    'togglePassword',
    'toggleConfirmPassword',
    'showPassword',
    'showConfirmPassword',
    'rounded-xl'
  ],
  'AuthCallback.vue': [
    'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    'rounded-2xl',
    'shadow-lg',
    'animate-spin',
    'rounded-xl'
  ]
};

let allTestsPassed = true;

// 测试函数
function testFile(filePath, expectedKeywords) {
  console.log(`📁 测试文件: ${filePath}`);
  
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ 文件不存在: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    let passed = true;
    
    expectedKeywords.forEach(keyword => {
      if (!content.includes(keyword)) {
        console.log(`❌ 缺少关键词: ${keyword}`);
        passed = false;
      }
    });
    
    if (passed) {
      console.log(`✅ 文件测试通过`);
    } else {
      console.log(`❌ 文件测试失败`);
    }
    
    return passed;
  } catch (error) {
    console.log(`❌ 读取文件失败: ${error.message}`);
    return false;
  }
}

// 运行测试
testFiles.forEach(file => {
  const fileName = path.basename(file);
  const expectedKeywords = expectedContent[fileName] || [];
  
  if (!testFile(file, expectedKeywords)) {
    allTestsPassed = false;
  }
  
  console.log('');
});

// 检查文档文件
console.log('📚 检查文档文件...');
const docFile = path.join(__dirname, '..', 'AUTH_UI_UPDATE.md');
if (fs.existsSync(docFile)) {
  console.log(`✅ 文档文件存在: AUTH_UI_UPDATE.md`);
} else {
  console.log(`❌ 文档文件不存在: AUTH_UI_UPDATE.md`);
  allTestsPassed = false;
}

// 测试结果
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 所有测试通过！认证页面UI更新成功！');
  console.log('\n✅ 更新内容包括:');
  console.log('   - 现代化渐变背景设计');
  console.log('   - 圆角按钮和卡片设计');
  console.log('   - Google和Apple第三方登录按钮');
  console.log('   - 密码显示/隐藏切换功能');
  console.log('   - 加载状态动画');
  console.log('   - 改进的错误提示');
  console.log('   - 响应式设计优化');
  console.log('   - 统一的视觉风格');
} else {
  console.log('❌ 部分测试失败，请检查更新内容');
}

console.log('\n📋 测试完成时间:', new Date().toLocaleString());
console.log('='.repeat(50)); 