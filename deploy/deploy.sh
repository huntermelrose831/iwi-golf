#!/usr/bin/env bash
# Run this on the droplet after pushing new commits: sudo bash deploy/deploy.sh
set -euo pipefail

APP_DIR="/var/www/iwi-golf"

cd "$APP_DIR"
git pull
npm ci
npm run build

cd "$APP_DIR/server"
npm ci
pm2 restart iwi-golf-api --update-env
