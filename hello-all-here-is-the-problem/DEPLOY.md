# 🚀 Deployment Guide

This guide explains how to deploy the Mantis app to various platforms.

## Table of Contents
- [Render (Recommended)](#render-recommended)
- [Railway](#railway)
- [Heroku](#heroku)
- [DigitalOcean App Platform](#digitalocean-app-platform)
- [Vercel](#vercel)

---

## Render (Recommended) 🌟

**Best for:** Free tier with persistent filesystem, easy setup

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Deploy
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `er-aryn/mantis_v1`
3. Configure:
   - **Name**: `mantis-app` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run seed`
   - **Start Command**: `npm start`
4. Click **"Create Web Service"**

### Using render.yaml (Blueprint)
The repository includes a `render.yaml` file for one-click deployment:

1. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. Click **"New Blueprint Instance"**
3. Connect your GitHub repo
4. Render will automatically configure everything

### Environment Variables
Add these in Render Dashboard → Environment:
```
NODE_ENV=production
PORT=10000
```

**Live URL**: `https://mantis-app.onrender.com`

---

## Railway 🚂

**Best for:** Modern platform, easy deployment

### Step 1: Setup
1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**

### Step 2: Deploy
1. Select your repository
2. Railway auto-detects Node.js and deploys
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   ```

### Step 3: Access
Your app will be available at `https://<project-name>.up.railway.app`

---

## Heroku 🟣

**Best for:** Popular platform, extensive ecosystem

### Prerequisites
Install Heroku CLI:
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
choco install heroku-cli

# Ubuntu
sudo snap install --classic heroku
```

### Step 1: Create Heroku App
```bash
# Login
heroku login

# Create app
cd hello-all-here-is-the-problem
heroku create mantis-hackathon-app

# Set environment variables
heroku config:set NODE_ENV=production
```

### Step 2: Deploy
```bash
# Add Heroku remote (if not already)
git remote add heroku https://git.heroku.com/mantis-hackathon-app.git

# Push to deploy
git push heroku main
```

**Note**: Heroku's free tier sleeps after 30 minutes of inactivity.

---

## DigitalOcean App Platform 🌊

**Best for:** Reliable, free tier available

### Step 1: Create App
1. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Choose **"GitHub"** as source
4. Select your repository

### Step 2: Configure
- **Environment**: `Node.js`
- **Build Command**: `npm install && npm run seed`
- **Run Command**: `npm start`
- **HTTP Port**: `3000`

### Step 3: Deploy
Click **"Next"** → **"Create Resources"**

Your app will be live at `https://<app-name>.ondigitalocean.app`

---

## Vercel ▲

**Best for:** Frontend + Serverless Functions (with limitations)

**Note**: Vercel is primarily for frontend/Next.js. For this Express app, use the other platforms above.

---

## 📝 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `package.json` has correct `start` script
- [ ] `render.yaml` or deployment config is created
- [ ] Environment variables are set
- [ ] `.env` file is in `.gitignore` (don't commit secrets)
- [ ] App runs locally: `npm start`
- [ ] Health check endpoint works: `http://localhost:3000/api/health`

---

## 🔧 Troubleshooting

### Port Already in Use
Most platforms provide the PORT via environment variable. The app already uses:
```javascript
const PORT = process.env.PORT || 3000;
```

### Build Fails
Ensure `data/db` directory exists:
```bash
mkdir -p data/db
```

### File Uploads Not Working
Some platforms (like Vercel) don't support persistent filesystem. Use:
- **Render** ✅ Persistent disk
- **Railway** ✅ Persistent disk
- **Heroku** ❌ Ephemeral filesystem (use S3 for uploads)

### Seed Data Not Working
Run seed manually:
```bash
npm run seed
```

---

## 🎉 After Deployment

1. **Test the API**: Visit `/api/health`
2. **Check logs**: View deployment platform logs
3. **Set custom domain** (optional)
4. **Enable HTTPS** (usually automatic)

---

## 📞 Support

If deployment fails:
1. Check platform-specific logs
2. Verify environment variables
3. Test locally first: `npm start`
4. Check the [Render Docs](https://render.com/docs), [Railway Docs](https://docs.railway.app/), or [Heroku Docs](https://devcenter.heroku.com/)

Happy deploying! 🚀
