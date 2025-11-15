# 🚀 Step-by-Step Deployment Guide

## Quick Start: Deploy ML Service to Railway

### Step 1: Update Code for Production

✅ Already done! The `app.py` has been updated to use `PORT` environment variable.

### Step 2: Commit and Push Changes

```powershell
cd "C:\Users\Malaria final project"
git add .
git commit -m "Add deployment configs for Railway/Render"
git push
```

### Step 3: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project**
4. **Deploy from GitHub**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `kangethe212/Kilmalaria`
   - Click "Add Service" → "GitHub Repo"
   - Select your repository
   - **IMPORTANT**: Set Root Directory to `ml-service`

5. **Configure Service**:
   - Railway auto-detects Python
   - Start Command: `python app.py`
   - Port: Railway auto-assigns (app.py uses `$PORT`)

6. **Get Your URL**:
   - After deployment, Railway provides a URL like:
   - `https://kilmalaria-ml-service.up.railway.app`
   - Copy this URL!

### Step 4: Test ML Service

```powershell
# Test health endpoint
curl https://your-railway-url.up.railway.app/health
```

Should return: `{"status": "healthy", ...}`

---

## Deploy Rasa Service (Optional)

### Railway Deployment

1. **Add Another Service** in same Railway project
2. **Select `rasa-service` folder** as root directory
3. **Configure**:
   - Build Command: `pip install -r requirements.txt && rasa train --fixed-model-name malaria-bot`
   - Start Command: `rasa run --enable-api --cors "*" --port $PORT`
   - Port: Railway auto-assigns

4. **Get Rasa URL**: `https://kilmalaria-rasa.up.railway.app`

---

## Update Frontend with Production URLs

### Step 1: Update Environment Variables

Update `frontend/.env`:

```env
# Firebase Configuration (keep existing)
VITE_FIREBASE_API_KEY=AIzaSyCHv4MNanvf--JWkR7XtU8MyyC41FaCGIQ
VITE_FIREBASE_AUTH_DOMAIN=kilmalaria-7e485.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kilmalaria-7e485
VITE_FIREBASE_STORAGE_BUCKET=kilmalaria-7e485.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=358560967840
VITE_FIREBASE_APP_ID=1:358560967840:web:e7ea832af02481c4066dc5

# Backend Service URLs (UPDATE THESE!)
VITE_RASA_URL=https://your-rasa-service.up.railway.app
VITE_ML_SERVICE_URL=https://your-ml-service.up.railway.app
```

### Step 2: Rebuild and Redeploy Frontend

```powershell
cd "C:\Users\Malaria final project\frontend"
npm run build
firebase deploy --only hosting
```

---

## Alternative: Render Deployment

### ML Service on Render

1. **Go to Render**: https://render.com
2. **New Web Service**
3. **Connect GitHub** → Select `Kilmalaria` repo
4. **Configure**:
   - Name: `kilmalaria-ml-service`
   - Root Directory: `ml-service`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Instance Type: Free

5. **Get URL**: `https://kilmalaria-ml-service.onrender.com`

---

## Testing Production Deployment

After deployment, test:

1. **ML Service Health**:
   ```
   https://your-ml-service-url/health
   ```

2. **ML Service Counties**:
   ```
   https://your-ml-service-url/counties
   ```

3. **Frontend**:
   - Visit: https://kilmalaria-7e485.web.app
   - Test authentication
   - Test predictions
   - Test chatbot

---

## Troubleshooting

### Problem: "Port already in use"
- Solution: Railway/Render assigns PORT automatically, app.py now uses it

### Problem: "Module not found"
- Solution: Check `requirements.txt` has all dependencies

### Problem: "CORS error"
- Solution: Flask-CORS is enabled, but check frontend URL is allowed

### Problem: "Model file not found"
- Solution: Ensure model files are committed to repo or use persistent storage

---

## Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Update Firebase authorized domains
3. ✅ Set up monitoring
4. ✅ Configure custom domain (optional)
5. ✅ Set up CI/CD for auto-deployments

---

**Ready to deploy? Start with Railway - it's the easiest!** 🚀

