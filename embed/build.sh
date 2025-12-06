#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

pnpm dlx vite build --config ./vite.config.ts
