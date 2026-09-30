#!/usr/bin/env bash
# One-time provisioning for a fresh Ubuntu droplet. Run as root: sudo bash deploy/setup.sh
set -euo pipefail

DOMAIN="iwi.golf"
REPO_URL="https://github.com/huntermelrose831/iwi-golf.git"
APP_DIR="/var/www/iwi-golf"

echo "==> Installing Nginx, Node.js, pm2, certbot"
apt update
apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
apt install -y certbot python3-certbot-nginx

echo "==> Fetching the app"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> Building client"
cd "$APP_DIR"

if [ ! -f .env ]; then
  cat > .env <<'EOF'
VITE_API_BASE_URL=
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
EOF
  echo ">>> IMPORTANT: edit $APP_DIR/.env with your real VITE_STRIPE_PUBLISHABLE_KEY, then rerun 'npm run build' in $APP_DIR"
fi

npm ci
npm run build

echo "==> Installing server deps"
cd "$APP_DIR/server"
npm ci

if [ ! -f .env ]; then
  cp .env.example .env
  echo ">>> IMPORTANT: edit $APP_DIR/server/.env with your real STRIPE_SECRET_KEY and CLIENT_URL=https://$DOMAIN"
fi

echo "==> Starting API with pm2"
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 || true

echo "==> Configuring Nginx"
cp "$APP_DIR/deploy/nginx.iwi.golf.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

echo ""
echo "==> Setup complete. Next steps:"
echo "1. Edit $APP_DIR/server/.env with your real Stripe secret key, then: pm2 restart iwi-golf-api"
echo "2. Once iwi.golf's DNS points at this droplet, run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
