# Railway Setup Guide

## 🚂 Deploying to Railway

This guide walks you through deploying the Client Management System to Railway.

---

## Prerequisites

1. **Railway Account:** Sign up at [railway.app](https://railway.app)
2. **GitHub Access:** Repository at github.com/realcoachap/af
3. **Environment Variables Ready:** See `.env.example`

---

## Step 1: Create Railway Project

1. Log in to Railway
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `realcoachap/af` repository
5. Railway will auto-detect Next.js and begin deployment

---

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "New" 
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and generate `DATABASE_URL`
4. The `DATABASE_URL` is automatically injected into your app

---

## Step 3: Configure Environment Variables

In Railway dashboard, go to your app → "Variables" tab:

### Required Variables

```bash
# Automatically set by Railway
DATABASE_URL=(auto-generated, don't change)

# You must set these:
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)

# WhatsApp (add when ready)
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
```

### Generate NEXTAUTH_SECRET

On your local machine, run:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in Railway.

---

## Step 4: Deploy

1. Railway will automatically deploy when you push to `main` branch
2. Initial deployment may take 3-5 minutes
3. Check deployment logs for any errors
4. Once deployed, Railway provides a public URL

---

## Step 5: Initialize Database

After first deployment:

1. Go to Railway project
2. Click on your app service
3. Go to "Settings" → "Deploy"
4. Under "Deployment Commands", add:
   - Build Command: `npm run build`
   - Start Command: `npm run start`

5. In your local terminal, push schema to Railway database:
   ```bash
   # Set DATABASE_URL from Railway
   export DATABASE_URL="postgresql://..."
   
   # Push schema
   npx prisma db push
   
   # Generate Prisma Client
   npx prisma generate
   ```

**Alternative:** Use Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npx prisma db push
```

---

## Step 6: Seed Initial Admin (Optional)

Create an admin user so you can log in:

```bash
# Using Railway CLI
railway run npx prisma db seed

# Or manually via Prisma Studio
railway run npx prisma studio
```

**Manual SQL (via Railway dashboard):**
```sql
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_001',
  'coach@example.com',
  '$2b$10$...', -- Generate hashed password
  'ADMIN',
  NOW(),
  NOW()
);
```

**To generate hashed password:**
```javascript
// Use bcrypt
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

---

## Step 7: Verify Deployment

1. Visit your Railway app URL
2. Check homepage loads
3. Try registering a test client
4. Try logging in as admin
5. Check database in Railway dashboard

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to `main`:

```bash
# Make changes locally
git add .
git commit -m "your message"
git push origin main

# Railway detects push and redeploys automatically
```

---

## 🛠️ Useful Railway Commands

### Railway CLI

```bash
# View logs
railway logs

# Open Railway dashboard
railway open

# Run command in Railway environment
railway run <command>

# SSH into service
railway shell

# Get environment variables
railway variables
```

---

## 📊 Monitoring & Logs

### View Logs
- Railway Dashboard → Your Service → "Deployments" → Click latest deployment
- Or use `railway logs` in CLI

### Database Access
- Railway Dashboard → PostgreSQL service → "Data"
- Or connect via `psql` using DATABASE_URL
- Or use `railway run npx prisma studio`

### Metrics
- Railway Dashboard → Service → "Metrics"
- Shows CPU, memory, network usage

---

## 💰 Cost Estimates

**Hobby Plan (Free):**
- $5 free credit/month
- Good for development/testing
- 500 hours execution time

**Starter Plan ($5/mo):**
- 500 hours + database included
- Good for small production apps
- ~20-50 active users

**Scaling:**
- Railway charges based on usage
- PostgreSQL storage separate ($0.10/GB/month)
- Monitor costs in Railway dashboard

---

## 🚨 Troubleshooting

### Deployment Fails

1. Check logs: `railway logs`
2. Verify environment variables are set
3. Ensure `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "prisma generate && next build",
       "start": "next start"
     }
   }
   ```

### Database Connection Issues

1. Verify `DATABASE_URL` is set (Railway auto-sets this)
2. Check Prisma schema matches deployed version
3. Run `railway run npx prisma db push` to sync schema

### Can't Access App

1. Check deployment status in Railway dashboard
2. Verify domain is active
3. Check for errors in logs
4. Ensure Railway service is "running" (not crashed)

---

## 🔐 Security Checklist

Before going live:

- [ ] `NEXTAUTH_SECRET` is set and strong
- [ ] `.env` files are NOT committed to Git
- [ ] `DATABASE_URL` is not exposed in code
- [ ] HTTPS is enabled (Railway does this automatically)
- [ ] Admin password is strong
- [ ] Rate limiting is configured (add later)

---

## 📝 Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure WhatsApp Business API
3. Set up email notifications (optional)
4. Add monitoring (Railway provides basic metrics)
5. Schedule database backups (Railway has auto-backups)

---

## 🆘 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Contact Vlad (AI Developer) for project-specific help

---

**Guide maintained by Vlad | Last updated: 2026-02-08**
