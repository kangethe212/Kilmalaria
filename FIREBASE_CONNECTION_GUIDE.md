# 🔥 Firebase Connection Guide for Kilmalaria

## Overview

Your Kilmalaria app uses Firebase for:
1. **Authentication** - User login/signup
2. **Firestore Database** - Chat history storage
3. **Hosting** - Frontend deployment

---

## ✅ Current Firebase Setup Status

### Frontend Connection
- ✅ `.env` file configured with Firebase credentials
- ✅ Firebase initialized in `frontend/src/services/firebase.js`
- ✅ Authentication service ready
- ✅ Firestore service ready

### Firebase Project
- **Project ID**: `kilmalaria-7e485`
- **Auth Domain**: `kilmalaria-7e485.firebaseapp.com`
- **Hosting URL**: `https://kilmalaria-7e485.web.app`

---

## Step 1: Verify Firebase Configuration

### Check Frontend Connection

1. **Verify `.env` file exists**:
   ```powershell
   cd "C:\Users\Malaria final project\frontend"
   Get-Content .env
   ```

2. **Should contain**:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyCHv4MNanvf--JWkR7XtU8MyyC41FaCGIQ
   VITE_FIREBASE_AUTH_DOMAIN=kilmalaria-7e485.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=kilmalaria-7e485
   VITE_FIREBASE_STORAGE_BUCKET=kilmalaria-7e485.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=358560967840
   VITE_FIREBASE_APP_ID=1:358560967840:web:e7ea832af02481c4066dc5
   ```

---

## Step 2: Authorize Firebase Hosting Domain

When you deploy to Firebase Hosting, you need to authorize the domain in Firebase Console.

### Add Authorized Domain

1. **Go to Firebase Console**:
   - https://console.firebase.google.com/project/kilmalaria-7e485/authentication/settings

2. **Scroll to "Authorized domains"**

3. **Add domains** (if not already added):
   - `kilmalaria-7e485.web.app` ✅ (auto-added)
   - `kilmalaria-7e485.firebaseapp.com` ✅ (auto-added)
   - Your custom domain (if you have one)

4. **For local development**, `localhost` is already authorized

---

## Step 3: Test Firebase Connection

### Test Locally

1. **Start Frontend**:
   ```powershell
   cd "C:\Users\Malaria final project\frontend"
   npm run dev
   ```

2. **Open Browser**: http://localhost:5173

3. **Open Browser Console** (F12):
   - Should see: Firebase initialized successfully
   - No Firebase errors

4. **Test Sign Up**:
   - Click "Sign Up Now"
   - Create an account
   - Check email for verification

### Test Production

1. **Visit**: https://kilmalaria-7e485.web.app

2. **Open Browser Console** (F12):
   - Check for Firebase initialization
   - Test authentication

---

## Step 4: Connect Backend Services to Firebase

### Option A: Backend Uses Firebase Admin SDK (Advanced)

If you want backend to access Firestore directly:

1. **Get Service Account Key**:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download JSON file

2. **Add to Backend**:
   - Store securely (environment variable)
   - Use Firebase Admin SDK in Flask

### Option B: Backend Uses REST API (Current Setup)

Your current setup uses REST API calls from frontend to backend. No direct Firebase connection needed in backend.

---

## Step 5: Update Firebase Authorized Domains for Backend

If your backend needs to make requests to Firebase:

1. **Go to**: https://console.firebase.google.com/project/kilmalaria-7e485/authentication/settings

2. **Add Backend Domain** (if using Firebase Admin):
   - Add your Railway/Render backend URL
   - Example: `kilmalaria-ml-service.up.railway.app`

---

## Step 6: Verify All Connections

### Frontend → Firebase ✅
- Authentication: Working
- Firestore: Working
- Hosting: Deployed

### Frontend → Backend (ML Service)
- Need to deploy ML Service to Railway/Render
- Update `VITE_ML_SERVICE_URL` in `.env`
- Rebuild and redeploy frontend

### Frontend → Backend (Rasa Service)
- Need to deploy Rasa Service to Railway/Render
- Update `VITE_RASA_URL` in `.env`
- Rebuild and redeploy frontend

---

## 🔍 Troubleshooting Firebase Connection

### Problem: "Firebase not configured"
**Solution**:
- Check `.env` file exists
- Verify all `VITE_FIREBASE_*` variables are set
- Restart frontend server

### Problem: "Permission denied" in Firestore
**Solution**:
- Check Firestore rules are published
- Verify user is authenticated
- Check rules match your data structure

### Problem: "Auth domain not authorized"
**Solution**:
- Go to Firebase Console → Authentication → Settings
- Add your domain to authorized domains list

### Problem: "CORS error" from backend
**Solution**:
- Backend CORS is configured for Firebase domains
- Check backend allows your frontend URL

---

## 📋 Firebase Connection Checklist

- [x] Firebase project created (`kilmalaria-7e485`)
- [x] Frontend `.env` configured
- [x] Firebase initialized in code
- [x] Authentication enabled
- [x] Firestore database created
- [x] Security rules published
- [x] Frontend deployed to Firebase Hosting
- [ ] Backend services deployed (Railway/Render)
- [ ] Production URLs updated in frontend
- [ ] All services tested

---

## 🔗 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/kilmalaria-7e485
- **Authentication**: https://console.firebase.google.com/project/kilmalaria-7e485/authentication
- **Firestore**: https://console.firebase.google.com/project/kilmalaria-7e485/firestore
- **Hosting**: https://console.firebase.google.com/project/kilmalaria-7e485/hosting
- **Project Settings**: https://console.firebase.google.com/project/kilmalaria-7e485/settings/general

---

## 🎯 Next Steps

1. **Deploy Backend Services** (Railway/Render)
2. **Update Frontend URLs** with production backend URLs
3. **Test Complete Flow**:
   - Sign up → Verify email → Sign in
   - Create chat → Send message
   - Upload data → Get predictions

---

**Your Firebase connection is ready!** 🔥

Need help with a specific connection issue? Let me know!

