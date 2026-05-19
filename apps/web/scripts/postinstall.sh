#!/usr/bin/env bash
set -euo pipefail

# Disable Next.js telemetry
pnpm exec next telemetry disable

# Copy ECharts type definitions
printf '\n'
TARGET="public/echarts.d.ts"
SOURCE="$(find -L node_modules -path '*/echarts/types/dist/echarts.d.ts' | head -n 1)"
if [ -n "$SOURCE" ] && [ -f "$SOURCE" ]; then
  cp "$SOURCE" "$TARGET"
  printf '\033[32m✔ Copied:\033[0m %s -> %s\n' "$SOURCE" "$TARGET"
else
  printf '\033[31m✖ File not found:\033[0m echarts.d.ts\n'
  exit 1
fi
