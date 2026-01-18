# Scientific Calculator Deployment Helper

This command guides you through deploying your Scientific Calculator to Vercel (Frontend) and Render (Backend).

## Quick Start

### Prerequisites Check
- [ ] GitHub account ready (codemohandis)
- [ ] Vercel account created (https://vercel.com)
- [ ] Render account created (https://render.com)
- [ ] Code committed to GitHub

### Deployment Flow

```
┌─────────────────────────────┐
│  STEP 1: DEPLOY FRONTEND    │
│  (Vercel - React + Vite)    │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  STEP 2: DEPLOY BACKEND     │
│  (Render - Flask + Python)  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│  STEP 3: CONNECT & TEST     │
│  (Link frontend to backend) │
└─────────────────────────────┘
```

---

## 🎨 STEP 1: Deploy Frontend to Vercel

### 1.1 Create Vercel Account
```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize and install
```

### 1.2 Import Project
```
1. Click "New Project"
2. Click "Import Git Repository"
3. Search: codemohandis/scientific-calculator-
4. Click the repo
5. Click "Import"
```

### 1.3 Configure Build Settings
Vercel auto-detects. Verify:
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 1.4 Add Environment Variables
⚠️ **BEFORE CLICKING DEPLOY!**

Add Variable:
```
Name: VITE_API_URL
Value: https://scientific-calculator-api.onrender.com
```

### 1.5 Deploy!
```
Click "Deploy" button
Wait 2-3 minutes for completion
Copy your Frontend URL (vercel.app)
```

---

## ⚙️ STEP 2: Deploy Backend to Render

### 2.1 Create Render Account
```
1. Go to https://render.com
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize and install
```

### 2.2 Create Web Service
```
1. Click "New +" button
2. Click "Web Service"
3. Search: codemohandis/scientific-calculator-
4. Click the repo
5. Click "Connect"
```

### 2.3 Configure Service
```
Service Name: scientific-calculator-api
Environment: Python 3
Region: US (or closest)
Branch: main
Build Command: pip install -r requirements.txt
Start Command: gunicorn server:app
```

### 2.4 Add Environment Variables
```
Add these:
FLASK_ENV: production
FLASK_DEBUG: False
CORS_ORIGINS: https://scientific-calculator-[YOUR-VERCEL-ID].vercel.app
```

⚠️ **Replace [YOUR-VERCEL-ID] with actual ID from your Vercel URL!**

### 2.5 Deploy!
```
Click "Create Web Service"
Wait 5-10 minutes for completion
Status shows "Live"
Copy your Backend URL (onrender.com)
```

---

## 🔄 STEP 3: Connect & Test

### 3.1 Update Vercel
```
1. Go to Vercel Dashboard
2. Click your project
3. Settings → Environment Variables
4. Verify VITE_API_URL = https://scientific-calculator-api.onrender.com
5. Click "Save"
6. Go to Deployments → Redeploy latest
7. Wait 2-3 minutes
```

### 3.2 Test Backend Health
```bash
curl https://scientific-calculator-api.onrender.com/health
```

Expected:
```json
{"status":"ok","message":"API server is running"}
```

### 3.3 Test Frontend
```
1. Open: https://scientific-calculator-[your-id].vercel.app
2. Try Convert Button (5 meter → foot) ✓
3. Try Calculate Button (sin 30) ✓
4. Try Evaluate Button (2+3*4) ✓
5. Try Copy Button ✓
```

---

## ✅ Success Checklist

- [ ] Vercel frontend deployed
- [ ] Render backend deployed
- [ ] Frontend can reach backend (no CORS errors)
- [ ] All buttons work
- [ ] Copy button works
- [ ] No console errors

---

## 🐛 Quick Troubleshooting

### "Cannot connect to API"
```
1. Check Render status = "Live"
2. Test: curl https://scientific-calculator-api.onrender.com/health
3. Verify CORS_ORIGINS in Render = your Vercel URL
4. Redeploy Vercel
5. Wait 5 minutes
```

### "CORS Error"
```
1. Go to Render Dashboard
2. Settings → Environment Variables
3. Update CORS_ORIGINS to exact Vercel URL
4. Redeploy Render
5. Wait 5-10 minutes
```

### "Backend keeps crashing"
```
1. Go to Render → Events tab
2. Check error messages
3. Common: missing requirements.txt or bad Start Command
4. Verify: cat requirements.txt (should exist locally)
```

---

## 📞 For More Help

See complete guide:
```bash
cat DEPLOYMENT.md
```

Key sections:
- Full step-by-step guide
- Architecture overview
- Detailed troubleshooting
- Monitoring & maintenance
- Environment variables reference

---

## 🚀 Your Live URLs

After deployment:
```
Frontend: https://scientific-calculator-[random-id].vercel.app
Backend:  https://scientific-calculator-api.onrender.com
```

**Share your app with the world!** 🎉
