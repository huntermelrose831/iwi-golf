# IWI.golf

Turn a hole-in-one into a 3D printed model of the green, fringe, bunkers, and water that
didn't catch the ball. React + TypeScript (Vite) frontend, Node/Express backend, Stripe
for embedded checkout.

## Project structure

- `src/` — React app (components grouped with their own CSS, BEM class names)
- `server/` — Express API that creates Stripe PaymentIntents (keeps the secret key off the client)
- `deploy/` — Nginx config for production

## Local development

**Client**

```
npm install
npm run dev
```

Needs a `.env` (copy `.env.example`):

```
VITE_API_BASE_URL=http://localhost:4242
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Server**

```
cd server
npm install
npm run dev
```

Needs a `server/.env` (copy `server/.env.example`):

```
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
PORT=4242
STRIPE_CURRENCY=usd
STRIPE_UNIT_AMOUNT=24900
```

## Deploying to a DigitalOcean droplet + GoDaddy DNS

This runs the built client and the API on one droplet: Nginx serves the static site and
reverse-proxies `/api/*` to the Node process (kept alive with pm2).

### 1. Create the droplet

- Ubuntu 24.04 LTS, Basic plan (1–2 GB RAM is plenty for this site).
- Note the droplet's public IPv4 address.

### 2. Point DNS at GoDaddy

In GoDaddy's DNS management for `iwi.golf`, **delete** whatever A/CNAME records the old
website builder created, then add:

| Type | Name | Value              |
| ---- | ---- | ------------------ |
| A    | @    | `<droplet IP>`      |
| A    | www  | `<droplet IP>`      |

DNS propagation is usually fast but can take up to ~24 hours.

### 3. Set up the server

SSH into the droplet, then:

```
sudo apt update && sudo apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
sudo npm install -g certbot python3-certbot-nginx  # or: sudo apt install certbot python3-certbot-nginx

git clone https://github.com/huntermelrose831/iwi-golf.git /var/www/iwi-golf
cd /var/www/iwi-golf
npm ci
npm run build          # produces dist/

cd server
npm ci
cp .env.example .env   # then edit .env with the real STRIPE_SECRET_KEY and CLIENT_URL=https://iwi.golf
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # follow the printed instructions to enable pm2 on boot
```

### 4. Configure Nginx

```
sudo cp /var/www/iwi-golf/deploy/nginx.iwi.golf.conf /etc/nginx/sites-available/iwi.golf
sudo ln -s /etc/nginx/sites-available/iwi.golf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Enable HTTPS

```
sudo certbot --nginx -d iwi.golf -d www.iwi.golf
```

Certbot edits the Nginx config to add the SSL block and sets up auto-renewal.

### 6. Update the client's API URL for production

Since Nginx proxies `/api/*` on the same domain, set `VITE_API_BASE_URL=` (empty) in the
client's production `.env` before running `npm run build`, so requests go to the same
origin instead of `localhost:4242`.

### 7. Stripe: register the domain for Apple Pay

Stripe Dashboard → **Settings → Payment methods → Apple Pay → Add a new domain** → `iwi.golf`.

### Redeploying after changes

```
cd /var/www/iwi-golf
git pull
npm ci && npm run build
cd server && npm ci && pm2 restart iwi-golf-api
```
