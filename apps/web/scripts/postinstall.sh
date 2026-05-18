#!/usr/bin/env bash
set -euo pipefail

# Disable Next.js telemetry
pnpm exec next telemetry disable

# Copy ECharts type definitions
SOURCE="node_modules/@repo/chart-preview/node_modules/echarts/types/dist/echarts.d.ts"
TARGET="public/echarts.d.ts"

mkdir -p "$(dirname "$TARGET")"

echo " "

if [ -f "$SOURCE" ]; then
  cp "$SOURCE" "$TARGET"
  echo "Copied: $TARGET"
else
  echo "File not found: $SOURCE"
  exit 1
fi
