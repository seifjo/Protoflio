# Seif Kamel — Portfolio CMS

A production-ready Flutter developer portfolio with a built-in Admin Dashboard. All projects, images, skills, and site content are managed from `/admin` — no source code edits required.

## Quick start (local)

1. Create a free [Neon](https://neon.tech) PostgreSQL database
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`
3. Run:

```bash
npm install
npm run setup
npm run dev
```

- **Public site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

### Default admin login

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@localhost`  |
| Password | `ChangeMe123!`     |

Change these in `.env` before deploying.

## Deploy to Vercel (share with others)

### 1. Push to GitHub

```bash
git add .
git commit -m "Portfolio CMS ready for deploy"
git remote add origin https://github.com/YOUR_USERNAME/seif-portfolio.git
git push -u origin main
```

### 2. Create Neon database

1. Go to [neon.tech](https://neon.tech) → create a free project
2. Copy the **connection string** (PostgreSQL)

### 3. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random string (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password |
| `ADMIN_NAME` | Seif Kamel |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-APP.vercel.app` (set after first deploy) |

4. Click **Deploy**

### 4. Enable file uploads (Vercel Blob)

1. In your Vercel project → **Storage** → **Create Database** → **Blob**
2. Connect it to your project — this auto-sets `BLOB_READ_WRITE_TOKEN`
3. Redeploy

Without Blob, uploads work locally but not on Vercel.

### 5. Update site URL

After deploy, set `NEXT_PUBLIC_SITE_URL` to your live URL (e.g. `https://seif-portfolio.vercel.app`) and redeploy.

## What you can do from Admin

1. Log in at `/admin`
2. **Add Project** → fill all 12 sections
3. Upload cover + screenshots (drag & drop, reorder, set cover)
4. Add technologies, features, APK, video, live demo, GitHub, PDF
5. Configure SEO + QR code
6. **Save Draft** or **Publish**
7. Project appears on Home, Work, and its case study page automatically

## Tech stack

- **Next.js 16** (App Router)
- **Prisma + PostgreSQL** (Neon)
- **Vercel Blob** (production file storage)
- **JWT auth** (jose + bcrypt)
- **Sharp** image optimization
- **Tailwind CSS 4**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run setup` | DB push + seed |
| `npm run db:seed` | Re-seed database |
| `npm run db:studio` | Open Prisma Studio |

## Seeded projects

1. Restaurant Management System *(published, featured)*
2. BiteGo *(draft)*
3. Clinic App *(draft)*
4. Robot Control App *(draft)*
5. Expense Tracker *(draft)*

Edit all content from the admin dashboard.
