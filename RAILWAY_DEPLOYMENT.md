# 🚂 Deploy ML Service to Railway - Step by Step

## Prerequisites

✅ Code is ready (already committed to GitHub)
✅ Deployment files created (Procfile, runtime.txt)
✅ App configured for production (uses PORT env var)

---

## Step 1: Sign Up / Login to Railway

1. **Go to Railway**: https://railway.app
2. **Click "Login"** (top right)
3. **Select "Login with GitHub"**
4. **Authorize Railway** to access your GitHub account

---

## Step 2: Create New Project

1. **Click "New Project"** (top right)
2. **Select "Deploy from GitHub repo"**
3. **If prompted**, authorize Railway to access your repositories
4. **Select your repository**: `kangethe212/Kilmalaria`
5. **Click "Deploy Now"**

---

## Step 3: Configure ML Service

### Important: Set Root Directory

Railway will deploy the entire repo by default. We need to tell it to use only the `ml-service` folder:

1. **After deployment starts**, click on the service
2. **Click "Settings"** tab
3. **Scroll to "Root Directory"**
4. **Click "Edit"**
5. **Enter**: `ml-service`
6. **Click "Save"**

### Verify Configuration

Railway should auto-detect:
- **Language**: Python
- **Build Command**: (auto-detected)
- **Start Command**: `python app.py` (from Procfile)

---

## Step 4: Add Environment Variables (if needed)

1. **Go to "Variables" tab**
2. **Add variables** (if your app needs any):
   - `FLASK_ENV=production`
   - `PORT` (Railway sets this automatically)

---

## Step 5: Wait for Deployment

1. **Watch the build logs**
2. **Railway will**:
   - Install Python dependencies
   - Run your app
   - Assign a URL

3. **Deployment takes 2-5 minutes**

---

## Step 6: Get Your Production URL

1. **After deployment completes**, Railway provides a URL
2. **Click "Settings"** → **"Networking"**
3. **Copy the URL** (looks like):
   ```
   https://kilmalaria-ml-service-production.up.railway.app
   ```
4. **Save this URL!** You'll need it for the frontend

---

## Step 7: Test Your ML Service

### Test Health Endpoint:

```powershell
# Replace with your actual Railway URL
curl https://your-railway-url.up.railway.app/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "Kilmalaria ML Service",
  "version": "1.0.0"
}
```

### Test Counties Endpoint:

```powershell
curl https://your-railway-url.up.railway.app/counties
```

Should return list of counties.

---

## Step 8: Update Frontend with Production URL

After you have your Railway URL:

1. **Update `frontend/.env`**:
   ```env
   VITE_ML_SERVICE_URL=https://your-railway-url.up.railway.app
   ```

2. **Rebuild and Redeploy Frontend**:
   ```powershell
   cd "C:\Users\Malaria final project\frontend"
   npm run build
   firebase deploy --only hosting
   ```

---

## 🎯 Quick Summary

1. ✅ Go to railway.app
2. ✅ Login with GitHub
3. ✅ New Project → Deploy from GitHub
4. ✅ Select `Kilmalaria` repo
5. ✅ Set Root Directory: `ml-service`
6. ✅ Wait for deployment
7. ✅ Copy production URL
8. ✅ Test endpoints
9. ✅ Update frontend `.env`
10. ✅ Redeploy frontend

---

## 🔧 Troubleshooting

### Problem: "Build failed"
**Solution**:
- Check build logs in Railway
- Verify `requirements.txt` has all dependencies
- Check Python version compatibility

### Problem: "Port already in use"
**Solution**:
- Railway sets PORT automatically
- App.py already uses `os.environ.get('PORT')` ✅

### Problem: "Module not found"
**Solution**:
- Check `requirements.txt` includes all packages
- Verify model files are in repo

### Problem: "Service not responding"
**Solution**:
- Check Railway logs
- Verify start command is correct
- Check if app is listening on 0.0.0.0

---

## 📊 Railway Dashboard

After deployment, you can:
- **View Logs**: Real-time application logs
- **Metrics**: CPU, Memory usage
- **Settings**: Environment variables, domain
- **Deployments**: View deployment history

---

## 💰 Railway Pricing

- **Free Tier**: 500 hours/month
- **$5/month**: Unlimited hours
- **Perfect for**: Small to medium projects

---

**Ready to deploy? Start with Step 1!** 🚀

