#!/usr/bin/env bash
set -euo pipefail

# Disable Next.js telemetry
pnpm exec next telemetry disable

# Copy ECharts type definitions
pnpm exec tsx scripts/cli/cp.ts node_modules/@repo/chart-preview/node_modules/echarts/types/dist/echarts.d.ts public/echarts.d.ts
