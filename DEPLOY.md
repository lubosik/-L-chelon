# L'Échelon — Deployment Guide (Hostinger VPS)

## Prerequisites
- Ubuntu VPS (KVM 2+)
- Node.js 20+ installed
- PostgreSQL installed and running
- PM2 installed globally (`npm i -g pm2`)
- Nginx installed
- Certbot installed

---

## 1. PostgreSQL Setup

```bash
sudo -u postgres psql -c "CREATE DATABASE lechelon;"
sudo -u postgres psql -c "CREATE USER lechelon_user WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lechelon TO lechelon_user;"
```

Update `lechelon-cms/.env`:
```
DATABASE_USERNAME=lechelon_user
DATABASE_PASSWORD=yourpassword
```

---

## 2. Build Strapi CMS

```bash
cd /root/projects/lechelon-cms
npm install
NODE_ENV=production npm run build
```

---

## 3. Build Next.js

Fill in all values in `lechelon/.env.local`, then:
```bash
cd /root/projects/lechelon
npm install
npm run build
```

---

## 4. Start with PM2

```bash
cd /root/projects/lechelon
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed command
```

Check processes:
```bash
pm2 list
pm2 logs lechelon
pm2 logs lechelon-cms
```

---

## 5. Nginx + SSL

```bash
# Copy config
sudo cp /root/projects/lechelon/nginx.lechelon.conf /etc/nginx/sites-available/lechelon
sudo ln -s /etc/nginx/sites-available/lechelon /etc/nginx/sites-enabled/lechelon

# Get SSL certificates (DNS must point to this VPS first)
sudo certbot --nginx -d lechelon.com -d www.lechelon.com
sudo certbot --nginx -d cms.lechelon.com

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. Strapi First Run

1. Go to https://cms.lechelon.com/admin
2. Create your admin account
3. Go to Settings → API Tokens → Create token (Full access)
4. Copy the token into `lechelon/.env.local` as `STRAPI_API_TOKEN`
5. Rebuild Next.js: `npm run build && pm2 restart lechelon`

---

## 7. Environment Variables

### lechelon/.env.local (production values)
```
NEXT_PUBLIC_STRAPI_URL=https://cms.lechelon.com
STRAPI_API_TOKEN=<from Strapi admin>
RESEND_API_KEY=<from resend.com>
RESEND_AUDIENCE_ID=<from resend.com>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from clerk.com>
CLERK_SECRET_KEY=<from clerk.com>
STRIPE_SECRET_KEY=<from stripe.com>
STRIPE_WEBHOOK_SECRET=<from stripe dashboard>
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=<your $12/mo price ID>
NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL=<your $99/yr price ID>
```

---

## 8. Stripe Webhook

In Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://lechelon.com/api/webhook`
- Events: `checkout.session.completed`, `customer.subscription.deleted`

---

## 9. Hero Videos

Drop MP4 files into `/root/projects/lechelon/public/heroes/`:
- `default.mp4`
- `la-mode.mp4`
- `la-vitesse.mp4`
- `lhorlogerie.mp4`
- `lequitation.mp4`
- `lart-de-vivre.mp4`
- Plus `-mob.mp4` variants for each

Specs: H.264, 16:9, max 12MB, 8s loopable, no audio.

---

## Ongoing: Deploying updates

```bash
cd /root/projects/lechelon
git pull
npm run build
pm2 restart lechelon

# For CMS updates:
cd /root/projects/lechelon-cms
git pull
npm run build
pm2 restart lechelon-cms
```
