# 🚀 Backend Services Deployment Guide

## Services to Deploy

1. **ML Service** (Flask) - Port 8000
2. **Rasa Service** (Optional) - Port 5005

---

## Option 1: Railway (Recommended) ⭐

### Why Railway?
- ✅ Easy setup
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Environment variables support
- ✅ Good for Python/Flask apps

---

## Deploy ML Service to Railway

### Step 1: Prepare Repository

1. **Commit deployment files** (already created):
   - `ml-service/Procfile`
   - `ml-service/runtime.txt`
   - `ml-service/requirements.txt`

2. **Push to GitHub**:
   ```powershell
   cd "C:\Users\Malaria final project"
   git add ml-service/Procfile ml-service/runtime.txt ml-service/railway.json
   git commit -m "Add Railway deployment config"
   git push
   ```

### Step 2: Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** (use GitHub account)
3. **Create New Project**
4. **Deploy from GitHub**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Kilmalaria` repository
   - Select `ml-service` folder as root directory

5. **Configure Service**:
   - Railway will auto-detect Python
   - Set start command: `python app.py`
   - Set port: Railway will auto-assign (use `$PORT` env var)

6. **Update app.py** to use Railway's PORT:
   ```python
   import os
   port = int(os.environ.get('PORT', 8000))
   app.run(host='0.0.0.0', port=port)
   ```

7. **Add Environment Variables** (if needed):
   - Go to Variables tab
   - Add any required env vars

8. **Get Production URL**:
   - Railway provides: `https://your-service-name.up.railway.app`
   - Copy this URL!

---

## Option 2: Render (Alternative)

### Deploy ML Service to Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** (use GitHub account)
3. **New Web Service**:
   - Connect your GitHub repo
   - Select `ml-service` folder
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

4. **Configure**:
   - Environment: Python 3
   - Instance Type: Free tier
   - Auto-Deploy: Yes

5. **Get Production URL**:
   - Render provides: `https://your-service-name.onrender.com`

---

## Update Flask App for Production

We need to update `app.py` to use environment PORT:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

---

## Deploy Rasa Service (Optional)

### Railway Deployment

1. **Create New Service** in Railway
2. **Select `rasa-service` folder**
3. **Configure**:
   - Build Command: `pip install -r requirements.txt && rasa train`
   - Start Command: `rasa run --enable-api --cors "*" --port $PORT`
   - Port: Use `$PORT` environment variable

### Render Deployment

1. **New Web Service** in Render
2. **Select `rasa-service` folder**
3. **Configure**:
   - Build: `pip install -r requirements.txt && rasa train`
   - Start: `rasa run --enable-api --cors "*"`

---

## Update Frontend with Production URLs

After deploying backend services, update frontend:

### Option 1: Update .env and Rebuild

1. **Update `frontend/.env`**:
   ```env
   VITE_ML_SERVICE_URL=https://your-ml-service.up.railway.app
   VITE_RASA_URL=https://your-rasa-service.up.railway.app
   ```

2. **Rebuild and Redeploy**:
   ```powershell
   cd "C:\Users\Malaria final project\frontend"
   npm run build
   firebase deploy --only hosting
   ```

### Option 2: Use Firebase Remote Config

Store URLs in Firebase Remote Config and fetch at runtime.

---

## Quick Deployment Checklist

### ML Service
- [ ] Update `app.py` to use `PORT` env var
- [ ] Commit deployment files
- [ ] Push to GitHub
- [ ] Deploy to Railway/Render
- [ ] Copy production URL
- [ ] Test endpoints

### Rasa Service (Optional)
- [ ] Deploy to Railway/Render
- [ ] Copy production URL
- [ ] Test chatbot endpoint

### Frontend
- [ ] Update `.env` with production URLs
- [ ] Rebuild frontend
- [ ] Redeploy to Firebase Hosting
- [ ] Test all features

---

## Testing Production URLs

After deployment, test:

```powershell
# Test ML Service
curl https://your-ml-service.up.railway.app/health

# Test Rasa Service (if deployed)
curl https://your-rasa-service.up.railway.app/webhooks/rest/webhook
```

---

## Cost Estimates

### Railway
- **Free Tier**: 500 hours/month
- **Paid**: $5-20/month per service

### Render
- **Free Tier**: Available (with limitations)
- **Paid**: $7-25/month per service

---

**Let's start deploying!** 🚀

