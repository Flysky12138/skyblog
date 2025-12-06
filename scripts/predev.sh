#!/usr/bin/env bash
set -euo pipefail

pnpm run db:generate
pnpm run db:generate:internal

pnpm run db:seed
