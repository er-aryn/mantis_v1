# Setting Up Auto-Deployment to Render

This guide will help you set up automatic deployment to Render whenever you push to GitHub.

## Quick Setup (2 minutes)

### Step 1: Create a Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo: `er-aryn/mantis_v1`
4. Configure:
   - **Name**: `mantis-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run seed`
   - **Start Command**: `npm start`
5. Click **Create Web Service**
6. Wait for the first deployment to complete

### Step 2: Get Your Deploy Hook URL

1. In your Render dashboard, go to your web service
2. Click **Settings** tab
3. Scroll down to **Deploy Hook**
4. Copy the URL (it looks like: `https://api.render.com/deploy/srv-xxxxxxxxxxxxxxxx`)

### Step 3: Add Secret to GitHub

1. Go to your GitHub repo: `https://github.com/er-aryn/mantis_v1`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add:
   - **Name**: `RENDER_DEPLOY_HOOK_URL`
   - **Secret**: Paste your deploy hook URL from Step 2
6. Click **Add secret**

### Step 4: Enable Auto-Deploy

1. In your Render dashboard, go to your service
2. Click **Settings** tab
3. Under **Deploy**, ensure **Auto-Deploy** is enabled

## ✅ Done!

Now whenever you push to the `main` branch on GitHub:
1. GitHub Actions will run
2. Tests will execute (if any)
3. Render will automatically redeploy your app

## 🔧 What Happens Behind the Scenes

The GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on every push to `main` or `master`
- Sets up Node.js
- Installs dependencies
- Runs tests (if available)
- Calls Render's deploy hook to trigger deployment

## 📝 Manual Deployment (Backup)

If auto-deploy isn't working, you can manually trigger from GitHub:

1. Go to your repo on GitHub
2. Click **Actions** tab
3. Click **Auto Deploy to Render** workflow
4. Click **Run workflow** → **Run workflow**

## 🛠️ Troubleshooting

### "RENDER_DEPLOY_HOOK_URL secret not set"
- Make sure you added the secret in Step 3
- Check that the secret name is exactly: `RENDER_DEPLOY_HOOK_URL`

### Deployment fails
- Check the **Actions** tab on GitHub for error logs
- Check the **Logs** tab on Render dashboard

### Changes not showing up
- Check if the GitHub Action ran successfully
- Check Render dashboard **Deploys** tab for latest deployment

## 📚 Additional Resources

- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Node.js Deploy Guide](https://render.com/docs/deploy-node-express-app)

---

**Live URL after deployment**: `https://mantis-app.onrender.com`
