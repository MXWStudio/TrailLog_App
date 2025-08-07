// TrailLog数据库连接测试脚本
// 使用前请确保已经在Supabase中执行了database_schema.sql和database_security.sql

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 配置信息
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'your_supabase_anon_key_here';

// 创建客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🧪 开始测试TrailLog数据库连接...\n');

  try {
    // 1. 测试基本连接
    console.log('1️⃣ 测试基本连接...');
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ 连接失败:', error.message);
      return;
    }
    console.log('✅ 数据库连接成功！');

    // 2. 测试应用配置表
    console.log('\n2️⃣ 测试应用配置...');
    const { data: settings } = await supabase
      .from('app_settings')
      .select('*');
    
    if (settings && settings.length > 0) {
      console.log('✅ 应用配置表正常，配置项数量:', settings.length);
      settings.forEach(setting => {
        console.log(`   - ${setting.setting_key}: ${setting.setting_value}`);
      });
    } else {
      console.log('⚠️ 应用配置表为空，请执行database_schema.sql');
    }

    // 3. 测试用户认证
    console.log('\n3️⃣ 测试用户认证功能...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ 当前未登录（这是正常的）');
    } else {
      console.log('✅ 认证系统正常');
    }

    // 4. 测试存储桶（如果已配置）
    console.log('\n4️⃣ 测试存储桶配置...');
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.log('⚠️ 存储桶访问失败，请检查配置');
      } else {
        console.log('✅ 存储系统可访问，桶数量:', buckets.length);
        buckets.forEach(bucket => {
          console.log(`   - ${bucket.name} (${bucket.public ? '公开' : '私有'})`);
        });
      }
    } catch (e) {
      console.log('⚠️ 存储桶测试跳过（可能未配置）');
    }

    // 5. 测试表结构
    console.log('\n5️⃣ 测试主要表结构...');
    const tables = ['users', 'trails', 'posts', 'comments', 'likes', 'bookmarks'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ 表 ${table} 不存在或无权限访问: ${error.message}`);
        } else {
          console.log(`✅ 表 ${table} 结构正常`);
        }
      } catch (e) {
        console.log(`❌ 表 ${table} 测试失败:`, e.message);
      }
    }

    // 6. 测试视图
    console.log('\n6️⃣ 测试数据视图...');
    const views = ['trail_details', 'user_stats', 'post_details'];
    
    for (const view of views) {
      try {
        const { data, error } = await supabase
          .from(view)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ 视图 ${view} 不存在: ${error.message}`);
        } else {
          console.log(`✅ 视图 ${view} 正常`);
        }
      } catch (e) {
        console.log(`❌ 视图 ${view} 测试失败:`, e.message);
      }
    }

    console.log('\n🎉 数据库测试完成！');
    console.log('\n📋 下一步操作建议:');
    console.log('1. 如果有表不存在，请在Supabase SQL编辑器中执行 database_schema.sql');
    console.log('2. 如果权限有问题，请执行 database_security.sql');
    console.log('3. 如果需要存储功能，请执行 storage_setup.sql');
    console.log('4. 在应用中开始使用认证和数据操作功能');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 如果直接运行此脚本
testDatabaseConnection(); 