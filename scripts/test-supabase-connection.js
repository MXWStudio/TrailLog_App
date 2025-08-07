// 测试Supabase连接和注册功能
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// Supabase配置
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

console.log('🔍 TrailLog Supabase 连接测试\n');

console.log('📋 配置信息:');
console.log(`   Supabase URL: ${supabaseUrl}`);
console.log(`   Supabase Key: ${supabaseKey ? '已配置' : '未配置'}`);

if (!supabaseKey) {
  console.error('❌ 错误：VITE_SUPABASE_KEY 环境变量未配置');
  console.log('请检查 .env.local 文件是否正确配置了 VITE_SUPABASE_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    autoRefreshToken: false,
  }
});

async function testConnection() {
  try {
    console.log('\n🔗 测试Supabase连接...');
    
    // 测试基本连接
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ 连接测试失败:', error.message);
      return false;
    }
    
    console.log('✅ 连接测试成功');
    return true;
  } catch (error) {
    console.error('❌ 连接测试异常:', error.message);
    return false;
  }
}

async function testRegistration() {
  try {
    console.log('\n📝 测试用户注册功能...');
    
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';
    
    console.log(`   测试邮箱: ${testEmail}`);
    console.log(`   测试密码: ${testPassword}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'testuser'
        }
      }
    });
    
    if (error) {
      console.error('❌ 注册测试失败:', error.message);
      return false;
    }
    
    console.log('✅ 注册测试成功');
    console.log(`   用户ID: ${data.user?.id}`);
    return true;
  } catch (error) {
    console.error('❌ 注册测试异常:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 开始测试...\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ 连接测试失败，跳过注册测试');
    return;
  }
  
  const registrationOk = await testRegistration();
  
  console.log('\n📊 测试结果:');
  console.log(`   连接测试: ${connectionOk ? '✅ 通过' : '❌ 失败'}`);
  console.log(`   注册测试: ${registrationOk ? '✅ 通过' : '❌ 失败'}`);
  
  if (connectionOk && registrationOk) {
    console.log('\n🎉 所有测试通过！Supabase配置正确。');
  } else {
    console.log('\n⚠️ 部分测试失败，请检查配置。');
  }
}

main().catch(console.error); 