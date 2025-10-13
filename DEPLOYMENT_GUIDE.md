# 🚀 VibeSync Deployment Guide

Complete guide to deploy VibeSync backend and prepare for app store submission.

---

## 📋 Prerequisites

- [ ] Node.js 18+ or Bun installed
- [ ] PostgreSQL database (local or cloud)
- [ ] Git repository
- [ ] Domain name (optional but recommended)

---

## 🗄️ Database Setup

### Option 1: Neon (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)
5. Run the schema:
   ```bash
   psql "your-connection-string" < backend/db/schema.sql
   ```

### Option 2: Supabase (Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Run the schema in the SQL Editor

### Option 3: Railway (Paid)

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string from variables
5. Connect and run schema

---

## 🌐 Backend Deployment

### Option 1: Vercel (Recommended for Serverless)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Configure Environment Variables
Create a `.env.production` file:
```env
DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

#### Step 4: Deploy
```bash
vercel --prod
```

#### Step 5: Set Environment Variables in Vercel Dashboard
1. Go to your project on [vercel.com](https://vercel.com)
2. Go to Settings → Environment Variables
3. Add:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `JWT_SECRET` = a secure random string (use: `openssl rand -base64 32`)
   - `NODE_ENV` = production

#### Step 6: Get Your Backend URL
After deployment, Vercel will give you a URL like:
```
https://vibesync.vercel.app
```

Save this URL - you'll need it for the mobile app!

---

### Option 2: Railway (Recommended for Full Control)

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login
```bash
railway login
```

#### Step 3: Initialize Project
```bash
railway init
```

#### Step 4: Add PostgreSQL
```bash
railway add postgresql
```

#### Step 5: Set Environment Variables
```bash
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set NODE_ENV=production
```

#### Step 6: Deploy
```bash
railway up
```

#### Step 7: Get Your Backend URL
```bash
railway domain
```

This will give you a URL like:
```
https://vibesync-production.up.railway.app
```

---

### Option 3: Render (Free Tier Available)

#### Step 1: Create Account
Go to [render.com](https://render.com) and sign up

#### Step 2: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Choose free tier
3. Copy the Internal Database URL

#### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your Git repository
3. Configure:
   - **Build Command**: `bun install`
   - **Start Command**: `bun run backend/hono.ts`
   - **Environment**: Node

#### Step 4: Add Environment Variables
- `DATABASE_URL` = your PostgreSQL URL
- `JWT_SECRET` = secure random string
- `NODE_ENV` = production

#### Step 5: Deploy
Click "Create Web Service" and wait for deployment

---

## 📱 Update Mobile App Configuration

### Step 1: Update .env File
```env
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

Replace `your-backend-url.com` with your actual backend URL from deployment.

### Step 2: Test Backend Connection
```bash
curl https://your-backend-url.com/health
```

Should return:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2025-01-07T..."
}
```

### Step 3: Test from Mobile App
1. Start the app: `bun start`
2. Try to register/login
3. Check if API calls work

---

## 🌍 Host Privacy Policy & Terms

### Option 1: GitHub Pages (Free & Easy)

#### Step 1: Enable GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: /docs
6. Click Save

#### Step 2: Access Your Pages
Your pages will be available at:
```
https://yourusername.github.io/vibesync/
https://yourusername.github.io/vibesync/privacy.html
https://yourusername.github.io/vibesync/terms.html
https://yourusername.github.io/vibesync/support.html
```

#### Step 3: Update app.json
Add these URLs to your `app.json`:
```json
{
  "extra": {
    "privacyPolicyUrl": "https://yourusername.github.io/vibesync/privacy.html",
    "termsOfServiceUrl": "https://yourusername.github.io/vibesync/terms.html",
    "supportUrl": "https://yourusername.github.io/vibesync/support.html"
  }
}
```

### Option 2: Vercel (Custom Domain)

#### Step 1: Deploy docs folder
```bash
cd docs
vercel --prod
```

#### Step 2: Add Custom Domain (Optional)
1. Go to Vercel dashboard
2. Settings → Domains
3. Add: `vibesync.app` or `www.vibesync.app`
4. Follow DNS configuration instructions

Your URLs will be:
```
https://vibesync.app/privacy.html
https://vibesync.app/terms.html
https://vibesync.app/support.html
```

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Set up CORS properly (already configured in backend/hono.ts)
- [ ] Use strong database password
- [ ] Enable database connection pooling
- [ ] Set up database backups
- [ ] Review privacy policy and terms
- [ ] Test all API endpoints

---

## 🧪 Testing Deployment

### Test Backend Health
```bash
curl https://your-backend-url.com/health
```

### Test Registration
```bash
curl -X POST https://your-backend-url.com/api/trpc/auth.register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "username": "testuser"
  }'
