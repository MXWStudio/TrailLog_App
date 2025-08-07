// 测试用户注册功能
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// Supabase配置
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

console.log('🧪 TrailLog 注册功能测试\n');

if (!supabaseKey) {
  console.error('❌ 错误：VITE_SUPABASE_KEY 环境变量未配置');
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

async function testRegistration() {
  try {
    console.log('📝 测试用户注册功能...');
    
    // 生成唯一的测试邮箱
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'testpassword123';
    
    console.log(`   测试邮箱: ${testEmail}`);
    console.log(`   测试密码: ${testPassword}`);
    
    console.log('\n🔐 调用 Supabase Auth API...');
    
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
      console.error('❌ 注册失败:', error.message);
      console.log('\n📋 错误详情:');
      console.log(`   错误代码: ${error.status || 'N/A'}`);
      console.log(`   错误信息: ${error.message}`);
      
      // 分析错误类型
      if (error.message.includes('invalid')) {
        console.log('\n💡 可能的原因:');
        console.log('   1. 邮箱格式问题');
        console.log('   2. Supabase项目配置问题');
        console.log('   3. 认证服务未启用');
      } else if (error.message.includes('does not exist')) {
        console.log('\n💡 可能的原因:');
        console.log('   1. 数据库表未创建');
        console.log('   2. 需要先执行 database_schema.sql');
      }
      
      return false;
    }
    
    console.log('✅ 注册成功！');
    console.log(`   用户ID: ${data.user?.id}`);
    console.log(`   邮箱: ${data.user?.email}`);
    console.log(`   会话: ${data.session ? '已创建' : '未创建'}`);
    
    if (data.user && !data.session) {
      console.log('\n📧 注意：用户已创建，但需要邮箱验证');
      console.log('   请检查邮箱中的验证链接');
    }
    
    return true;
  } catch (error) {
    console.error('❌ 注册测试异常:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  try {
    console.log('🔗 测试数据库连接...');
    
    // 尝试查询一个简单的表
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ 数据库表未创建');
        console.log('   请先执行 database_schema.sql 脚本');
        return false;
      } else {
        console.error('❌ 数据库连接错误:', error.message);
        return false;
      }
    }
    
    console.log('✅ 数据库连接正常');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接异常:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 开始测试...\n');
  
  // 首先测试数据库连接
  const dbOk = await testDatabaseConnection();
  
  if (!dbOk) {
    console.log('\n⚠️ 数据库连接失败，但继续测试注册功能...');
  }
  
  // 测试注册功能
  const registrationOk = await testRegistration();
  
  console.log('\n📊 测试结果:');
  console.log(`   数据库连接: ${dbOk ? '✅ 正常' : '❌ 失败'}`);
  console.log(`   注册功能: ${registrationOk ? '✅ 成功' : '❌ 失败'}`);
  
  if (registrationOk) {
    console.log('\n🎉 注册功能测试通过！');
    console.log('   现在可以正常使用注册功能了。');
  } else {
    console.log('\n⚠️ 注册功能测试失败');
    console.log('   请按照以下步骤解决问题：');
    console.log('   1. 确保Supabase项目配置正确');
    console.log('   2. 执行 database_schema.sql 创建数据库表');
    console.log('   3. 检查邮箱验证设置');
  }
}

main().catch(console.error); 