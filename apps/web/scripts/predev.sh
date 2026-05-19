#!/usr/bin/env bash
set -euo pipefail

pnpm exec tsx scripts/lib/symlink.ts node_modules/@repo/chart-preview/dist public/chart-preview

pnpm run db:generate
pnpm run db:generate:internal
pnpm run db:seed
