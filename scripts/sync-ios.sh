#!/bin/bash

# TrailLog iOS 同步脚本
# 用于快速同步 Web 项目到 iOS

echo "🚀 开始同步 TrailLog 到 iOS..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到 npm，请先安装 npm"
    exit 1
fi

# 检查 Capacitor CLI
if ! command -v npx &> /dev/null; then
    echo "❌ 错误：未找到 npx，请先安装 Node.js"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "🔄 同步到 iOS..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo "❌ iOS 同步失败，请检查错误信息"
    exit 1
fi

echo "✅ iOS 同步完成！"
echo ""
echo "📱 下一步操作："
echo "1. 运行 'npx cap open ios' 打开 Xcode 项目"
echo "2. 在 Xcode 中选择目标设备（模拟器或真机）"
echo "3. 点击运行按钮 (⌘+R) 启动应用"
echo ""
echo "🔧 如需调试："
echo "- Web 调试：在 Safari 中打开 http://localhost:8100"
echo "- 原生调试：在 Xcode 中使用断点和日志"
echo ""
echo "📚 更多信息请查看："
echo "- ios/README.md - iOS 项目详细说明"
echo "- README.md - 项目整体说明" 