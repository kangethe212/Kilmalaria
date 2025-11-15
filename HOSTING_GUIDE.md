# 🚀 Kilmalaria Hosting Guide

## Hosting Options

### Option 1: Firebase Hosting (Recommended) ⭐
- **Best for**: Projects already using Firebase
- **Cost**: Free tier available
- **Pros**: Integrated with Firebase, easy setup, CDN included
- **Cons**: Limited to static sites (frontend only)

### Option 2: Vercel
- **Best for**: React/Vite projects
- **Cost**: Free tier available
- **Pros**: Automatic deployments, great for frontend, easy CI/CD
- **Cons**: Backend needs separate hosting

### Option 3: Netlify
- **Best for**: Full-stack apps
- **Cost**: Free tier available
- **Pros**: Easy setup, form handling, serverless functions
- **Cons**: Backend needs separate hosting

### Option 4: Docker + Cloud Provider
- **Best for**: Full control, microservices
- **Cost**: Varies (AWS, Azure, GCP)
- **Pros**: Complete control, scalable
- **Cons**: More complex setup, higher cost

---

## 🎯 Recommended: Firebase Hosting Setup

Since you're already using Firebase, this is the easiest option!

---

## Step 1: Install Firebase CLI

```powershell
npm install -g firebase-tools
```

Verify installation:
```powershell
firebase --version
```

---

## Step 2: Login to Firebase

```powershell
firebase login
```

This will open a browser window for authentication.

---

## Step 3: Initialize Firebase Hosting

```powershell
cd "C:\Users\Malaria final project\frontend"
firebase init hosting
```

**When prompted:**
1. **Select Firebase project**: Choose `kilmalaria-7e485`
2. **Public directory**: `dist` (Vite builds to dist folder)
3. **Single-page app**: Yes
4. **Set up automatic builds**: No (for now)
5. **Overwrite index.html**: No

---

## Step 4: Build Your Frontend

```powershell
cd "C:\Users\Malaria final project\frontend"
npm run build
```

This creates a `dist` folder with production-ready files.

---

## Step 5: Deploy to Firebase Hosting

```powershell
firebase deploy --only hosting
```

Your site will be live at: `https://kilmalaria-7e485.web.app`

---

## Step 6: Configure Environment Variables for Production

Firebase Hosting doesn't support `.env` files directly. You have two options:

### Option A: Use Firebase Remote Config (Recommended)
- Store config values in Firebase Remote Config
- Fetch at runtime

### Option B: Build-time Environment Variables
- Set environment variables during build
- They get baked into the build

**For now, your `.env` values will work if you build locally.**

---

## Step 7: Update Backend URLs for Production

You'll need to update your backend service URLs:

1. **Deploy ML Service** (Flask) to a cloud provider:
   - Heroku
   - Railway
   - Render
   - Google Cloud Run
   - AWS Elastic Beanstalk

2. **Deploy Rasa Service** (if using):
   - Same options as ML Service

3. **Update frontend environment variables** with production URLs

---

## 🔧 Alternative: Vercel Hosting (Easier for Frontend)

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Deploy

```powershell
cd "C:\Users\Malaria final project\frontend"
vercel
```

Follow the prompts. Vercel will:
- Detect Vite automatically
- Build your project
- Deploy it
- Give you a URL

### Step 3: Set Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all your `VITE_*` variables
4. Redeploy

---

## 🌐 Full Stack Deployment Options

### Option 1: Docker Compose (All Services Together)

1. **Deploy to a VPS** (DigitalOcean, Linode, etc.)
2. Use `docker-compose.yml` to run all services
3. Use Nginx as reverse proxy
4. Set up SSL with Let's Encrypt

### Option 2: Separate Services

- **Frontend**: Firebase Hosting / Vercel
- **ML Service**: Railway / Render / Heroku
- **Rasa Service**: Railway / Render / Heroku
- **Database**: Firebase Firestore (already set up)

---

## 📝 Production Checklist

### Frontend
- [ ] Build production version (`npm run build`)
- [ ] Set production environment variables
- [ ] Update API URLs to production endpoints
- [ ] Test all features
- [ ] Enable error tracking (Sentry, etc.)

### Backend (ML Service)
- [ ] Deploy Flask app to cloud
- [ ] Set up CORS for production domain
- [ ] Configure environment variables
- [ ] Set up monitoring/logging
- [ ] Test all endpoints

### Backend (Rasa Service)
- [ ] Deploy Rasa to cloud
- [ ] Configure webhook URLs
- [ ] Test chatbot responses
- [ ] Set up monitoring

### Firebase
- [ ] Update authorized domains in Firebase Console
- [ ] Configure CORS for Firestore
- [ ] Set up production Firestore rules
- [ ] Configure email templates

### Security
- [ ] Enable HTTPS everywhere
- [ ] Set up CORS properly
- [ ] Review security rules
- [ ] Set up rate limiting
- [ ] Enable Firebase App Check (optional)

---

## 🚀 Quick Start: Firebase Hosting

**Fastest way to get your frontend live:**

```powershell
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (in frontend folder)
cd "C:\Users\Malaria final project\frontend"
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting
```

**Your site will be live at:**
- `https://kilmalaria-7e485.web.app`
- `https://kilmalaria-7e485.firebaseapp.com`

---

## 🔗 Custom Domain Setup (Optional)

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **In Firebase Console**:
   - Go to Hosting → Add custom domain
   - Follow verification steps
   - Update DNS records
3. **SSL certificate** is automatically provided by Firebase

---

## 📊 Monitoring & Analytics

After deployment:
- **Firebase Analytics**: Built-in
- **Google Analytics**: Add tracking code
- **Error Tracking**: Sentry, LogRocket
- **Uptime Monitoring**: UptimeRobot, Pingdom

---

## 💰 Cost Estimates

### Firebase Hosting (Free Tier)
- **Storage**: 10 GB
- **Bandwidth**: 360 MB/day
- **Custom domains**: Free
- **SSL**: Free

### Vercel (Free Tier)
- **Bandwidth**: 100 GB/month
- **Builds**: Unlimited
- **Custom domains**: Free

### Backend Hosting
- **Railway**: ~$5-20/month
- **Render**: Free tier available
- **Heroku**: $7-25/month
- **Google Cloud Run**: Pay per use

---

## 🎯 Recommended Architecture

```
┌─────────────────┐
│   Frontend      │ → Firebase Hosting (Free)
│   (React/Vite)  │   https://kilmalaria.web.app
└────────┬────────┘
         │
         ├─→ Firebase Auth
         ├─→ Firestore Database
         │
         ├─→ ML Service API → Railway/Render ($5-10/mo)
         └─→ Rasa Chatbot → Railway/Render ($5-10/mo)
```

**Total Cost**: ~$10-20/month for full stack

---

## 🆘 Need Help?

1. **Firebase Hosting Docs**: https://firebase.google.com/docs/hosting
2. **Vercel Docs**: https://vercel.com/docs
3. **Deployment Issues**: Check browser console and server logs

---

**Ready to deploy? Start with Firebase Hosting for the quickest setup!** 🚀

