#!/usr/bin/env bash
set -euo pipefail

rm -rf public/chart-preview
cp -a node_modules/@repo/chart-preview/dist/. public/chart-preview/

pnpm run db:generate
pnpm run db:generate:internal
pnpm run db:deploy
pnpm run db:seed
