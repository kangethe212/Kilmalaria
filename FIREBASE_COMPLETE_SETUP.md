# 🔥 Complete Firebase Setup Guide for Kilmalaria

## ✅ Quick Checklist

- [ ] Firebase Project Created
- [ ] Authentication Enabled
- [ ] Firestore Database Created
- [ ] Security Rules Configured
- [ ] Email Templates Customized
- [ ] Frontend .env File Configured
- [ ] Test Account Created

---

## Step 1: Verify Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/kilmalaria-7e485

2. **Check Project Status**
   - Project ID: `kilmalaria-7e485`
   - Status should show as "Active"

---

## Step 2: Enable Authentication

1. **Navigate to Authentication**
   - Click "Authentication" in left sidebar
   - Or go to: https://console.firebase.google.com/project/kilmalaria-7e485/authentication

2. **Get Started** (if first time)
   - Click "Get started" button

3. **Enable Email/Password Sign-in**
   - Click "Sign-in method" tab
   - Click on "Email/Password"
   - Toggle "Enable" to **ON**
   - Click "Save"

4. **Enable Google Sign-in** (Optional but Recommended)
   - Click on "Google"
   - Toggle "Enable" to **ON**
   - Enter your support email
   - Click "Save"

5. **Enable Microsoft Sign-in** (Optional)
   - Click on "Microsoft"
   - Toggle "Enable" to **ON**
   - Click "Save"

---

## Step 3: Create Firestore Database

1. **Navigate to Firestore**
   - Click "Firestore Database" in left sidebar
   - Or go to: https://console.firebase.google.com/project/kilmalaria-7e485/firestore

2. **Create Database** (if not created)
   - Click "Create database" button
   - Select "Start in production mode"
   - Click "Next"

3. **Choose Location**
   - Select region closest to Kenya (e.g., "europe-west1" or "europe-west3")
   - Click "Enable"
   - Wait for database creation (~30 seconds)

4. **Set Security Rules**
   - Click "Rules" tab
   - Delete the temporary rules
   - Paste these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Chats collection
    match /chats/{chatId} {
      // Users can only read their own chats
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      
      // Users can create chats for themselves
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      
      // Users can update their own chats
      allow update: if isAuthenticated() && isOwner(resource.data.userId);
      
      // Users can delete their own chats
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
      
      // Messages subcollection within chats
      match /messages/{messageId} {
        // Users can read messages from their own chats
        allow read: if isAuthenticated();
        
        // Users can create messages in any authenticated session
        allow create: if isAuthenticated();
        
        // No updates or deletes on individual messages
        allow update, delete: if false;
      }
    }
    
    // Contact form submissions
    match /contacts/{contactId} {
      // Anyone authenticated can submit a contact form
      allow create: if isAuthenticated();
      
      // Only allow reading your own submissions
      allow read: if isAuthenticated() && 
        request.auth.uid == resource.data.userId;
      
      // No updates or deletes by users
      allow update, delete: if false;
    }
    
    // User profiles (optional - for future use)
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

   - Click "Publish"

---

## Step 4: Customize Email Templates

1. **Navigate to Email Templates**
   - Go to: https://console.firebase.google.com/project/kilmalaria-7e485/authentication/emails
   - Or: Authentication → Templates tab

2. **Customize Email Verification Template**
   - Click on "Email verification"
   
   **Subject:**
   ```
   Verify your email for Kilmalaria
   ```
   
   **Email Body (HTML):**
   ```html
   <p>Hello,</p>
   
   <p>Follow this link to verify your email address.</p>
   
   <p><a href="%LINK%">Verify Email Address</a></p>
   
   <p>Or copy and paste this link into your browser:</p>
   <p>%LINK%</p>
   
   <p>If you didn't ask to verify this address, you can ignore this email.</p>
   
   <p>Thanks,<br>
   Your Kilmalaria team</p>
   ```
   
   **Email Body (Plain Text):**
   ```
   Hello,
   
   Follow this link to verify your email address.
   
   %LINK%
   
   If you didn't ask to verify this address, you can ignore this email.
   
   Thanks,
   Your Kilmalaria team
   ```
   
   - Click "Save"

3. **Customize Password Reset Template** (Optional)
   - Click on "Password reset"
   - Customize similarly
   - Click "Save"

---

## Step 5: Verify Frontend Configuration

1. **Check .env File**
   - Location: `frontend/.env`
   - Should contain:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyCHv4MNanvf--JWkR7XtU8MyyC41FaCGIQ
   VITE_FIREBASE_AUTH_DOMAIN=kilmalaria-7e485.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=kilmalaria-7e485
   VITE_FIREBASE_STORAGE_BUCKET=kilmalaria-7e485.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=358560967840
   VITE_FIREBASE_APP_ID=1:358560967840:web:e7ea832af02481c4066dc5
   ```

2. **Verify Code Configuration**
   - File: `frontend/src/services/firebase.js`
   - Should read from environment variables correctly

---

## Step 6: Test the Setup

1. **Start Frontend**
   ```powershell
   cd "C:\Users\Malaria final project\frontend"
   npm run dev
   ```

2. **Open Browser**
   - Go to: http://localhost:5173

3. **Test Sign Up**
   - Click "Sign Up Now"
   - Enter:
     - Name: Test User
     - Email: your-email@example.com
     - Password: test123456
   - Click "Sign Up"

4. **Check Email**
   - Open your email inbox
   - Look for verification email from Firebase
   - Click verification link

5. **Test Sign In**
   - After verifying email
   - Go back to app
   - Sign in with your credentials
   - Should redirect to Dashboard

6. **Test Chat**
   - Click "New Chat" or "Chat Now"
   - Send a test message
   - Check Firestore Console to see data saved

---

## Step 7: Verify in Firebase Console

1. **Check Authentication Users**
   - Go to: Authentication → Users tab
   - Should see your test user
   - Email should show as "Verified"

2. **Check Firestore Data**
   - Go to: Firestore Database → Data tab
   - Should see:
     - `chats` collection (after creating chat)
     - `contacts` collection (if contact form used)

---

## 🔧 Troubleshooting

### Problem: "Firebase not configured"
**Solution:**
- Check `.env` file exists in `frontend/` folder
- Restart frontend server after creating `.env`
- Check browser console for errors

### Problem: "Permission denied" in Firestore
**Solution:**
- Verify Firestore rules are published
- Check user is authenticated
- Verify rules match your data structure

### Problem: "Email not sending"
**Solution:**
- Check email template is saved
- Verify email/password auth is enabled
- Check spam folder

### Problem: "Sign in failed"
**Solution:**
- Verify authentication method is enabled
- Check email is verified (if required)
- Check browser console for specific error

---

## ✅ Setup Complete Checklist

- [x] Firebase Project: kilmalaria-7e485
- [ ] Authentication Enabled (Email/Password)
- [ ] Firestore Database Created
- [ ] Security Rules Published
- [ ] Email Templates Customized
- [ ] Frontend .env Configured
- [ ] Test Account Created & Verified
- [ ] Chat Functionality Tested

---

## 📝 Next Steps After Setup

1. **Customize Email Templates** - Make them branded
2. **Set Up Custom Domain** (Optional) - For custom sender email
3. **Enable Additional Auth Methods** - Google, Microsoft
4. **Configure Firebase Hosting** (Optional) - For production deployment
5. **Set Up Analytics** (Optional) - Track user behavior

---

**Your Kilmalaria Firebase setup is complete!** 🎉

For questions or issues, check the Firebase Console or refer to Firebase documentation.

