#!/bin/bash

echo "🧪 测试 @zy 系列包"
echo "=================="

# 测试 ESLint 配置
echo "📝 测试 ESLint 配置包..."
echo "import config from '@zy/eslint-config';" > /tmp/test-eslint.js
echo "console.log('ESLint 基础配置:', Object.keys(config));" >> /tmp/test-eslint.js
node /tmp/test-eslint.js
echo "✅ ESLint 配置包测试完成"
echo ""

# 测试 Prettier 配置
echo "🎨 测试 Prettier 配置包..."
echo "import config from '@zy/prettier-config';" > /tmp/test-prettier.js
echo "console.log('Prettier 配置:', config);" >> /tmp/test-prettier.js
node /tmp/test-prettier.js
echo "✅ Prettier 配置包测试完成"
echo ""

# 测试 Commitizen 适配器
echo "📝 测试 Commitizen 适配器包..."
echo "import adapter from '@zy/commitizen-adapter';" > /tmp/test-cz.js
echo "console.log('Commitizen 适配器:', typeof adapter);" >> /tmp/test-cz.js
node /tmp/test-cz.js
echo "✅ Commitizen 适配器包测试完成"
echo ""

echo "🎉 所有包测试完成！"

# 清理临时文件
rm -f /tmp/test-*.js 