```

### Test Login
```bash
curl -X POST https://your-backend-url.com/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

## 📊 Monitoring & Analytics

### Set Up Error Tracking (Optional)

#### Sentry
1. Go to [sentry.io](https://sentry.io)
2. Create a new project
3. Get DSN
4. Add to environment variables:
   ```env
   SENTRY_DSN=your-sentry-dsn
   ```

### Set Up Uptime Monitoring (Optional)

#### UptimeRobot (Free)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor for your backend URL
3. Set up email alerts

---

## 🚨 Troubleshooting

### Backend Not Starting
- Check environment variables are set correctly
- Verify DATABASE_URL is valid
- Check logs: `vercel logs` or `railway logs`

### Database Connection Failed
- Verify connection string format
- Check if database is running
- Ensure IP whitelist includes your backend (if applicable)
- Test connection: `psql "your-connection-string"`

### CORS Errors
- Backend already has CORS configured for `*`
- If you need to restrict, update `backend/hono.ts`

### 404 on API Routes
- Verify deployment was successful
- Check vercel.json routes configuration
- Test root endpoint: `curl https://your-backend-url.com/`

---

## 📝 Environment Variables Reference

### Required
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
```

### Optional
```env
REDIS_URL=redis://localhost:6379
SENTRY_DSN=https://...@sentry.io/...
PORT=3000
```

---

## 🎯 Next Steps After Deployment

1. ✅ Backend deployed and accessible
2. ✅ Database running and schema applied
3. ✅ Privacy policy and terms hosted
4. ⬜ Update app.json with URLs
5. ⬜ Create app store assets (screenshots, icons)
6. ⬜ Set up developer accounts (Apple, Google)
7. ⬜ Create production builds
8. ⬜ Submit to app stores

---

## 💰 Cost Estimates

### Free Tier (Recommended for Launch)
- **Database**: Neon or Supabase (Free)
- **Backend**: Vercel or Render (Free)
- **Hosting**: GitHub Pages (Free)
- **Total**: $0/month

### Paid Tier (For Scale)
- **Database**: Railway PostgreSQL ($5-10/month)
- **Backend**: Railway or Render ($7-20/month)
- **Domain**: Namecheap ($10-15/year)
- **Total**: ~$15-30/month

---

## 📞 Support

If you encounter issues:
1. Check logs: `vercel logs` or `railway logs`
2. Review error messages carefully
3. Test each component individually
4. Check environment variables
5. Verify database connection

---

## ✅ Deployment Checklist

- [ ] Database created and schema applied
- [ ] Backend deployed to Vercel/Railway/Render
- [ ] Environment variables configured
- [ ] Backend health check passes
- [ ] Privacy policy hosted and accessible
- [ ] Terms of service hosted and accessible
- [ ] Support page hosted and accessible
- [ ] Mobile app .env updated with backend URL
- [ ] Test registration and login from app
- [ ] All API endpoints working
- [ ] HTTPS enabled (automatic)
- [ ] Error tracking set up (optional)
- [ ] Uptime monitoring set up (optional)

---

**Congratulations! Your backend is now deployed and ready for production! 🎉**

Next: Follow APP_STORE_SUBMISSION_CHECKLIST.md to submit your app.
