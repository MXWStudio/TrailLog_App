import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 配置环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

// 检查环境变量
const supabaseUrl = 'https://hklkdmochyykuyrwjbhy.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY

if (!supabaseKey) {
  console.error('❌ 错误：缺少 VITE_SUPABASE_KEY 环境变量')
  console.log('请在 .env.local 文件中配置你的 Supabase anon key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRegistrationSetup() {
  console.log('🔍 检查 TrailLog 注册功能配置...\n')
  
  try {
    // 1. 检查数据库连接
    console.log('1️⃣ 检查数据库连接...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.log('❌ 数据库连接失败:', error.message)
      console.log('\n📋 解决方案:')
      console.log('1. 确保已执行 database_schema.sql 创建表结构')
      console.log('2. 检查 Supabase 项目配置')
      console.log('3. 确认环境变量 VITE_SUPABASE_KEY 正确')
      return false
    }
    
    console.log('✅ 数据库连接正常')
    
    // 2. 检查 users 表结构
    console.log('\n2️⃣ 检查 users 表结构...')
    try {
      const { data: users, error: tableError } = await supabase
        .from('users')
        .select('*')
        .limit(1)
      
      if (tableError) {
        console.log('❌ users 表访问失败:', tableError.message)
        console.log('这可能是因为:')
        console.log('- 表不存在')
        console.log('- 权限配置问题')
        console.log('- RLS 策略限制')
        return false
      }
      
      console.log('✅ users 表结构正常')
      
      // 3. 检查表字段
      if (users && users.length > 0) {
        const sampleUser = users[0]
        console.log('📊 示例用户数据结构:')
        console.log('- id:', typeof sampleUser.id, sampleUser.id)
        console.log('- email:', typeof sampleUser.email, sampleUser.email)
        console.log('- username:', typeof sampleUser.username, sampleUser.username)
        console.log('- created_at:', typeof sampleUser.created_at, sampleUser.created_at)
      }
      
    } catch (err) {
      console.log('❌ users 表检查异常:', err.message)
      return false
    }
    
    // 4. 检查认证配置
    console.log('\n3️⃣ 检查认证配置...')
    try {
      // 尝试获取当前会话（不需要实际登录）
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        console.log('⚠️ 认证配置检查:', authError.message)
        console.log('这可能是正常的，因为当前没有登录会话')
      } else {
        console.log('✅ 认证配置正常')
      }
      
    } catch (err) {
      console.log('⚠️ 认证配置检查异常:', err.message)
    }
    
    // 5. 提供注册测试建议
    console.log('\n4️⃣ 注册功能测试建议...')
    console.log('✅ 数据库配置看起来正常')
    console.log('\n📝 现在可以测试注册功能:')
    console.log('1. 启动开发服务器: npm run dev')
    console.log('2. 访问注册页面')
    console.log('3. 使用真实邮箱地址进行注册测试')
    console.log('4. 检查邮箱验证链接')
    
    console.log('\n⚠️ 注意事项:')
    console.log('- 确保使用有效的邮箱地址')
    console.log('- 密码长度至少6位')
    console.log('- 注册后需要邮箱验证')
    console.log('- 如果遇到错误，请检查浏览器控制台')
    
    return true
    
  } catch (error) {
    console.error('❌ 注册功能检查失败:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 TrailLog 注册功能检查\n')
  
  const result = await checkRegistrationSetup()
  
  if (result) {
    console.log('\n🎉 注册功能配置检查完成！')
    console.log('数据库和认证系统已正确配置，可以开始测试注册功能。')
  } else {
    console.log('\n❌ 注册功能配置存在问题')
    console.log('请按照上述建议解决配置问题后再测试注册功能。')
  }
}

main().catch(console.error) 