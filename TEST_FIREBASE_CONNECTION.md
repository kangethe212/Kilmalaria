# 🔥 Test Firebase Connection - Quick Guide

## ✅ Your Firebase is Already Connected!

Your frontend is already configured to connect to Firebase. Here's how to verify:

---

## Step 1: Authorize Firebase Hosting Domain

### In Firebase Console:

1. **Go to**: https://console.firebase.google.com/project/kilmalaria-7e485/authentication/settings

2. **Scroll to "Authorized domains"**

3. **Verify these domains are listed**:
   - ✅ `kilmalaria-7e485.web.app` (auto-added)
   - ✅ `kilmalaria-7e485.firebaseapp.com` (auto-added)
   - ✅ `localhost` (for development)

4. **If missing, click "Add domain"** and add:
   - Your custom domain (if you have one)

---

## Step 2: Test Connection Locally

### Start Frontend:

```powershell
cd "C:\Users\Malaria final project\frontend"
npm run dev
```

### Open Browser:

1. **Go to**: http://localhost:5173

2. **Open Browser Console** (F12):
   - Look for Firebase initialization messages
   - Should see: "Firebase initialized" or similar
   - No red errors

3. **Test Sign Up**:
   - Click "Sign Up Now"
   - Enter:
     - Name: Test User
     - Email: your-email@example.com
     - Password: test123456
   - Click "Sign Up"

4. **Check Email**:
   - Open your email inbox
   - Look for verification email from Firebase
   - Subject: "Verify your email for Kilmalaria"

5. **Verify Email**:
   - Click the verification link
   - Should redirect to verification page
   - Then redirect to dashboard

---

## Step 3: Test on Production Site

### Visit Live Site:

1. **Go to**: https://kilmalaria-7e485.web.app

2. **Open Browser Console** (F12):
   - Check for Firebase errors
   - Should initialize successfully

3. **Test Authentication**:
   - Try signing up or signing in
   - Should work the same as local

---

## Step 4: Verify Firestore Connection

### Test Chat Feature:

1. **Sign in** to your account

2. **Go to Chat** page

3. **Send a test message**

4. **Check Firestore Console**:
   - Go to: https://console.firebase.google.com/project/kilmalaria-7e485/firestore/data
   - Should see:
     - `chats` collection
     - Your chat document
     - `messages` subcollection

---

## 🔍 Connection Checklist

- [x] Firebase project created
- [x] `.env` file configured
- [x] Firebase initialized in code
- [ ] Authorized domains verified
- [ ] Authentication tested locally
- [ ] Authentication tested on production
- [ ] Firestore tested (create chat)
- [ ] Email verification tested

---

## 🐛 Common Issues

### Issue: "Firebase not configured"
**Fix**: 
- Check `.env` file exists
- Restart frontend server
- Clear browser cache

### Issue: "Permission denied"
**Fix**:
- Check Firestore rules are published
- Verify user is authenticated
- Check rules allow your operations

### Issue: "Auth domain not authorized"
**Fix**:
- Go to Firebase Console → Authentication → Settings
- Add your domain to authorized domains

---

## ✅ Success Indicators

When Firebase is connected correctly, you should see:

1. ✅ **Sign up works** - Account created in Firebase Auth
2. ✅ **Email sent** - Verification email received
3. ✅ **Sign in works** - Can login after verification
4. ✅ **Chat saves** - Messages appear in Firestore
5. ✅ **Dashboard loads** - User data displayed

---

## 🎯 Quick Test Commands

### Test Firebase Auth (in browser console):

```javascript
// Check if Firebase is initialized
console.log(firebase.apps.length > 0 ? '✅ Firebase connected' : '❌ Not connected')

// Check current user
import { getAuth } from 'firebase/auth'
const auth = getAuth()
console.log('Current user:', auth.currentUser)
```

---

**Your Firebase connection is ready! Test it now!** 🔥

