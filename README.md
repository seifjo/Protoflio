# Seif Kamel — Portfolio CMS

## Vercel deploy (fix build error)

Your build failed because **`DATABASE_URL` is missing** on Vercel. SQLite does not work on Vercel — you need **PostgreSQL**.

### Step 1 — Create a free database (2 minutes)

1. Go to **[neon.tech](https://neon.tech)** → Sign up free
2. Create a project → copy the **connection string**
   - It looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### Step 2 — Add environment variables in Vercel

1. Open your project on **[vercel.com](https://vercel.com)**
2. Go to **Settings → Environment Variables**
3. Add these (for **Production**, **Preview**, and **Development**):

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `AUTH_SECRET` | Any long random string (32+ chars) |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Your admin password |
| `ADMIN_NAME` | Seif Kamel |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-APP.vercel.app` |

### Step 3 — Enable file uploads (optional but recommended)

1. Vercel project → **Storage** → **Create** → **Blob**
2. Connect to your project (auto-adds `BLOB_READ_WRITE_TOKEN`)
3. Redeploy

### Step 4 — Redeploy

1. Go to **Deployments** → click **⋯** on the failed deploy → **Redeploy**
   - Or push a new commit to GitHub

After deploy:
- **Site:** `https://your-app.vercel.app`
- **Admin:** `https://your-app.vercel.app/admin`

---

## Local development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL (use same Neon URL)
npm run setup
npm run dev
```

Use the **same Neon database** for local dev, or create a separate Neon branch for local.

### Default admin login (after seed)

| Field | Value |
|-------|-------|
| Email | `admin@localhost` |
| Password | `ChangeMe123!` |

Change in `.env` before deploying.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run setup` | DB push + seed |
| `npm run vercel-build` | Vercel production build |
