#!/usr/bin/env bash
# One-time provisioning for a fresh Ubuntu droplet. Run as root: sudo bash deploy/setup.sh
set -euo pipefail

DOMAIN="iwi.golf"
REPO_URL="git@github.com:huntermelrose831/iwi-golf.git"
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
  cat > .env <<EOF
STRIPE_SECRET_KEY=sk_live_replace_with_secret_key
CLIENT_URL=https://$DOMAIN
PORT=4242
STRIPE_CURRENCY=usd
STRIPE_UNIT_AMOUNT=24900
STRIPE_WEBHOOK_SECRET=whsec_replace_with_live_webhook_secret
ORDER_NOTIFICATION_EMAIL=huntermelrose831@gmail.com
SENDER_EMAIL=admin@iwi.golf
MS_TENANT_ID=replace_with_microsoft_tenant_id
MS_CLIENT_ID=replace_with_app_client_id
MS_CLIENT_SECRET=replace_with_new_app_client_secret
MS_REFRESH_TOKEN=replace_with_new_delegated_refresh_token
SITE_GATE_PASSWORD=replace_with_a_strong_shared_password
SITE_GATE_SECRET=replace_with_a_long_random_string
EOF
  chmod 600 .env
  echo ">>> IMPORTANT: replace every *_replace_* value in $APP_DIR/server/.env before going live. Never commit this file."
fi

echo "==> Starting API with pm2"
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root | tail -n 1 || true

echo "==> Configuring Nginx"
mkdir -p /etc/nginx/snippets
cp "$APP_DIR/deploy/security-headers.conf" /etc/nginx/snippets/security-headers.conf
cp "$APP_DIR/deploy/nginx.iwi.golf.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

echo ""
echo "==> Setup complete. Next steps:"
echo "1. Edit $APP_DIR/server/.env with the client's live Stripe and Microsoft Graph credentials, then: pm2 restart iwi-golf-api"
echo "2. Once iwi.golf's DNS points at this droplet, run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
