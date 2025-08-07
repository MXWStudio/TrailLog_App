// 数据库初始化脚本
// 这个脚本会帮助用户在Supabase中设置数据库表

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// Supabase配置
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

console.log('🗄️ TrailLog 数据库初始化脚本\n');

if (!supabaseKey) {
  console.error('❌ 错误：VITE_SUPABASE_KEY 环境变量未配置');
  console.log('请检查 .env.local 文件是否正确配置了 VITE_SUPABASE_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  try {
    console.log('🔍 检查数据库状态...');
    
    // 尝试查询users表
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ 数据库表未创建');
        return false;
      } else {
        console.error('❌ 数据库连接错误:', error.message);
        return false;
      }
    }
    
    console.log('✅ 数据库表已存在');
    return true;
  } catch (error) {
    console.error('❌ 检查数据库状态时发生错误:', error.message);
    return false;
  }
}

function readSqlFile(filename) {
  try {
    const filePath = path.join(process.cwd(), filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ 无法读取文件 ${filename}:`, error.message);
    return null;
  }
}

async function executeSqlScript(scriptName, sqlContent) {
  console.log(`\n📝 执行 ${scriptName}...`);
  console.log('⚠️  注意：这个脚本需要在Supabase SQL编辑器中手动执行');
  console.log('   请按照以下步骤操作：\n');
  
  console.log('1. 访问 Supabase Dashboard');
  console.log('2. 进入你的项目');
  console.log('3. 点击左侧菜单的 "SQL Editor"');
  console.log('4. 创建新的查询');
  console.log('5. 复制以下SQL内容并粘贴到编辑器中：\n');
  
  console.log('='.repeat(50));
  console.log(sqlContent);
  console.log('='.repeat(50));
  
  console.log('\n6. 点击 "Run" 执行SQL');
  console.log('7. 等待执行完成');
  
  return true;
}

async function main() {
  console.log('🚀 开始数据库初始化...\n');
  
  // 检查数据库状态
  const tablesExist = await checkDatabaseStatus();
  
  if (tablesExist) {
    console.log('\n✅ 数据库已经初始化完成！');
    console.log('你可以开始使用应用了。');
    return;
  }
  
  console.log('\n📋 需要执行的SQL脚本：');
  console.log('1. database_schema.sql - 创建数据库表结构');
  console.log('2. database_security.sql - 配置安全策略');
  console.log('3. storage_setup.sql - 设置存储桶（可选）\n');
  
  // 读取SQL文件
  const schemaSql = readSqlFile('database_schema.sql');
  const securitySql = readSqlFile('database_security.sql');
  const storageSql = readSqlFile('storage_setup.sql');
  
  if (!schemaSql) {
    console.error('❌ 无法读取 database_schema.sql 文件');
    return;
  }
  
  console.log('📝 第一步：创建数据库表结构');
  await executeSqlScript('database_schema.sql', schemaSql);
  
  if (securitySql) {
    console.log('\n📝 第二步：配置安全策略');
    await executeSqlScript('database_security.sql', securitySql);
  }
  
  if (storageSql) {
    console.log('\n📝 第三步：设置存储桶（可选）');
    await executeSqlScript('storage_setup.sql', storageSql);
  }
  
  console.log('\n🎯 执行完成后，请运行以下命令测试：');
  console.log('   node scripts/test-database.js');
  
  console.log('\n📚 更多信息请查看：');
  console.log('   - DATABASE_SETUP_GUIDE.md - 完整设置指南');
  console.log('   - ENV_SETUP.md - 环境变量配置说明');
}

main().catch(console.error); 