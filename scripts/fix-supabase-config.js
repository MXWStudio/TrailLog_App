// Supabase配置修复脚本
// 这个脚本会帮助诊断和修复Supabase配置问题

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// Supabase配置
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

console.log('🔧 TrailLog Supabase 配置修复脚本\n');

if (!supabaseKey) {
  console.error('❌ 错误：VITE_SUPABASE_KEY 环境变量未配置');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseProject() {
  try {
    console.log('🔍 检查Supabase项目状态...');
    
    // 尝试获取项目信息
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ 项目连接失败:', error.message);
      return false;
    }
    
    console.log('✅ 项目连接正常');
    return true;
  } catch (error) {
    console.error('❌ 项目检查异常:', error.message);
    return false;
  }
}

async function testAuthConfiguration() {
  try {
    console.log('\n🔐 测试认证配置...');
    
    // 使用一个简单的邮箱格式测试
    const testEmail = 'test@test.com';
    const testPassword = 'testpassword123';
    
    console.log(`   测试邮箱: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (error) {
      console.log('❌ 认证配置问题:', error.message);
      
      // 分析具体问题
      if (error.message.includes('invalid')) {
        console.log('\n💡 问题分析:');
        console.log('   Supabase认为邮箱地址无效');
        console.log('   这通常是因为以下原因之一：');
        console.log('   1. Supabase项目的邮箱验证设置有问题');
        console.log('   2. 项目处于暂停状态');
        console.log('   3. 认证服务未正确配置');
        
        console.log('\n🔧 解决方案:');
        console.log('   1. 访问 Supabase Dashboard');
        console.log('   2. 进入你的项目设置');
        console.log('   3. 检查 Authentication → Settings');
        console.log('   4. 确保 "Enable email confirmations" 已启用');
        console.log('   5. 检查 "Site URL" 配置是否正确');
        console.log('   6. 确保项目状态为 "Active"');
        
        return false;
      }
      
      return false;
    }
    
    console.log('✅ 认证配置正常');
    return true;
  } catch (error) {
    console.error('❌ 认证测试异常:', error.message);
    return false;
  }
}

async function checkProjectSettings() {
  console.log('\n📋 Supabase项目设置检查清单:');
  console.log('   请按照以下步骤检查你的Supabase项目设置:\n');
  
  console.log('1️⃣ 项目状态检查:');
  console.log('   - 访问 https://supabase.com/dashboard');
  console.log('   - 选择项目: hklkdmochyykuyrwjbhy');
  console.log('   - 确保项目状态为 "Active"');
  
  console.log('\n2️⃣ 认证设置检查:');
  console.log('   - 进入 Authentication → Settings');
  console.log('   - 确保 "Enable email confirmations" 已启用');
  console.log('   - 检查 "Site URL" 是否正确配置');
  console.log('   - 建议设置为: http://localhost:5173');
  
  console.log('\n3️⃣ API密钥检查:');
  console.log('   - 进入 Settings → API');
  console.log('   - 确认使用的是 "anon public" 密钥');
  console.log('   - 不要使用 "service_role" 密钥');
  
  console.log('\n4️⃣ 数据库设置检查:');
  console.log('   - 进入 SQL Editor');
  console.log('   - 执行 database_schema.sql 创建表结构');
  console.log('   - 执行 database_security.sql 配置安全策略');
  
  console.log('\n5️⃣ 邮箱服务检查:');
  console.log('   - 进入 Authentication → Email Templates');
  console.log('   - 确保邮箱模板配置正确');
  console.log('   - 检查 SMTP 设置（如果使用自定义邮箱服务）');
}

async function main() {
  console.log('🚀 开始配置诊断...\n');
  
  const projectOk = await checkSupabaseProject();
  const authOk = await testAuthConfiguration();
  
  console.log('\n📊 诊断结果:');
  console.log(`   项目连接: ${projectOk ? '✅ 正常' : '❌ 失败'}`);
  console.log(`   认证配置: ${authOk ? '✅ 正常' : '❌ 失败'}`);
  
  if (!authOk) {
    await checkProjectSettings();
  }
  
  console.log('\n🎯 下一步操作:');
  console.log('   1. 按照上述清单检查项目设置');
  console.log('   2. 修复发现的问题');
  console.log('   3. 重新运行测试: node scripts/test-registration.js');
  
  if (projectOk && authOk) {
    console.log('\n🎉 所有配置正常！');
    console.log('   现在可以正常使用注册功能了。');
  }
}

main().catch(console.error); 