# Firebase Deployment via GitHub Actions

This guide explains how to set up automatic Firebase deployment through GitHub Actions.

## Prerequisites

1. Firebase project created
2. Firebase Hosting enabled
3. GitHub repository with code pushed

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon ⚙️ → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file securely (you'll need this for GitHub secrets)

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

### Required Secrets:

1. **FIREBASE_SERVICE_ACCOUNT**
   - Value: Copy the entire contents of the JSON file from Step 1
   - This is the service account key for Firebase authentication

2. **FIREBASE_PROJECT_ID**
   - Value: Your Firebase project ID (found in Firebase Console → Project Settings)

3. **VITE_FIREBASE_API_KEY**
   - Value: Your Firebase API Key (found in Firebase Console → Project Settings → General)

4. **VITE_FIREBASE_AUTH_DOMAIN**
   - Value: `your-project-id.firebaseapp.com`

5. **VITE_FIREBASE_PROJECT_ID**
   - Value: Your Firebase project ID (same as above)

6. **VITE_FIREBASE_STORAGE_BUCKET**
   - Value: `your-project-id.appspot.com`

7. **VITE_FIREBASE_MESSAGING_SENDER_ID**
   - Value: Your messaging sender ID (found in Firebase Console → Project Settings → General)

8. **VITE_FIREBASE_APP_ID**
   - Value: Your Firebase App ID (found in Firebase Console → Project Settings → General)

9. **VITE_ML_SERVICE_URL** (Optional)
   - Value: Your ML service URL (e.g., `https://your-ml-service.railway.app` or `http://localhost:8000` for local)

## Step 3: Verify Workflow File

The workflow file is located at `.github/workflows/firebase-deploy.yml`

It will automatically:
- Build the frontend when code is pushed to `main` branch
- Deploy to Firebase Hosting
- Run on every push to main or manual trigger

## Step 4: Test Deployment

1. Make a small change to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   ```

3. Go to GitHub → **Actions** tab
4. You should see the workflow running
5. Once complete, check your Firebase Hosting URL

## Manual Deployment

You can also trigger deployment manually:
1. Go to GitHub → **Actions** tab
2. Select **Deploy to Firebase Hosting** workflow
3. Click **Run workflow** → **Run workflow**

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify Node.js version compatibility
- Check build logs in GitHub Actions

### Deployment Fails
- Verify `FIREBASE_SERVICE_ACCOUNT` secret is correct (full JSON)
- Check `FIREBASE_PROJECT_ID` matches your Firebase project
- Ensure Firebase Hosting is enabled in your Firebase project

### Environment Variables Not Working
- Make sure all `VITE_*` variables are set in GitHub secrets
- Variables must start with `VITE_` to be accessible in Vite builds
- Rebuild after adding new secrets

## Firebase Hosting Configuration

The `firebase.json` file in the `frontend` directory configures:
- Public directory: `dist` (Vite build output)
- Rewrites: All routes redirect to `index.html` for SPA routing

## Notes

- The workflow builds the frontend in the `frontend` directory
- Build output goes to `frontend/dist`
- Firebase Hosting serves from the `dist` directory
- Deployments are automatic on every push to `main` branch

