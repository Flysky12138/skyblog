#!/usr/bin/env bash
set -euo pipefail

pnpm exec tsx scripts/cli/cp.ts node_modules/@repo/chart-preview/dist/ public/chart-preview/

pnpm run db:generate
pnpm run db:generate:internal
pnpm run db:deploy
pnpm run db:seed
