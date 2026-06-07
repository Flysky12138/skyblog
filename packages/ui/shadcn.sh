#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")" || exit

# 获取 src/components 下所有组件名（不含路径和扩展名）
components=$(find ./src/components -type f -name "*.tsx" -maxdepth 1 -exec basename {} .tsx \; | sort)

if [ -z "$components" ]; then
  echo "未找到组件文件"
  exit 1
fi

echo "组件列表:"
echo "$components"
echo ""

# 批量执行 shadcn add
# 将换行符替换为空格，一次性传入所有组件名
all_components=$(echo "$components" | tr '\n' ' ')
echo "▶ 批量添加组件: $all_components"
pnpm exec shadcn add -y -o $all_components

echo "▶ 替换组件中的 /components-override/ 为 /components/"
find ./src/components -type f -name "*.tsx" -exec sed -i '' 's|components-override|components|g' {} +

echo "✅ 所有组件已添加完成"
