# Firebase Setup Guide for Kilmalaria

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Project name: `Kilmalaria`
   - Click "Continue"

3. **Google Analytics (Optional)**
   - You can disable this for now
   - Click "Create project"
   - Wait for project creation (takes ~30 seconds)
   - Click "Continue" when ready

---

## Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get started"

2. **Enable Email/Password**
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

3. **Enable Google Sign-In (Optional but Recommended)**
   - Click "Google" from the sign-in providers list
   - Toggle "Enable" to ON
   - Enter your email as the support email
   - Click "Save"

4. **Enable Microsoft Sign-In (Optional)**
   - Click "Microsoft"
   - Toggle "Enable" to ON
   - Click "Save"

---

## Step 3: Create Firestore Database

1. **Navigate to Firestore**
   - In left sidebar, click "Firestore Database"
   - Click "Create database"

2. **Choose Location**
   - Select "Start in production mode" (we'll add rules later)
   - Click "Next"

3. **Select Region**
   - Choose closest region to Kenya (e.g., "europe-west1")
   - Click "Enable"
   - Wait for database creation

4. **Set Security Rules**
   - Go to "Rules" tab
   - Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chats - users can only access their own
    match /chats/{chatId} {
      allow read, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      
      match /messages/{messageId} {
        allow read, create: if request.auth != null;
      }
    }
    
    // Contact submissions
    match /contacts/{contactId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```

   - Click "Publish"

---

## Step 4: Get Firebase Configuration

1. **Go to Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Click "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps"
   - Click the web icon `</>`
   - App nickname: `Kilmalaria Web`
   - ✅ Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy Configuration**
   - You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "kilmalaria-xxxxx.firebaseapp.com",
  projectId: "kilmalaria-xxxxx",
  storageBucket: "kilmalaria-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

   - **COPY ALL THESE VALUES** - you'll need them next!

---

## Step 5: Update Frontend Environment Variables

1. **Open the file**: `frontend/.env`

2. **Replace the placeholder values with YOUR Firebase config:**

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=kilmalaria-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kilmalaria-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=kilmalaria-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

VITE_RASA_URL=http://localhost:5005
VITE_ML_SERVICE_URL=http://localhost:8000
```

3. **Save the file**

---

## Step 6: Restart Frontend

1. **Stop the frontend** (Press Ctrl+C in the terminal)
2. **Start it again**:
   ```powershell
   cd "C:\Users\Malaria final project\frontend"
   npm run dev
   ```

---

## Step 7: Test Authentication

1. **Open Browser**: http://localhost:5173

2. **Click "Sign Up Now"**

3. **Create Account**:
   - Enter your name
   - Enter email
   - Enter password (min 6 characters)
   - Click "Sign Up"

4. **You should be redirected to Dashboard!** 🎉

---

## ✅ Authentication Flow

Once set up, users can:
1. **Sign Up** - Create new account (Email or Google/Microsoft)
2. **Sign In** - Login to existing account
3. **Access Dashboard** - See their profile and chat history
4. **Start Chat** - Interact with the ML-powered chatbot
5. **View History** - See previous conversations
6. **Sign Out** - Logout securely

---

## 🔐 Security Features

- ✅ User data isolation (users only see their own chats)
- ✅ Firebase Authentication (secure login)
- ✅ Firestore Security Rules (database protection)
- ✅ Encrypted connections (HTTPS in production)
- ✅ OAuth support (Google, Microsoft)

---

## 🐛 Troubleshooting

**Problem**: "Firebase not configured"
- **Solution**: Make sure .env file has correct values and restart frontend

**Problem**: "Permission denied"
- **Solution**: Check Firestore rules are published correctly

**Problem**: "Sign in failed"
- **Solution**: Verify authentication methods are enabled in Firebase Console

---

## 📝 Next Steps After Setup

1. Test creating an account
2. Test signing in
3. Test the chatbot interaction
4. Test conversation history
5. Deploy to production (Firebase Hosting)

---

**Complete these steps and your Kilmalaria platform will be fully functional!** 🚀

