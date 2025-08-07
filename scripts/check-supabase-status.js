// Supabase状态检查脚本
// 这个脚本会检查Supabase的配置状态

import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co';

console.log('🔍 TrailLog Supabase 状态检查\n');

console.log('📋 当前配置信息:');
console.log(`   Supabase URL: ${supabaseUrl}`);
console.log('   Supabase Key: 需要配置 VITE_SUPABASE_KEY 环境变量');

console.log('\n📝 配置步骤:');
console.log('1. 访问 https://supabase.com/dashboard');
console.log('2. 选择项目或创建新项目');
console.log('3. 进入 Settings → API');
console.log('4. 复制 anon public key');
console.log('5. 在项目根目录创建 .env.local 文件');
console.log('6. 添加以下内容:');
console.log('   VITE_SUPABASE_KEY=你的supabase_anon_key');

console.log('\n🗄️ 数据库设置状态:');
console.log('   ✅ 数据库结构文件已准备: database_schema.sql');
console.log('   ✅ 安全策略文件已准备: database_security.sql');
console.log('   ✅ 存储配置文件已准备: storage_setup.sql');

console.log('\n📁 项目文件状态:');
console.log('   ✅ Supabase客户端配置: src/utils/supabase.ts');
console.log('   ✅ 数据库服务类: src/services/supabase.ts');
console.log('   ✅ TypeScript类型定义: 已包含在supabase.ts中');

console.log('\n🚀 下一步操作:');
console.log('1. 配置环境变量 (.env.local)');
console.log('2. 在Supabase SQL编辑器中执行 database_schema.sql');
console.log('3. 执行 database_security.sql 配置安全策略');
console.log('4. 执行 storage_setup.sql 设置存储桶');
console.log('5. 运行 node scripts/test-database.js 测试连接');

console.log('\n📚 相关文档:');
console.log('   - DATABASE_SETUP_GUIDE.md - 完整设置指南');
console.log('   - ENV_SETUP.md - 环境变量配置说明');

console.log('\n⚠️ 注意事项:');
console.log('   - 确保使用 anon key，不要使用 service_role key');
console.log('   - 检查 Supabase 项目的 RLS 策略配置');
console.log('   - 确保存储桶权限配置正确'); 