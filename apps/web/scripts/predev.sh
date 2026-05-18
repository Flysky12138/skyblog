#!/usr/bin/env bash
set -euo pipefail

rm -rf public/chart-preview
ln -s "$(realpath node_modules/@repo/chart-preview/dist)" public/chart-preview

pnpm run db:generate
pnpm run db:generate:internal
pnpm run db:seed
