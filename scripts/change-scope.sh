#!/bin/bash

# 批量更改 npm scope 名称的脚本

OLD_SCOPE="@bestzy"
NEW_SCOPE="$1"

if [ -z "$NEW_SCOPE" ]; then
    echo "❌ 使用方法: $0 <new-scope>"
    echo "   示例: $0 @your-name"
    exit 1
fi

echo "🔄 将 $OLD_SCOPE 更改为 $NEW_SCOPE"
echo "================================="

# 1. 更新根目录 package.json
echo "📝 更新根目录 package.json..."
sed -i '' "s|$OLD_SCOPE|$NEW_SCOPE|g" package.json

# 2. 更新各个包的 package.json
echo "📝 更新包配置文件..."
for package_dir in packages/*/; do
    if [ -f "$package_dir/package.json" ]; then
        echo "   - $package_dir"
        sed -i '' "s|$OLD_SCOPE|$NEW_SCOPE|g" "$package_dir/package.json"
    fi
done

# 3. 更新源代码中的引用
echo "📝 更新源代码引用..."
find packages/ -name "*.ts" -o -name "*.js" | while read file; do
    if grep -q "$OLD_SCOPE" "$file"; then
        echo "   - $file"
        sed -i '' "s|$OLD_SCOPE|$NEW_SCOPE|g" "$file"
    fi
done

# 4. 更新示例文件
echo "📝 更新示例文件..."
if [ -d "examples" ]; then
    find examples/ -name "*.json" -o -name "*.js" -o -name "*.cjs" | while read file; do
        if grep -q "$OLD_SCOPE" "$file"; then
            echo "   - $file"
            sed -i '' "s|$OLD_SCOPE|$NEW_SCOPE|g" "$file"
        fi
    done
fi

# 5. 更新文档
echo "📝 更新文档..."
find . -name "*.md" | while read file; do
    if grep -q "$OLD_SCOPE" "$file"; then
        echo "   - $file"
        sed -i '' "s|$OLD_SCOPE|$NEW_SCOPE|g" "$file"
    fi
done

echo ""
echo "✅ 完成！scope 已从 $OLD_SCOPE 更改为 $NEW_SCOPE"
echo ""
echo "🔧 接下来的步骤:"
echo "1. 检查更改: git diff"
echo "2. 重新构建: pnpm build"
echo "3. 测试发布: pnpm publish -r --dry-run"
echo "4. 正式发布: pnpm publish -r" 