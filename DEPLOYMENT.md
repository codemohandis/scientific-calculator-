# 🚀 Deployment Guide - Scientific Calculator

Complete guide to deploy your Scientific Calculator to **Vercel** (Frontend) and **Render** (Backend).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Auto-Deployment Setup](#auto-deployment-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 📌 Prerequisites

### Required Accounts
- [ ] GitHub account (already have: codemohandis)
- [ ] Vercel account (create at https://vercel.com)
- [ ] Render account (create at https://render.com)

### Required Tools
- [ ] Git installed locally
- [ ] GitHub repository pushed and up-to-date
- [ ] Deployment config files in place:
  - [ ] `requirements.txt` ✅
  - [ ] `server.py` (updated) ✅
  - [ ] `frontend/vercel.json` ✅
  - [ ] `render.yaml` ✅

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Your App (Internet)                  │
├──────────────────┬──────────────────┬──────────────────┤
│   Frontend       │                  │     Backend      │
│   (Vercel)       │   GitHub Repo    │    (Render)      │
│                  │                  │                  │
│ React + Vite    │←──→ Source Code ←→│  Flask + Python  │
│ Port: 443       │                  │  Port: 8000      │
│ URL: *.vercel   │  Auto-Deploy     │  URL: *.render   │
│                  │  on Push         │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare GitHub Repository

Ensure all changes are committed and pushed:

```bash
cd "C:\Users\hijaz trd\Documents\specifyplus"
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

### Step 3: Import Project to Vercel

1. After login, click **"New Project"** button
2. Click **"Import Git Repository"**
3. Search for: `codemohandis/scientific-calculator-`
4. Click the repository name
5. Click **"Import"**

### Step 4: Configure Build Settings

Vercel should auto-detect Vite. Verify these settings:

```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 5: Add Environment Variables

⚠️ **IMPORTANT: Do this BEFORE clicking Deploy!**

1. Look for **"Environment Variables"** section
2. Click **"Add"** button
3. Enter:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://scientific-calculator-api.onrender.com`

4. Click **"Save"**

### Step 6: Deploy to Vercel

1. Click the **"Deploy"** button
2. Wait for deployment to complete (2-3 minutes)
3. You'll see a "Congratulations" message with your URL

### ✅ Vercel Deployment Complete!

**Your Frontend URL:**
```
https://scientific-calculator-[random-id].vercel.app
```

Copy this URL! You'll need it for the backend configuration.

---

## ⚙️ Backend Deployment (Render)

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Sign Up"**
3. Click **"Continue with GitHub"**
4. Authorize Render to access your GitHub repositories

### Step 2: Create Web Service

1. After login, click **"New +"** button (top right)
2. Click **"Web Service"**
3. Search for your GitHub repo: `codemohandis/scientific-calculator-`
4. Click the repository
5. Click **"Connect"**

### Step 3: Configure Service

Fill in the deployment configuration:

```
Service Name:        scientific-calculator-api
Environment:         Python 3
Region:             US (or closest to you)
Branch:             main
Build Command:      pip install -r requirements.txt
Start Command:      gunicorn server:app
```

### Step 4: Add Environment Variables

⚠️ **IMPORTANT: Replace [VERCEL_URL] with your actual Vercel URL!**

Click **"Add Environment Variable"** and add:

```
Name:  FLASK_ENV
Value: production

Name:  FLASK_DEBUG
Value: False

Name:  CORS_ORIGINS
Value: https://scientific-calculator-[your-vercel-id].vercel.app
```

**Replace `[your-vercel-id]` with the actual ID from your Vercel URL!**

Example:
```
CORS_ORIGINS: https://scientific-calculator-abc123xyz.vercel.app
```

### Step 5: Deploy to Render

1. Scroll to bottom and click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. When complete, status shows **"Live"** with a green checkmark

### ✅ Render Deployment Complete!

**Your Backend URL:**
```
https://scientific-calculator-api.onrender.com
```

---

## 🔄 Connect Frontend & Backend

### Update Vercel Environment Variable

1. Go back to **Vercel Dashboard**
2. Click your **scientific-calculator** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` variable
5. Verify it shows: `https://scientific-calculator-api.onrender.com`
6. If different, update it
7. Click **"Save"**

### Trigger Redeploy

1. Go to **Deployments** tab
2. Click the three dots (**...**) on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for redeploy to complete

---

## ✅ Verification & Testing

### Test Backend API

**Using curl:**
```bash
curl https://scientific-calculator-api.onrender.com/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "API server is running"
}
```

### Test Conversion Endpoint

```bash
curl -X POST https://scientific-calculator-api.onrender.com/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 10, "from_unit": "kilometer", "to_unit": "mile"}'
```

**Expected response:**
```json
{
  "error": null,
  "from_unit": "kilometer",
  "result": 6.21371,
  "to_unit": "mile"
}
```

### Test Frontend in Browser

1. Open: `https://scientific-calculator-[your-id].vercel.app`
2. Test **Convert Button**:
   - Enter value: `5`
   - From unit: `meter`
   - To unit: `foot`
   - Click Convert
   - Should show: `5 meter = 16.4042 foot` ✅

3. Test **Calculate Button**:
   - Select function: `sin`
   - Enter: `30`
   - Click Calculate
   - Should show: `sin(30) = 0.5` ✅

4. Test **Evaluate Button**:
   - Enter expression: `2 + 3 * 4`
   - Click Evaluate
   - Should show: `2 + 3 * 4 = 14` ✅

5. Test **Copy Button**:
   - Get a result
   - Click "Copy Result"
   - Paste somewhere to verify ✅

### ✅ All Tests Passed?

If all buttons work and copy works, your deployment is **SUCCESSFUL!** 🎉

---

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to API"

**Symptoms:**
- Buttons don't work
- Network tab shows 404/500 errors
- Console shows CORS errors

**Solutions:**
```
1. Verify Render backend is deployed:
   - Go to https://render.com
   - Check status is "Live"

2. Test backend directly:
   curl https://scientific-calculator-api.onrender.com/health

3. Check CORS_ORIGINS in Render:
   - Settings → Environment Variables
   - Verify it matches your Vercel URL exactly

4. Redeploy Vercel:
   - Go to Vercel Dashboard
   - Deployments → Redeploy
   - Wait 3-5 minutes
```

### Issue 2: "CORS Error in Console"

**Error message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```
1. Go to Render Dashboard
2. Settings → Environment Variables
3. Update CORS_ORIGINS to your Vercel URL
4. Redeploy: click three dots → Redeploy
5. Wait 5-10 minutes for changes to take effect
```

### Issue 3: "Render Backend Keeps Crashing"

**Solution:**
1. Go to Render Dashboard → Your service
2. Click **"Events"** tab
3. Look for error messages
4. Common causes:
   - Missing `requirements.txt`
   - Wrong `Start Command`
   - Python import errors

**If crashing, check:**
```bash
# Verify requirements.txt exists
cat requirements.txt
# Should have: Flask, Flask-CORS, gunicorn

# Verify server.py syntax
python server.py --help
# Should start without errors
```

### Issue 4: "Build Failed on Vercel"

**Solution:**
1. Go to Vercel Dashboard → Deployments
2. Click failed deployment
3. Look at **Build Log** for error message
4. Common causes:
   - Missing npm dependencies
   - Wrong build command
   - Node version mismatch

**Fix:**
```bash
# Verify frontend works locally
cd frontend
npm install
npm run build
# If this works locally, push to GitHub
git add .
git commit -m "Fix build"
git push origin main
# Vercel will redeploy automatically
```

### Issue 5: "Port Already in Use" (Local Testing)

**Solution:**
```bash
# Kill the process using the port
lsof -i :8000  # Check what's using port 8000
kill -9 [PID]  # Kill the process

# Then restart
python server.py
```

---

## 🔄 Auto-Deployment Setup

Both Vercel and Render support **automatic deployment on git push**.

### How It Works

```
You Push to GitHub
        ↓
GitHub sends webhook to Vercel & Render
        ↓
Vercel: Builds frontend automatically
Render: Builds backend automatically
        ↓
Both deploy to production in 2-5 minutes
```

### Manual Redeploy (if needed)

**Vercel:**
1. Dashboard → Deployments
2. Click three dots on latest deployment
3. Click "Redeploy"

**Render:**
1. Dashboard → Your service
2. Top right → "Manual Deploy"
3. Select branch → Click "Deploy"

---

## 📊 Monitoring & Maintenance

### Check Deployment Status

**Vercel Dashboard:**
- https://vercel.com/dashboard
- See all deployments and status

**Render Dashboard:**
- https://dashboard.render.com
- See service status and recent deploys

### View Logs

**Vercel Logs:**
1. Click deployment
2. Click "Logs" tab
3. See build and runtime logs

**Render Logs:**
1. Click service
2. Click "Logs" tab
3. See real-time logs

### Performance Monitoring

**Vercel Analytics:**
1. Project Settings → Analytics
2. See page load times, traffic, etc.

**Render Metrics:**
1. Service Dashboard
2. See CPU, memory usage
3. Monitor for issues

### Update Code

To deploy updates:

```bash
# Make changes to code
git add .
git commit -m "Update feature or fix bug"
git push origin main

# Vercel & Render auto-deploy!
# Check status: Vercel & Render dashboards
# Usually takes 2-5 minutes
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All code committed to GitHub
- [ ] `requirements.txt` created
- [ ] `server.py` updated for production
- [ ] `vercel.json` in frontend directory
- [ ] `render.yaml` in project root

### Vercel Deployment
- [ ] Account created
- [ ] Repository imported
- [ ] Environment variables added
- [ ] Frontend deployed successfully
- [ ] Vercel URL copied

### Render Deployment
- [ ] Account created
- [ ] Service created
- [ ] Build & Start commands set
- [ ] Environment variables configured
- [ ] Backend deployed successfully

### Post-Deployment
- [ ] Backend health check passed
- [ ] Frontend can reach backend
- [ ] All calculator buttons work
- [ ] Copy button works
- [ ] No console errors

---

## 🚀 Your Live URLs

After successful deployment:

```
Frontend: https://scientific-calculator-[random-id].vercel.app
Backend:  https://scientific-calculator-api.onrender.com
GitHub:   https://github.com/codemohandis/scientific-calculator-
```

### Share Your App!

Your scientific calculator is now **live on the internet**! Share the Vercel URL with:
- Friends and family
- Social media
- Reddit, Twitter, etc.
- Product Hunt (later!)

---

## 📞 Support

### If Something Goes Wrong

1. Check **Troubleshooting** section above
2. Review deployment logs:
   - Vercel: Dashboard → Deployments → Logs
   - Render: Dashboard → Logs
3. Verify environment variables match
4. Try manual redeploy
5. Check GitHub push was successful

### Useful Commands

```bash
# Check git status
git status

# View recent commits
git log --oneline -10

# Verify file structure
ls -la requirements.txt server.py frontend/vercel.json render.yaml

# Test backend locally
python server.py

# Test frontend locally
cd frontend && npm start
```

---

## 🎉 Congratulations!

Your Scientific Calculator is now deployed and accessible worldwide!

**Next Steps:**
- Monitor usage and performance
- Gather user feedback
- Add new features
- Consider monetization (later)
- Share with more users

---

**Last Updated:** 2026-01-18
**Status:** Production Ready ✅
